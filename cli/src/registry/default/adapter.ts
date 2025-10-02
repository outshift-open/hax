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

import { RegistryItem } from "@/types"
import { readComponentFile } from "@/utils/registry"

export const adapter: RegistryItem[] = [
  {
    name: "base-adapter",
    type: "registry:adapter",
    dependencies: [
      "@copilotkit/shared",
      "@copilotkit/runtime",
      "@copilotkit/runtime-client-gql",
    ],
    registryDependencies: [],
    files: [
      {
        path: "hax/adapter/base-adapter.ts",
        type: "registry:component",
        content: readComponentFile("hax/adapter/base-adapter.ts"),
      },
      {
        path: "hax/adapter/agent.type.ts",
        type: "registry:types",
        content: readComponentFile("hax/adapter/agent.type.ts"),
      },
      {
        path: "hax/adapter/logger.ts",
        type: "registry:lib",
        content: readComponentFile("hax/adapter/logger.ts"),
      },
      {
        path: "hax/adapter/index.ts",
        type: "registry:index",
        content: readComponentFile("hax/adapter/index.ts"),
      },
    ],
  },
]
