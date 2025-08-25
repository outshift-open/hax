import { Command } from "commander"
import fs from "fs"
import path from "path"
import { logger, highlighter } from "@/utils/logger"

export const validateRegistryCommand = new Command()
  .name("validate-registry")
  .description("Validate registry configuration and structure")
  .option("--path <path>", "Path to registry", ".")
  .option("--remote <url>", "Remote registry URL to validate")
  .option("--token <token>", "GitHub token for private repository access")
  .action(async (options) => {
    await validateRegistry(options.path, options.remote, options.token)
  })

export async function validateRegistry(
  registryPath: string,
  remoteUrl?: string,
  token?: string,
) {
  logger.info(`🔍 Validating registry at: ${highlighter.info(registryPath)}`)

  const errors: string[] = []
  const warnings: string[] = []

  const requiredDirs = ["cli/src/registry/github-registry", "hax"]

  requiredDirs.forEach((dir) => {
    const fullPath = path.join(registryPath, dir)
    if (!fs.existsSync(fullPath)) {
      errors.push(`Missing directory: ${dir}`)
    }
  })

  const registryFiles = ["artifacts.json", "ui.json", "composers.json"]
  const registryDir = path.join(
    registryPath,
    "cli/src/registry/github-registry",
  )

  registryFiles.forEach((file) => {
    const filePath = path.join(registryDir, file)
    if (fs.existsSync(filePath)) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, "utf-8"))
        logger.debug(`✅ ${file} is valid JSON`)

        Object.entries(content).forEach(([key, value]: [string, any]) => {
          if (!value.type || !value.files) {
            errors.push(`${file}: Component "${key}" missing required fields`)
          }
        })
      } catch (e) {
        errors.push(`${file}: Invalid JSON format`)
      }
    } else {
      warnings.push(`Optional file missing: ${file}`)
    }
  })

  if (remoteUrl) {
    logger.info(`🌐 Validating remote registry: ${remoteUrl}`)
    try {
      const githubMatch = remoteUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
      if (githubMatch) {
        const [, owner, repo] = githubMatch
        const baseUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/`

        const remoteFiles = ["artifacts.json", "ui.json", "composers.json"]
        const githubToken = token || process.env.GITHUB_TOKEN

        for (const file of remoteFiles) {
          const fileUrl = `${baseUrl}cli/src/registry/github-registry/${file}`
          try {
            const fetchOptions: RequestInit = {}

            if (githubToken) {
              fetchOptions.headers = {
                Authorization: `token ${githubToken}`,
                Accept: "application/vnd.github.v3.raw",
              }
            }

            const response = await fetch(fileUrl, fetchOptions)
            if (response.ok) {
              const content = await response.text()
              JSON.parse(content)
              logger.debug(`✅ Remote ${file} is valid`)
            } else if (response.status === 404) {
              warnings.push(`Remote file not found: ${file}`)
            } else {
              errors.push(`Failed to fetch remote ${file}: ${response.status}`)
            }
          } catch (e) {
            errors.push(`Invalid JSON in remote ${file}`)
          }
        }
      } else {
        warnings.push(
          "URL format not recognized. Expected GitHub repository URL",
        )
      }
    } catch (e) {
      errors.push(`Failed to validate remote registry: ${e}`)
    }
  }

  if (errors.length > 0) {
    logger.error("❌ Registry validation failed:")
    errors.forEach((error) => logger.error(`  • ${error}`))

    // Check if errors are primarily about missing directories
    const missingDirErrors = errors.filter((error) =>
      error.includes("Missing directory:"),
    )
    if (missingDirErrors.length > 0) {
      logger.error("")
      logger.error("💡 Tip: Are you in the right directory?")
    }
  } else {
    logger.success("✅ Registry validation passed!")
  }

  if (warnings.length > 0) {
    logger.warn("⚠️  Warnings:")
    warnings.forEach((warning) => logger.warn(`  • ${warning}`))
  }

  return errors.length === 0
}
