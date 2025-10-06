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
import { logger } from "@/utils/logger"
import { initializeRepository } from "./github-utils"

export const initRepoCommand = new Command()
  .name("init-repo")
  .description("Initialize a new HAX component repository")
  .option("--github <repo>", "GitHub repository to initialize")
  .option("--path <path>", "Local path to initialize", ".")
  .option("--create-remote", "Create GitHub repository and push files")
  .option("--private", "Create private repository (default: public)")
  .option("--token <token>", "GitHub token for repository creation")
  .action(async (options) => {
    if (!options.github) {
      logger.error("--github option is required")
      return
    }

    await initializeRepository(
      options.github,
      options.path,
      options.createRemote,
      options.token,
      options.private,
    )
  })
