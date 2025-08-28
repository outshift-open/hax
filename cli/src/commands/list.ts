import { Command } from "commander"
import { readConfig } from "../config"
import { ComponentItem } from "@/types"

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
      ...components.map((comp: ComponentItem) =>
        typeof comp === "string"
          ? { name: comp, type: "artifact" }
          : { ...comp, type: "artifact" },
      ),
      ...features.map((feat: ComponentItem) =>
        typeof feat === "string"
          ? { name: feat, type: "composer" }
          : { ...feat, type: "composer" },
      ),
      ...adapters.map((adapt: ComponentItem) =>
        typeof adapt === "string"
          ? { name: adapt, type: "adapter" }
          : { ...adapt, type: "adapter" },
      ),
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

    allItems.forEach(
      (item: { name: string; type: string; source?: string }) => {
        const name = item.name
        const source = chalk.yellow(item.source || "—")
        const type = item.type || "unknown"

        table.push([name, chalk.blue(type), source])
      },
    )

    logger.log(table.toString())
  })
