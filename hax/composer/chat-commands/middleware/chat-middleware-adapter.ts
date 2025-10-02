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
  CopilotServiceAdapter,
  CopilotRuntimeChatCompletionRequest,
  CopilotRuntimeChatCompletionResponse,
} from "@copilotkit/runtime";
import { ChatMiddleware } from "./types";
import { MiddlewareChain } from "./middleware-chain";
import { AgentDelegationMiddleware } from "./agent-delegation";
import { ToolCallMiddleware } from "./tool-call";
import { logger } from "./logger";

// Chat Middleware Adapter using Middleware Pattern
export class ChatMiddlewareAdapter implements CopilotServiceAdapter {
  private baseAdapter: CopilotServiceAdapter;
  private middlewareChain: MiddlewareChain;

  constructor(baseAdapter: CopilotServiceAdapter, agentId: string) {
    this.baseAdapter = baseAdapter;
    this.middlewareChain = new MiddlewareChain()
      .use(new AgentDelegationMiddleware(agentId))
      .use(new ToolCallMiddleware());
  }

  async process(
    request: CopilotRuntimeChatCompletionRequest
  ): Promise<CopilotRuntimeChatCompletionResponse> {
    logger.info(
      "[ChatMiddlewareAdapter] Processing request with middleware chain"
    );

    return this.middlewareChain.execute(
      request,
      (req: CopilotRuntimeChatCompletionRequest) => {
        return this.baseAdapter.process(req);
      }
    );
  }

  // Allow adding custom middleware
  addMiddleware(middleware: ChatMiddleware): this {
    this.middlewareChain.use(middleware);
    return this;
  }
}
