import { Command } from "commander"
import { readConfig, updateConfig } from "@/config"
import { logger } from "@/utils/logger"

export const configCommand = new Command()
  .name("config")
  .description("Manage HAX configuration")
configCommand
  .command("set")
  .description("Set configuration values")
  .argument("<key>", "Configuration key (e.g., 'default-repo')")
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
    } else {
      logger.error(`Unknown configuration key: ${key}`)
    }
  })
