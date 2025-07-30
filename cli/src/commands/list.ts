import { Command } from "commander"
import { readConfig } from "../config"

import Table from "cli-table3"
import { logger } from "@/utils/logger"
import chalk from "chalk"

export const listCommand = new Command("list")
  .description("List all components currently in the config")
  .action(() => {
    const config = readConfig()
    const components = config.components

    if (!Array.isArray(components) || components.length === 0) {
      logger.debug("No components found in config.")
      return
    }

    logger.info("\n📦 Registered Components:\n")

    const table = new Table({
      head: [chalk.white("Component Name")],
      style: { head: ["cyan"] },
    })

    components.forEach((name: string) => {
      table.push([name])
    })

    logger.log(table.toString())
  })
