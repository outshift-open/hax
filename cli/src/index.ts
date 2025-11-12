#!/usr/bin/env node

/*
 * Copyright 2025 Cisco Systems, Inc. and its affiliates
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Command } from "commander"
import { initCommand } from "@/commands/init"
import { listCommand } from "@/commands/list"
import { addCommand } from "@/commands/add"
import { removeCommand } from "@/commands/remove"
import { logger } from "./utils/logger"
import { repo } from "./commands/repository"
import { configCommand } from "./commands/config"
import { admin } from "./commands/admin"
import { readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf-8"),
)
const version = packageJson.version

const program = new Command()

program
  .name("hax")
  .description("CLI tool for managing HAX SDK components")
  .version(version)

// Register commands
program.addCommand(initCommand)
program.addCommand(addCommand)
program.addCommand(removeCommand)
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
