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
import { initRepoCommand } from "./init-repo"
import { generateTemplateCommand } from "./template-generator"
import { validateRegistryCommand } from "./registry-validator"
import { manageAccessCommand } from "./access-manager"

export const admin = new Command()
  .name("admin")
  .description("Administrative commands for HAX registries")

admin.addCommand(initRepoCommand)
admin.addCommand(generateTemplateCommand)
admin.addCommand(validateRegistryCommand)
admin.addCommand(manageAccessCommand)
