import fs from "fs"
import path from "path"
import { spawn } from "child_process"
import { ensurePathAliases } from "@/utils/project"
import { logger } from "@/utils/logger"
import { getRegistryItem, resolveRegistryDependencies } from "@/registry/api"
import {
  HaxConfig,
  RegistryItem,
  REGISTRY_FILE_TYPES,
  DIRECTORIES,
} from "../types"

async function collectDependencies(component: RegistryItem): Promise<{
  npmDependencies: string[]
  registryDependencies: RegistryItem[]
}> {
  const allDependencies = new Set<string>()

  // Add direct npm dependencies
  if (component.dependencies && component.dependencies.length > 0) {
    component.dependencies.forEach((dep: string) => allDependencies.add(dep))
  }

  // Resolve registry dependencies
  let allRegistryDeps: RegistryItem[] = []
  if (
    component.registryDependencies &&
    component.registryDependencies.length > 0
  ) {
    logger.debug(
      `Resolving ${component.registryDependencies.length} registry dependencies...`,
    )
    allRegistryDeps = await resolveRegistryDependencies(
      component.registryDependencies,
    )

    // Add npm dependencies from registry dependencies
    for (const dep of allRegistryDeps) {
      if (dep.dependencies && dep.dependencies.length > 0) {
        dep.dependencies.forEach((npmDep: string) =>
          allDependencies.add(npmDep),
        )
      }
    }
  }

  return {
    npmDependencies: Array.from(allDependencies),
    registryDependencies: allRegistryDeps,
  }
}

async function installDependencies(
  npmDependencies: string[],
  registryDependencies: RegistryItem[],
  config: HaxConfig,
) {
  if (npmDependencies.length > 0) {
    await installNPMDependencies(npmDependencies)
    logger.success("Installed packages")
  }

  if (registryDependencies.length > 0) {
    for (const dep of registryDependencies) {
      await installUIComponent(dep.name, config)
    }
    logger.success("Installed dependencies")
  }
}

async function copyComponentFiles(
  component: RegistryItem,
  name: string,
  config: HaxConfig,
) {
  for (const file of component.files) {
    if (!file.content) {
      logger.warn(`No content found for file: ${file.path}`)
      continue
    }

    if (file.type === REGISTRY_FILE_TYPES.COMPONENT) {
      const targetDir = path.join(config.artifacts.path, name)
      fs.mkdirSync(targetDir, { recursive: true })
      const targetPath = path.join(targetDir, path.basename(file.path))
      writeFileIfNotExists(targetPath, file.content, `component file`)
    }

    if (
      (
        [
          REGISTRY_FILE_TYPES.TYPES,
          REGISTRY_FILE_TYPES.HOOK,
          REGISTRY_FILE_TYPES.INDEX,
        ] as string[]
      ).includes(file.type)
    ) {
      const targetDir = path.join(config.artifacts.path, name)
      fs.mkdirSync(targetDir, { recursive: true })
      const targetPath = path.join(targetDir, path.basename(file.path))
      writeFileIfNotExists(targetPath, file.content, `${file.type} file`)
    }
  }
}

export async function generateComponent(
  name: string,
  includeBackendTools: boolean,
  config: HaxConfig,
) {
  // Input validation
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw new Error("Component name is required and must be a non-empty string")
  }

  if (!/^[a-zA-Z0-9-_]+$/.test(name.trim())) {
    throw new Error(
      "Component name can only contain letters, numbers, hyphens, and underscores",
    )
  }

  if (typeof includeBackendTools !== "boolean") {
    throw new Error("includeBackendTools must be a boolean value")
  }

  if (!config || typeof config !== "object") {
    throw new Error("Valid configuration object is required")
  }

  const componentName = name.trim()

  if (!Array.isArray(config.components)) {
    config.components = []
  }

  const component = await getRegistryItem(componentName, "local")
  if (!component) {
    throw new Error(
      `Component "${componentName}" not found in registry. Available components can be listed with 'hax list'.`,
    )
  }

  logger.info(
    `📦 Found ${componentName} in registry with ${component.files.length} files`,
  )

  // Configure path aliases before installing dependencies or copying files
  try {
    await ensurePathAliases(process.cwd())
    logger.debug(`Configured path aliases for project`)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.warn(
      `Could not configure path aliases (continuing anyway): ${errorMessage}`,
    )
    logger.debug(
      `This may cause import resolution issues. Ensure your tsconfig.json or jsconfig.json has proper path mapping.`,
    )
  }

  // Collectand install all dependencies
  const { npmDependencies, registryDependencies } =
    await collectDependencies(component)

  await installDependencies(npmDependencies, registryDependencies, config)

  await copyComponentFiles(component, componentName, config)

  await ensureUtilsFile(config)

  logger.success(`Added ${componentName} component`)

  if (includeBackendTools) {
    // For now, we are creating a placeholder backend folder
    const backendDir = path.join(DIRECTORIES.BACKEND_TOOLS, componentName)
    fs.mkdirSync(backendDir, { recursive: true })
    fs.writeFileSync(
      path.join(backendDir, `${componentName}.py`),
      `# ${componentName} backend tool`,
    )
    logger.success(`✅ Created backend tool folder at ${backendDir}`)
  }
  if (!config.components.includes(componentName)) {
    config.components.push(componentName)
  }
}

async function installNPMDependencies(dependencies: string[]) {
  return new Promise<void>((resolve, reject) => {
    logger.info(
      `Installing ${dependencies.length} npm packages: ${dependencies.join(", ")}`,
    )
    logger.debug("This might take a couple of minutes...")

    const npmProcess = spawn("npm", ["install", ...dependencies], {
      stdio: "pipe",
      shell: true,
    })

    npmProcess.on("close", (code: number) => {
      if (code === 0) {
        resolve()
      } else {
        const errorMessage = `NPM install failed with exit code ${code}. Check your network connection and npm configuration.`
        logger.error(`❌ ${errorMessage}`)
        reject(new Error(errorMessage))
      }
    })

    npmProcess.on("error", (error: Error) => {
      const errorMessage = `NPM install process error: ${error.message}. Ensure npm is installed and accessible.`
      logger.error(`❌ ${errorMessage}`)
      reject(new Error(errorMessage))
    })
  })
}

function writeFileIfNotExists(
  targetPath: string,
  content: string,
  description: string,
) {
  if (!fs.existsSync(targetPath)) {
    try {
      const targetDir = path.dirname(targetPath)
      fs.mkdirSync(targetDir, { recursive: true })

      fs.writeFileSync(targetPath, content)
      logger.debug(`✅ Created ${description} at ${targetPath}`)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      logger.error(
        `Failed to write ${description} to "${targetPath}": ${errorMessage}`,
      )
      throw error
    }
  } else {
    logger.debug(`⏭️ Skipped ${description} (already exists): ${targetPath}`)
  }
}

async function installUIComponent(name: string, _config: HaxConfig) {
  // Get the UI component from registry
  const uiComponent = await getRegistryItem(name, "local")
  if (!uiComponent) {
    logger.warn(`UI component "${name}" not found in registry`)
    return
  }

  logger.debug(`Installing UI component: ${name}`)

  // Copy UI component files to components/ui directory
  for (const file of uiComponent.files) {
    if (!file.content) {
      logger.warn(`No content found for UI component file: ${file.path}`)
      continue
    }

    // UI components go to components/ui directory
    const targetDir = path.resolve(DIRECTORIES.UI_COMPONENTS)
    fs.mkdirSync(targetDir, { recursive: true })
    const targetPath = path.join(targetDir, path.basename(file.path))

    writeFileIfNotExists(targetPath, file.content, `UI component file`)
  }
}

// Ensure lib/utils.ts exists. Only copy if it doesn't already exist.
async function ensureUtilsFile(_config: HaxConfig) {
  const utilsTargetDir = path.resolve(DIRECTORIES.LIB)
  fs.mkdirSync(utilsTargetDir, { recursive: true })
  const utilsTargetPath = path.join(utilsTargetDir, "utils.ts")

  // If utils file doesn't exist, create it with a basic template
  if (!fs.existsSync(utilsTargetPath)) {
    // Basic utils template - in the future this could come from registry too
    const utilsContent = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwindcss-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`

    await writeFileIfNotExists(utilsTargetPath, utilsContent, "utils file")
  }
}
