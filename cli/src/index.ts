#!/usr/bin/env node

import { Command } from "commander"
import { initCommand } from "@/commands/init"
import { listCommand } from "@/commands/list"
import { addCommand } from "@/commands/add"
import { logger } from "./utils/logger"
import { repo } from "./commands/repository"
import { configCommand } from "./commands/config"
import { admin } from "./commands/admin"

const program = new Command()

program
  .name("agntcy-hax")
  .description("CLI tool for managing HAX SDK components")
  .version("0.1.0")

// Register commands
program.addCommand(initCommand)
program.addCommand(addCommand)
program.addCommand(listCommand)
program.addCommand(repo)
program.addCommand(configCommand)
program.addCommand(admin)

// Parse CLI args
program.parse(process.argv)

// If no command was passed, show help
if (!process.argv.slice(2).length) {
  logger.debug("No command provided.")
  program.outputHelp()
}
