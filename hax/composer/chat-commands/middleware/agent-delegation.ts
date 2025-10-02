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
import { randomUUID } from "@copilotkit/shared";
import { ChatMiddleware, AgentDelegation } from "./types";
import { logger } from "./logger";

export class AgentDelegationMiddleware implements ChatMiddleware {
  private availableAgents: string[];
  private agentId: string;

  constructor(
    agentId: string,
    availableAgents: string[] = ["jarvis", "corto"]
  ) {
    this.agentId = agentId;
    this.availableAgents = availableAgents;
  }

  async process(
    request: CopilotRuntimeChatCompletionRequest,
    next: (
      request: CopilotRuntimeChatCompletionRequest
    ) => Promise<CopilotRuntimeChatCompletionResponse>
  ): Promise<CopilotRuntimeChatCompletionResponse> {
    const lastMessage = request.messages[request.messages.length - 1];

    if (!lastMessage.isTextMessage()) {
      return next(request);
    }

    const content = lastMessage.content;
    const agentMentions = content.match(/@(\w+)(?:\s+(.+?)(?=\s[@+/]|$))?/g);

    if (agentMentions) {
      for (const mention of agentMentions) {
        const match = mention.match(/@(\w+)(?:\s+(.+))?/);
        if (match) {
          const [, agentId, message] = match;
          if (
            this.availableAgents.includes(agentId) &&
            agentId !== this.agentId
          ) {
            return this.handleAgentDelegation(
              request,
              {
                agentId,
                message: message || content.replace(mention, "").trim(),
              },
              next
            );
          }
        }
      }
    }

    // Clean @ mentions from content before passing to next middleware
    const cleanedContent = content
      .replace(/@\w+/g, "")
      .replace(/\s+/g, " ")
      .trim();
    const enhancedMessages = [...request.messages];
    const enhancedLastMessage = Object.create(
      Object.getPrototypeOf(lastMessage)
    );
    Object.assign(enhancedLastMessage, lastMessage, {
      content: cleanedContent,
    });
    enhancedMessages[enhancedMessages.length - 1] = enhancedLastMessage;

    return next({
      ...request,
      messages: enhancedMessages,
    });
  }

  private async handleAgentDelegation(
    request: CopilotRuntimeChatCompletionRequest,
    delegation: AgentDelegation,
    next: (
      request: CopilotRuntimeChatCompletionRequest
    ) => Promise<CopilotRuntimeChatCompletionResponse>
  ): Promise<CopilotRuntimeChatCompletionResponse> {
    try {
      logger.info(
        `[AgentDelegationMiddleware] Delegating to agent: ${delegation.agentId}`
      );

      const targetAdapter = await this.loadAgentAdapter(delegation.agentId);
      if (!targetAdapter) {
        throw new Error(`Cannot load adapter for agent: ${delegation.agentId}`);
      }

      const delegationMessages = [...request.messages];
      const lastMessage = delegationMessages[delegationMessages.length - 1];

      const delegatedMessage = Object.create(
        Object.getPrototypeOf(lastMessage)
      );
      Object.assign(delegatedMessage, lastMessage, {
        content: `[Delegated from ${this.agentId}] ${delegation.message}`,
      });
      delegationMessages[delegationMessages.length - 1] = delegatedMessage;

      const delegationRequest = {
        ...request,
        messages: delegationMessages,
        threadId: request.threadId || randomUUID(),
      };

      return targetAdapter.process(delegationRequest);
    } catch (error) {
      logger.warn(
        `[AgentDelegationMiddleware] Delegation to ${delegation.agentId} failed, falling back to current agent:`,
        error instanceof Error ? error.message : String(error)
      );

      // Create fallback request with modified message indicating delegation failed
      const fallbackMessages = [...request.messages];
      const lastMessage = fallbackMessages[fallbackMessages.length - 1];

      const fallbackMessage = Object.create(Object.getPrototypeOf(lastMessage));
      Object.assign(fallbackMessage, lastMessage, {
        content: `[Agent @${delegation.agentId} unavailable] ${delegation.message}`,
      });
      fallbackMessages[fallbackMessages.length - 1] = fallbackMessage;

      const fallbackRequest = {
        ...request,
        messages: fallbackMessages,
      };

      // Continue with the middleware chain instead of throwing
      return next(fallbackRequest);
    }
  }

  private async loadAgentAdapter(
    agentId: string
  ): Promise<CopilotServiceAdapter | null> {
    try {
      const adapterModule = await import(`../../agents/${agentId}/adapter`);
      const AdapterClass = adapterModule.default || adapterModule;
      if (typeof AdapterClass !== "function") {
        throw new Error(`Adapter must export a class (${agentId})`);
      }
      return new AdapterClass();
    } catch (error) {
      logger.error(
        `[AgentDelegationMiddleware] Failed to load adapter for ${agentId}:`,
        error
      );
      return null;
    }
  }
}
