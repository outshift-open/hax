import { Command } from "commander"
import { logger, highlighter } from "@/utils/logger"
import { readConfig, updateConfig } from "@/config"

export const repo = new Command()
  .name("repo")
  .description("Manage HAX component repositories")

repo
  .command("add")
  .description("Add a custom repository")
  .argument("<name>", "Repository alias name (e.g., 'internal', 'partner')")
  .option("--github <repo>", "GitHub repository (owner/repo)")
  .option("--branch <branch>", "Branch to use", "main")
  .option(
    "--token <token>",
    "GitHub token for authentication (not stored, use GITHUB_TOKEN env var instead)",
  )
  .option(
    "--github-url <url>",
    "Custom GitHub Enterprise URL (e.g., https://github.yourcompany.com)",
  )
  .action(async (name: string, options) => {
    if (!options.github) {
      logger.error("--github option is required")
      return
    }
    const config = readConfig()

    if (!config.registries) {
      config.registries = {
        default: "main",
        fallback: ["main"],
        sources: {
          main: {
            type: "github",
            repo: "cisco-eti/agntcy-hax",
            branch: "main",
          },
        },
      }
    }

    const newSource: any = {
      type: "github",
      repo: options.github,
      branch: options.branch,
    }

    if (options.githubUrl) {
      newSource.githubUrl = options.githubUrl
    }

    config.registries!.sources[name] = newSource
    if (!config.registries!.fallback.includes(name)) {
      config.registries!.fallback.push(name)
    }

    updateConfig(config)
    logger.info(`✅ Added repository "${name}" (${options.github})`)
  })

repo
  .command("list")
  .description("List configured repositories")
  .action(() => {
    const config = readConfig()

    if (!config.registries?.sources) {
      logger.info("No repositories configured")
      return
    }

    const customRepos = Object.entries(config.registries.sources).filter(
      ([name]) => name !== "official",
    )

    if (customRepos.length === 0) {
      logger.info("No custom repositories configured")
      logger.info("\n📦 Official Repository:")
      const officialRepo = config.registries.sources.official
      if (officialRepo) {
        const isDefault = config.registries.default === "official"
        const marker = isDefault ? highlighter.accent("[default]") : "         "
        logger.info(
          `${marker} official: ${officialRepo.repo} (${officialRepo.branch})`,
        )
      }
      return
    }

    logger.info("\n📦 Configured Repositories:")
    Object.entries(config.registries.sources).forEach(([name, source]) => {
      const isDefault = name === config.registries!.default
      const marker = isDefault ? highlighter.accent("[default]") : "         "
      const repoType = name === "main" ? " (main)" : ""
      logger.info(
        `${marker} ${name}: ${source.repo} (${source.branch})${repoType}`,
      )
    })
  })

repo
  .command("switch")
  .description("Switch default repository")
  .argument("<name>", "Repository name")
  .action((name: string) => {
    const config = readConfig()

    if (!config.registries?.sources[name]) {
      logger.error(`❌ Repository "${name}" not found`)
      return
    }

    config.registries.default = name
    updateConfig(config)
    logger.info(`✅ Switched default repository to "${name}"`)
  })

repo
  .command("remove")
  .description("Remove a custom repository")
  .argument("<name>", "Repository alias name to remove")
  .action((name: string) => {
    const config = readConfig()

    if (name === "official") {
      logger.error("❌ Cannot remove the official repository")
      return
    }

    if (!config.registries?.sources[name]) {
      logger.error(`❌ Repository "${name}" not found`)
      return
    }

    delete config.registries.sources[name]

    config.registries.fallback = config.registries.fallback.filter(
      (repo) => repo !== name,
    )

    if (config.registries.default === name) {
      config.registries.default = "official"
      logger.warn(`⚠️  Reset default repository to "official"`)
    }

    updateConfig(config)
    logger.info(`✅ Removed repository "${name}"`)
  })
