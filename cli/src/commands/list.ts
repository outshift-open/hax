import { Command } from "commander"
import { readConfig } from "../config"

import Table from "cli-table3"
import fs from "fs"
import path from "path"
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
      head: [chalk.white("Component Name"), chalk.white("Backend Tool")],
      style: { head: ["cyan"] },
    })

    components.forEach((name: string) => {
      const hasBackend = checkBackendExists(name, "backend")
      table.push([name, hasBackend ? chalk.green("Yes") : chalk.gray("No")])
    })

    logger.log(table.toString())
  })

function checkBackendExists(name: string, backendPath: string): boolean {
  const toolPath = path.join(backendPath, "tools", name, `${name}.py`)
  return fs.existsSync(toolPath)
}
