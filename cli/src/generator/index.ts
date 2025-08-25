import fs from "fs"
import path from "path"
import { spawn } from "child_process"
import { ensurePathAliases } from "@/utils/project"
import { logger } from "@/utils/logger"
import { updateConfig } from "@/config"
import { getComposersPath } from "@/utils/paths"
import {
  getRegistryItem,
  resolveRegistryDependencies,
  getRegistryDependency,
} from "@/registry/api"
import { readComponentFile } from "@/utils/registry"
import {
  HaxConfig,
  RegistryItem,
  REGISTRY_FILE_TYPES,
  DIRECTORIES,
} from "../types"
import { getPinnedDependency } from "../config/versions"

async function collectDependencies(
  component: RegistryItem,
  source?: string,
): Promise<{
  npmDependencies: string[]
  registryDependencies: RegistryItem[]
}> {
  const allDependencies = new Set<string>()

  // Add direct npm dependencies
  if (component.dependencies && component.dependencies.length > 0) {
    component.dependencies.forEach((dep: string) =>
      allDependencies.add(getPinnedDependency(dep)),
    )
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

    // Add npm dependencies from registry dependencies with version pinning
    for (const dep of allRegistryDeps) {
      if (dep.dependencies && dep.dependencies.length > 0) {
        dep.dependencies.forEach((npmDep: string) =>
          allDependencies.add(getPinnedDependency(npmDep)),
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
  createdFiles: string[],
  source?: string,
) {
  const getBaseDir = (componentType: string) => {
    switch (componentType) {
      case "registry:composer":
        return config.composers?.path ?? "src/hax/composers"
      case "registry:adapter":
        return config.adapters?.path ?? "src/hax/adapters"
      case "registry:artifacts":
      default:
        return config.artifacts?.path ?? "src/hax/artifacts"
    }
  }

  const baseDir = getBaseDir(component.type)

  for (const file of component.files) {
    if (!file.content) {
      logger.warn(`No content found for file: ${file.path}`)
      continue
    }

    const relativePath = file.path
      .replace(`hax/composer/${name}/`, "")
      .replace(`hax/artifacts/${name}/`, "")
      .replace(`hax/adapter/${name}/`, "")
    const targetDir = path.join(baseDir, name)
    const fullTargetPath = path.join(targetDir, relativePath)

    const targetFileDir = path.dirname(fullTargetPath)
    fs.mkdirSync(targetFileDir, { recursive: true })

    if (file.type === REGISTRY_FILE_TYPES.COMPONENT) {
      // Add source attribution comment to the top of component files
      const sourceAttribution = `// HAX Component: ${name}\n// Source: ${source || "main"}\n// Generated: ${new Date().toISOString().split("T")[0]}\n\n`
      const contentWithAttribution = sourceAttribution + (file.content || "")

      writeFileIfNotExists(
        fullTargetPath,
        contentWithAttribution,
        `component file`,
        createdFiles,
      )
    }

    if (
      (
        [
          REGISTRY_FILE_TYPES.TYPES,
          REGISTRY_FILE_TYPES.HOOK,
          REGISTRY_FILE_TYPES.INDEX,
          REGISTRY_FILE_TYPES.CONSTANTS,
          REGISTRY_FILE_TYPES.LIB,
          REGISTRY_FILE_TYPES.MIDDLEWARE,
          REGISTRY_FILE_TYPES.STATE,
        ] as string[]
      ).includes(file.type)
    ) {
      writeFileIfNotExists(
        fullTargetPath,
        file.content,
        `${file.type} file`,
        createdFiles,
      )
    }

    if (file.type === REGISTRY_FILE_TYPES.DESCRIPTION) {
      writeFileIfNotExists(
        fullTargetPath,
        file.content,
        `description file`,
        createdFiles,
      )
    }
  }
}

export async function generateComponent(
  name: string,
  config: HaxConfig,
  cachedComponent?: RegistryItem,
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

  if (!config || typeof config !== "object") {
    throw new Error("Valid configuration object is required")
  }

  const componentName = name.trim()
  const createdFiles: string[] = []

  if (!Array.isArray(config.components)) {
    config.components = []
  }

  const component = cachedComponent || (await getRegistryItem(componentName))
  if (!component) {
    throw new Error(
      `Component "${componentName}" not found in registry. ` +
        `If using a private repository, ensure GITHUB_TOKEN is set or use --token flag.`,
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

  // Collect and install all dependencies
  const { npmDependencies, registryDependencies } = await collectDependencies(
    component,
    component.source,
  )

  await installDependencies(npmDependencies, registryDependencies, config)

  await copyComponentFiles(
    component,
    componentName,
    config,
    createdFiles,
    component.source,
  )

  await ensureUtilsFile(config, createdFiles)

  if (createdFiles.length > 0) {
    logger.success("✅ Created:")
    createdFiles.forEach((file) => {
      logger.info(`- ${file}`)
    })
  }
}

async function installNPMDependencies(dependencies: string[]) {
  return new Promise<void>((resolve, reject) => {
    logger.info(
      `Installing ${dependencies.length} npm packages: ${dependencies.join(", ")}`,
    )
    logger.debug("This might take a couple of minutes...")

    // Separate pinned and regular dependencies
    const pinnedDeps: string[] = []
    const regularDeps: string[] = []

    dependencies.forEach((dep) => {
      const pinnedVersion = getPinnedDependency(dep)
      if (pinnedVersion !== dep) {
        pinnedDeps.push(pinnedVersion)
      } else {
        regularDeps.push(dep)
      }
    })

    const installPromises: Promise<void>[] = []

    if (pinnedDeps.length > 0) {
      installPromises.push(installWithFlags(pinnedDeps, ["--save-exact"]))
    }

    if (regularDeps.length > 0) {
      installPromises.push(installWithFlags(regularDeps, []))
    }

    Promise.all(installPromises)
      .then(() => resolve())
      .catch(reject)
  })
}

function installWithFlags(
  dependencies: string[],
  flags: string[],
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const args = ["install", ...flags, ...dependencies]
    const npmProcess = spawn("npm", args, {
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
  createdFiles?: string[],
) {
  if (!fs.existsSync(targetPath)) {
    try {
      const targetDir = path.dirname(targetPath)
      fs.mkdirSync(targetDir, { recursive: true })

      fs.writeFileSync(targetPath, content)

      if (createdFiles && Array.isArray(createdFiles)) {
        const relativePath = path.relative(process.cwd(), targetPath)
        createdFiles.push(relativePath)
      } else if (!createdFiles) {
        logger.debug(`✅ Created ${description} at ${targetPath}`)
      }
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

// Get the UI component from registry dependencies
async function installUIComponent(name: string, _config: HaxConfig) {
  const uiComponent = await getRegistryDependency(name)
  if (!uiComponent) {
    logger.warn(`UI component "${name}" not found in registry`)
    return
  }

  for (const file of uiComponent.files) {
    if (!file.content) {
      logger.warn(`No content found for UI component file: ${file.path}`)
      continue
    }

    // Determine target directory based on component name
    const targetDir =
      name === "generated-ui-wrapper"
        ? path.resolve(DIRECTORIES.COMPONENTS)
        : path.resolve(DIRECTORIES.UI_COMPONENTS)

    fs.mkdirSync(targetDir, { recursive: true })
    const targetPath = path.join(targetDir, path.basename(file.path))
    writeFileIfNotExists(targetPath, file.content, `UI component file`, [])
  }
}

// Ensure lib/utils.ts exists. Only copy if it doesn't already exist.
async function ensureUtilsFile(_config: HaxConfig, createdFiles: string[]) {
  const utilsTargetDir = path.resolve(DIRECTORIES.LIB)
  fs.mkdirSync(utilsTargetDir, { recursive: true })
  const utilsTargetPath = path.join(utilsTargetDir, "utils.ts")

  if (!fs.existsSync(utilsTargetPath)) {
    try {
      const utilsContent = readComponentFile("hax/lib/utils.ts")

      if (utilsContent) {
        writeFileIfNotExists(
          utilsTargetPath,
          utilsContent,
          "utils file",
          createdFiles,
        )
        return
      } else {
        throw new Error("Utils file content is empty or could not be read")
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      logger.error(`❌ Failed to create utils file: ${errorMessage}`)
      throw new Error(
        `Cannot create utils file. The CLI could not read the source utils file from hax/lib/utils.ts. ` +
          `This may indicate a problem with the CLI installation or file permissions. ` +
          `Please check your installation and try again.`,
      )
    }
  }
}
