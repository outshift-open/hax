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
