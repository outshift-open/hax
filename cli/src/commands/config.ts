import { Command } from "commander"
import { readConfig, updateConfig } from "@/config"
import { logger } from "@/utils/logger"

export const configCommand = new Command()
  .name("config")
  .description("Manage HAX configuration")

configCommand
  .command("set")
  .description("Set configuration values")
  .argument(
    "<key>",
    "Configuration key (e.g., 'default-repo', 'repo-priority')",
  )
  .argument("<value>", "Configuration value")
  .action((key: string, value: string) => {
    const config = readConfig()

    if (key === "default-repo") {
      if (!config.registries) {
        logger.error(
          "No repositories configured. Add repositories first with 'hax repo add'",
        )
        return
      }

      if (!config.registries.sources[value]) {
        logger.error(`Repository "${value}" not found`)
        return
      }

      config.registries.default = value
      updateConfig(config)
      logger.info(`✅ Set default repository to "${value}"`)
    } else if (key === "repo-priority") {
      if (!config.registries) {
        logger.error(
          "No repositories configured. Add repositories first with 'hax repo add'",
        )
        return
      }

      const repoNames = value.split(",").map((name) => name.trim())
      const invalidRepos = repoNames.filter(
        (name) => !config.registries!.sources[name],
      )

      if (invalidRepos.length > 0) {
        logger.error(`Invalid repositories: ${invalidRepos.join(", ")}`)
        return
      }

      const allRepos = Object.keys(config.registries.sources)
      const missingRepos = allRepos.filter((repo) => !repoNames.includes(repo))

      if (missingRepos.length > 0) {
        logger.warn(
          `Adding missing repositories to end of priority: ${missingRepos.join(", ")}`,
        )
        repoNames.push(...missingRepos)
      }

      config.registries.fallback = repoNames
      updateConfig(config)
      logger.info(`✅ Updated repository priority: ${repoNames.join(" → ")}`)
    } else {
      logger.error(`Unknown configuration key: ${key}`)
    }
  })
