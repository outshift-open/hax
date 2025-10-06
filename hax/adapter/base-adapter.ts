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
import { Message } from "@copilotkit/runtime-client-gql";
import { randomId, randomUUID } from "@copilotkit/shared";
import { CopilotEventStream, ProcessMessageActions } from "./agent.type";
import { logger } from "./logger";

type AgentResponse = {
  messages: Message[];
};

export type Protocol = "REST" | "gRPC";

export interface HAXAdapterOptions {
  protocol?: Protocol;
  streamWordDelayMs?: number;
  interMessageDelayMs?: number;
}

export abstract class HAXAdapter implements CopilotServiceAdapter {
  protected baseURL: string;
  protected protocol: Protocol;
  protected lastResponse: AgentResponse | null = null;
  protected messageCount = 0;
  protected isStreaming = false;

  protected processedMessageIds: Set<string> = new Set();
  protected lastStreamedMessageId: string | null = null;

  protected streamWordDelayMs: number;
  protected interMessageDelayMs: number;

  constructor(baseURL: string, options?: HAXAdapterOptions) {
    this.baseURL = baseURL;
    this.protocol = options?.protocol ?? "REST";
    this.streamWordDelayMs = options?.streamWordDelayMs ?? 30;
    this.interMessageDelayMs = options?.interMessageDelayMs ?? 100;
  }

  async process(
    request: CopilotRuntimeChatCompletionRequest
  ): Promise<CopilotRuntimeChatCompletionResponse> {
    const threadId = request.threadId || randomUUID();

    if (this.protocol === "REST") {
      await this.processREST(request, threadId);
    } else if (this.protocol === "gRPC") {
      await this.processGRPC(request, threadId);
    }

    return { threadId };
  }

  // Default REST protocol handler. Subclasses typically override buildRestRequest.
  protected async processREST(
    request: CopilotRuntimeChatCompletionRequest,
    threadId: string
  ): Promise<void> {
    const { endpoint, body } = this.buildRestRequest(request, threadId);

    const url = `${this.baseURL}${endpoint}`;

    // Request/response logging for visibility
    logger.info("REST url:", url);
    logger.debug("REST payload:", JSON.stringify(body, null, 2));

    const response = await fetch(url, this.buildRequestOptions(body));

    logger.info("REST status:", response.status, response.statusText);

    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    const data = (await response.json()) as AgentResponse;
    // Convert messages to CopilotKit Message
    data.messages = data.messages.map((m) => new Message(m));

    this.lastResponse = data;
    this.messageCount += Array.isArray(data?.messages)
      ? data.messages.length
      : 0;

    const existingMessageIds = new Set(
      request.messages
        .map((m) => (m as { id?: string }).id)
        .filter((id): id is string => typeof id === "string")
    );

    request.eventSource.stream(async (eventStream$) => {
      logger.info("Start streaming");

      let foundFrontendAction = false;

      for (const message of data.messages) {
        if (this.shouldSkipMessage(message, existingMessageIds)) {
          continue;
        }

        // Check if this is a frontend action
        if (message.isActionExecutionMessage()) {
          const actionDef = request.actions.find(
            (a) => a.name === message.name
          );
          if (actionDef) {
            foundFrontendAction = true;
          }
        }

        // Apply custom message filtering
        if (this.shouldFilterMessage(message, foundFrontendAction)) {
          continue;
        }

        // Mark as processed to avoid repeats in subsequent iterations
        if (message.id) {
          this.processedMessageIds.add(message.id);
        }

        await this.processMessage(message, eventStream$, request.actions);
      }

      logger.info("Complete streaming");
      eventStream$.complete();
    });
  }

  // Default gRPC handler (stub). Subclasses can implement.
  protected async processGRPC(
    _request: CopilotRuntimeChatCompletionRequest,
    _threadId: string
  ): Promise<void> {
    logger.warn("gRPC protocol not implemented in base adapter");
    throw new Error("gRPC protocol not implemented");
  }

  // Subclasses can override this to customize the REST endpoint and payload
  // used for a request.
  protected buildRestRequest(
    request: CopilotRuntimeChatCompletionRequest,
    threadId: string
  ): { endpoint: string; body: Record<string, unknown> } {
    return {
      endpoint: "/agent/chat",
      body: {
        messages: request.messages,
        actions: request.actions,
        threadId,
      },
    };
  }

  /**
   * Build fetch request options. Override to customize headers, method, timeout, etc.
   */
  protected buildRequestOptions(body: Record<string, unknown>): RequestInit {
    return {
      method: "POST",
      headers: this.buildRequestHeaders(),
      body: JSON.stringify(body),
    };
  }

  /**
   * Build request headers. Override to add authentication, custom headers, etc.
   */
  protected buildRequestHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
    };
  }

  protected async processMessage(
    message: Message,
    eventStream$: CopilotEventStream,
    actions: ProcessMessageActions
  ): Promise<void> {
    // using if-else instead of switch to avoid type narrowing issues
    if (message.isTextMessage()) {
      if (message.role === "assistant" && typeof message.content === "string") {
        await this.streamText(message.content, eventStream$);
      }
    } else if (message.isActionExecutionMessage()) {
      await this.handleActionExecution(message, eventStream$, actions);
    } else if (message.isResultMessage()) {
      logger.debug("ResultMessage (ignored):", message);
    } else {
      logger.warn("Unknown message type:", message);
    }
  }

  // Utility: stream text word by word
  async streamText(
    content: string,
    stream$: CopilotEventStream
  ): Promise<void> {
    const messageId = randomId();
    this.lastStreamedMessageId = messageId;
    this.isStreaming = true;

    stream$.sendTextMessageStart({ messageId });

    const words = content.split(" ");
    for (let i = 0; i < words.length; i++) {
      const word = i === 0 ? words[i] : " " + words[i];
      stream$.sendTextMessageContent({ messageId, content: word });
      await new Promise((resolve) =>
        setTimeout(resolve, this.streamWordDelayMs)
      );
    }

    stream$.sendTextMessageEnd({ messageId });
    this.isStreaming = false;

    await new Promise((resolve) =>
      setTimeout(resolve, this.interMessageDelayMs)
    );
  }

  protected async handleActionExecution(
    message: Message,
    eventStream$: CopilotEventStream,
    actions: ProcessMessageActions
  ): Promise<void> {
    if (!message.isActionExecutionMessage()) {
      logger.debug("Skipping non-action execution message:", message);
      return;
    }

    const actionExecutionId = message.id;
    const actionName = message.name as string;
    const parentMessageId = message.parentMessageId;

    logger.info("Action →", actionName, "#", actionExecutionId);

    const actionDef = actions.find((a) => a.name === actionName);
    if (!actionDef) {
      logger.debug(
        `Action ${actionName} not found in frontend actions; skipping`
      );
      return;
    }

    eventStream$.sendActionExecutionStart({
      actionExecutionId,
      parentMessageId: parentMessageId ?? undefined,
      actionName,
    });

    const args = JSON.stringify(message.arguments || {});
    eventStream$.sendActionExecutionArgs({ actionExecutionId, args });

    eventStream$.sendActionExecutionEnd({ actionExecutionId });
  }

  protected shouldSkipMessage(
    message: Message,
    existingMessageIds: Set<string>
  ): boolean {
    // Skip messages that were already in the request (historical messages)
    if (message.id && existingMessageIds.has(message.id)) {
      logger.debug("Skipping existing message:", message.id);
      return true;
    }
    // Skip messages we've already processed in this session
    if (message.id && this.processedMessageIds.has(message.id)) {
      logger.debug("Skipping already processed message:", message.id);
      return true;
    }
    return false;
  }

  /**
   * Determine if a message should be filtered out. Override to add custom filtering logic.
   * Default behavior: Skip assistant text messages that come after a frontend action.
   */
  protected shouldFilterMessage(
    message: Message,
    foundFrontendAction: boolean
  ): boolean {
    if (
      foundFrontendAction &&
      message.isTextMessage() &&
      message.role === "assistant"
    ) {
      logger.debug(
        "Skipping assistant text after frontend action",
        message.content
      );
      return true;
    }
    return false;
  }

  /**
   * Handle error responses from the agent. Override to customize error handling.
   */
  protected async handleErrorResponse(response: Response): Promise<never> {
    let errorDetails = "";
    try {
      errorDetails = await response.text();
    } catch {
      // ignore
    }
    this.handleError(
      new Error(
        `Agent request failed: ${response.status} ${response.statusText}. Details: ${errorDetails}`
      )
    );
  }

  /**
   * Basic error handler.
   */
  handleError(error: unknown): never {
    logger.error("Error:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
}

export default HAXAdapter;
