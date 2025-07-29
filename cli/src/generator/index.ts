import fs from "fs"
import path from "path"
import { spawn } from "child_process"
import { HaxConfig } from "@/config"
import { ensurePathAliases, isTypeScriptProject } from "@/utils/project"

import {
  getRegistryItem,
  resolveRegistryDependencies,
  WORKSPACE_ROOT,
  type RegistryItem,
} from "@/api/registry"
import { logger } from "@/utils/logger"

export async function generateComponent(
  name: string,
  addBackend: boolean,
  config: HaxConfig,
) {
  if (!Array.isArray(config.components)) {
    config.components = []
  }

  const component = await getRegistryItem(name, "local")
  if (!component) {
    throw new Error(`Component "${name}" not found in registry`)
  }

  logger.info(
    `📦 Found ${name} in registry with ${component.files.length} files`,
  )

  // Configure path aliases before installing dependencies or copying files
  try {
    await ensurePathAliases(process.cwd())
    logger.debug(`Configured path aliases`)
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.warn(`Could not configure path aliases: ${error.message}`)
    } else {
      logger.warn(`Could not configure path aliases: ${String(error)}`)
    }
  }

  // Collect all NPM dependencies upfront, resolve registry dependencies once and cache the result, and add NPM dependencies from UI components
  const allDependencies = new Set<string>()

  if (component.dependencies && component.dependencies.length > 0) {
    component.dependencies.forEach((dep: string) => allDependencies.add(dep))
  }

  let allRegistryDeps: RegistryItem[] = []
  if (component.registryDependencies) {
    allRegistryDeps = await resolveRegistryDependencies(
      component.registryDependencies,
    )
    for (const dep of allRegistryDeps) {
      if (dep.dependencies && dep.dependencies.length > 0) {
        dep.dependencies.forEach((npmDep: string) =>
          allDependencies.add(npmDep),
        )
      }
    }
  }

  if (allDependencies.size > 0) {
    const dependencyArray = Array.from(allDependencies)
    await installNPMDependencies(dependencyArray)
    logger.success("Installed packages")
  }

  if (allRegistryDeps.length > 0) {
    for (const dep of allRegistryDeps) {
      await installUIComponent(dep.name, config)
    }
    logger.success("Installed dependencies")
  }

  for (const file of component.files) {
    const sourcePath = path.join(WORKSPACE_ROOT, file.path)

    if (file.type === "registry:component") {
      const targetDir = path.join(config.artifacts.path, name)
      fs.mkdirSync(targetDir, { recursive: true })

      const targetPath = path.join(targetDir, path.basename(file.path))
      try {
        fs.copyFileSync(sourcePath, targetPath)
      } catch (error) {
        logger.error(
          `Failed to copy component file: ${error instanceof Error ? error.message : String(error)}`,
        )
        throw error
      }
    }

    if (
      ["registry:types", "registry:hook", "registry:index"].includes(file.type)
    ) {
      const targetDir = path.join(config.artifacts.path, name)
      fs.mkdirSync(targetDir, { recursive: true })

      const targetPath = path.join(targetDir, path.basename(file.path))
      try {
        fs.copyFileSync(sourcePath, targetPath)
      } catch (error) {
        logger.error(
          `Failed to copy ${file.type} file: ${error instanceof Error ? error.message : String(error)}`,
        )
        throw error
      }
    }
  }

  await ensureUtilsFile(config)

  logger.success(`Added ${name} component`)

  if (addBackend) {
    // For now, create in a generic backend folder since we don't have a specific backend path in config
    const backendDir = path.join("backend", "tools", name)
    fs.mkdirSync(backendDir, { recursive: true })
    fs.writeFileSync(
      path.join(backendDir, `${name}.py`),
      `# ${name} backend tool`,
    )
    logger.success(`✅ Created backend tool placeholder at ${backendDir}`)
  }

  // Add to config.components if not already listed
  if (!config.components.includes(name)) {
    config.components.push(name)
  }
}

async function installNPMDependencies(dependencies: string[]) {
  return new Promise<void>((resolve, reject) => {
    logger.info("Installing packages. This might take a couple of minutes.")

    const npmProcess = spawn("npm", ["install", ...dependencies], {
      stdio: "pipe",
      shell: true,
    })

    npmProcess.on("close", (code: number) => {
      if (code === 0) {
        resolve()
      } else {
        logger.error(`❌ NPM install failed with code ${code}`)
        reject(new Error(`NPM install failed with code ${code}`))
      }
    })

    npmProcess.on("error", (error: Error) => {
      logger.error(`❌ NPM install error: ${error.message}`)
      reject(error)
    })
  })
}

async function installUIComponent(name: string, _config: HaxConfig) {
  // Use project detection to prioritize correct extensions and order extensions based on project type
  const isTS = isTypeScriptProject(process.cwd())

  const possibleExtensions = isTS
    ? [".tsx", ".ts", ".jsx", ".js", ".vue"]
    : [".jsx", ".js", ".tsx", ".ts", ".vue"]

  let uiSourcePath: string | null = null
  let foundExtension: string | null = null

  for (const ext of possibleExtensions) {
    const candidatePath = path.join(
      WORKSPACE_ROOT,
      "hax",
      "components",
      "ui",
      `${name}${ext}`,
    )
    if (fs.existsSync(candidatePath)) {
      uiSourcePath = candidatePath
      foundExtension = ext
      break
    }
  }

  if (!uiSourcePath || !foundExtension) {
    logger.warn(`UI component "${name}" not found with any supported extension`)
    return
  }

  const uiTargetDir = path.resolve("src", "components", "ui")
  fs.mkdirSync(uiTargetDir, { recursive: true })

  const uiTargetPath = path.join(uiTargetDir, `${name}${foundExtension}`)

  // Only copy if it doesn't already exist and fix import paths after copying
  if (!fs.existsSync(uiTargetPath)) {
    try {
      fs.copyFileSync(uiSourcePath, uiTargetPath)

      const content = fs.readFileSync(uiTargetPath, "utf-8")
      const fixedContent = content.replace(
        /from ["']\.\.\/lib\/utils["']/g,
        'from "@/lib/utils"',
      )
      fs.writeFileSync(uiTargetPath, fixedContent)
    } catch (error) {
      logger.error(
        `Failed to install UI component "${name}": ${error instanceof Error ? error.message : String(error)}`,
      )
      throw error
    }
  }
}

// Ensure lib/utils.ts exists. Only copy if it doesn't already exist.
async function ensureUtilsFile(_config: HaxConfig) {
  const utilsSourcePath = path.join(WORKSPACE_ROOT, "hax", "lib", "utils.ts")
  const utilsTargetDir = path.resolve("src", "lib")
  fs.mkdirSync(utilsTargetDir, { recursive: true })
  const utilsTargetPath = path.join(utilsTargetDir, "utils.ts")
  if (!fs.existsSync(utilsTargetPath)) {
    try {
      fs.copyFileSync(utilsSourcePath, utilsTargetPath)
    } catch (error) {
      logger.error(
        `Failed to copy utils file: ${error instanceof Error ? error.message : String(error)}`,
      )
      throw error
    }
  }
}
