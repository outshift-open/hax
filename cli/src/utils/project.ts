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

import fs from "fs"
import path from "path"
import { logger } from "./logger"
import { ProjectConfig } from "@/types"

export function isTypeScriptProject(cwd: string): boolean {
  const tsConfigFiles = [
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.web.json",
  ]

  return tsConfigFiles.some((file) => fs.existsSync(path.resolve(cwd, file)))
}

export function getConfigFileName(cwd: string): string {
  return isTypeScriptProject(cwd) ? "tsconfig.json" : "jsconfig.json"
}

export async function ensurePathAliases(
  cwd: string,
  aliasPrefix = "@",
): Promise<void> {
  const configFileName = getConfigFileName(cwd)
  const configPath = path.resolve(cwd, configFileName)

  let config: ProjectConfig = {}
  let canParseExisting = true

  // Read existing config if it exists
  if (fs.existsSync(configPath)) {
    try {
      const content = fs.readFileSync(configPath, "utf8")
      const cleanContent = content
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/.*$/gm, "")
      config = JSON.parse(cleanContent)
    } catch {
      canParseExisting = false
    }
  }

  // If we can't parse existing config, don't modify it
  if (!canParseExisting) {
    return
  }

  if (!config.compilerOptions) {
    config.compilerOptions = {}
  }

  // Check if path aliases already exist and add configuration if missing
  const hasBaseUrl = config.compilerOptions.baseUrl
  const hasPaths =
    config.compilerOptions.paths &&
    Object.keys(config.compilerOptions.paths).some(
      (key) => key.startsWith(`${aliasPrefix}/`) || key === `${aliasPrefix}/*`,
    )

  if (hasBaseUrl && hasPaths) {
    logger.debug(`${configFileName} already has required path aliases`)
    return
  }

  if (!hasBaseUrl) {
    config.compilerOptions.baseUrl = "."
  }

  if (!config.compilerOptions.paths) {
    config.compilerOptions.paths = {}
  }

  const aliasKey = `${aliasPrefix}/*`
  if (!config.compilerOptions.paths[aliasKey]) {
    config.compilerOptions.paths[aliasKey] = ["./src/*"]
  }

  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`)

  logger.log(`✓ Updated ${configFileName} with path aliases`)
}
