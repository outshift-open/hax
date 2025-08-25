import fs from "fs"
import path from "path"
import { logger } from "./logger"
import { ProjectConfig } from "@/types"

export function isTypeScriptProject(cwd: string): boolean {
  const tsConfigFiles = [
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.web.json",
  ]

  return tsConfigFiles.some((file) => fs.existsSync(path.resolve(cwd, file)))
}

export function getConfigFileName(cwd: string): string {
  return isTypeScriptProject(cwd) ? "tsconfig.json" : "jsconfig.json"
}

export async function ensurePathAliases(
  cwd: string,
  aliasPrefix = "@",
): Promise<void> {
  const configFileName = getConfigFileName(cwd)
  const configPath = path.resolve(cwd, configFileName)

  let config: ProjectConfig = {}
  let canParseExisting = true

  // Read existing config if it exists
  if (fs.existsSync(configPath)) {
    try {
      const content = fs.readFileSync(configPath, "utf8")
      const cleanContent = content
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/.*$/gm, "")
      config = JSON.parse(cleanContent)
    } catch {
      logger.warn(
        `Warning: Could not parse ${configFileName}, skipping path alias update`,
      )
      canParseExisting = false
    }
  }

  // If we can't parse existing config, don't modify it
  if (!canParseExisting) {
    return
  }

  if (!config.compilerOptions) {
    config.compilerOptions = {}
  }

  // Check if path aliases already exist and add configuration if missing
  const hasBaseUrl = config.compilerOptions.baseUrl
  const hasPaths =
    config.compilerOptions.paths &&
    Object.keys(config.compilerOptions.paths).some(
      (key) => key.startsWith(`${aliasPrefix}/`) || key === `${aliasPrefix}/*`,
    )

  if (hasBaseUrl && hasPaths) {
    logger.debug(`${configFileName} already has required path aliases`)
    return
  }

  if (!hasBaseUrl) {
    config.compilerOptions.baseUrl = "."
  }

  if (!config.compilerOptions.paths) {
    config.compilerOptions.paths = {}
  }

  const aliasKey = `${aliasPrefix}/*`
  if (!config.compilerOptions.paths[aliasKey]) {
    config.compilerOptions.paths[aliasKey] = ["./src/*"]
  }

  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`)

  logger.log(`✓ Updated ${configFileName} with path aliases`)
}
