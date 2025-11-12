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

import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const originalConsoleLog = console.log
console.log = () => {}
try {
  dotenv.config({ path: path.join(process.cwd(), ".env"), debug: false })
} catch {}

try {
  dotenv.config({ path: path.join(__dirname, "../../.env"), debug: false })
} catch {}
console.log = originalConsoleLog

export const ENV_CONFIG = {
  registrySource: process.env.HAX_REGISTRY_SOURCE || "github:main",

  defaultRegistry: process.env.HAX_DEFAULT_REGISTRY || "official",

  github: {
    repo: process.env.HAX_GITHUB_REPO || "outshift-open/hax",
    defaultBranch: process.env.HAX_GITHUB_DEFAULT_BRANCH || "main",
    token: process.env.GITHUB_TOKEN || process.env.HAX_GITHUB_TOKEN || "",
  },
  cdn: {
    baseUrl: process.env.HAX_CDN_BASE_URL || "",
  },
} as const

if (process.env.HAX_DEBUG_CONFIG === "true") {
  console.log("ENV_CONFIG:", ENV_CONFIG)
  console.log("HAX_REGISTRY_SOURCE env var:", process.env.HAX_REGISTRY_SOURCE)
}
