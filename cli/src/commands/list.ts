import { Command } from "commander"
import { readConfig } from "../config"

import Table from "cli-table3"
import { logger } from "@/utils/logger"
import chalk from "chalk"

export const listCommand = new Command("list")
  .description("List all components currently in the config")
  .action(() => {
    const config = readConfig()
    const components = config.components || []
    const features = config.features || []
    const adapters = config.installedAdapters || []

    const allItems = [
      ...components.map((comp: any) => ({ ...comp, type: "artifact" })),
      ...features.map((feat: any) => ({ ...feat, type: "composer" })),
      ...adapters.map((adapt: any) => ({ ...adapt, type: "adapter" })),
    ]

    if (allItems.length === 0) {
      logger.debug("No components found in config.")
      return
    }

    logger.info("\n📦 Installed Components:\n")

    const table = new Table({
      head: [
        chalk.white("Component"),
        chalk.white("Type"),
        chalk.white("Source"),
      ],
      style: { head: ["cyan"] },
    })

    allItems.forEach((item: any) => {
      const name = typeof item === "string" ? item : item.name
      const source =
        typeof item === "string"
          ? chalk.gray("—")
          : chalk.yellow(item.source || "—")
      const type = item.type || "unknown"

      table.push([name, chalk.blue(type), source])
    })

    logger.log(table.toString())
  })
