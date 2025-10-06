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

import {
  CopilotRuntimeChatCompletionRequest,
  CopilotRuntimeChatCompletionResponse,
} from "@copilotkit/runtime"
import { ChatMiddleware } from "./types"

export class MiddlewareChain {
  private middleware: ChatMiddleware[] = []

  use(middleware: ChatMiddleware): this {
    this.middleware.push(middleware)
    return this
  }

  async execute(
    request: CopilotRuntimeChatCompletionRequest,
    finalHandler: (
      request: CopilotRuntimeChatCompletionRequest,
    ) => Promise<CopilotRuntimeChatCompletionResponse>,
  ): Promise<CopilotRuntimeChatCompletionResponse> {
    let index = 0

    const next = async (
      req: CopilotRuntimeChatCompletionRequest,
    ): Promise<CopilotRuntimeChatCompletionResponse> => {
      if (index >= this.middleware.length) {
        return finalHandler(req)
      }

      const middleware = this.middleware[index++]
      return middleware.process(req, next)
    }

    return next(request)
  }
}
