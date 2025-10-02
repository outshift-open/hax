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
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Read component file content at build time for registry inclusion
 * @param relativePath - Path relative to workspace root
 */
export function readComponentFile(relativePath: string): string {
  let projectRoot: string

  if (__dirname.includes("/dist") || __filename.includes("/dist/")) {
    // Built: cli/dist -> workspace root
    projectRoot = path.resolve(__dirname, "../..")
  } else {
    // Dev: cli/src/utils -> workspace root
    projectRoot = path.resolve(__dirname, "../../..")
  }

  const fullPath = path.resolve(projectRoot, relativePath)

  try {
    return fs.readFileSync(fullPath, "utf-8")
  } catch (error) {
    throw new Error(
      `Failed to read component file "${relativePath}" from "${fullPath}": ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    )
  }
}
