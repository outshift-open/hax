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
    } else {
      logger.error(`Unknown configuration key: ${key}`)
    }
  })
