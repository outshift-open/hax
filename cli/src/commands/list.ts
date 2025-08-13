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

    logger.info("\n📦 Installed Components:\n")

    const table = new Table({
      head: [chalk.white("Component"), chalk.white("Source")],
      style: { head: ["cyan"] },
    })

    components.forEach((comp: any) => {
      if (typeof comp === "string") {
        table.push([comp, chalk.gray("—")])
      } else {
        table.push([comp.name, chalk.yellow(comp.source || "—")])
      }
    })

    logger.log(table.toString())
  })
