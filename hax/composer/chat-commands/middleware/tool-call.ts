import {
  CopilotRuntimeChatCompletionRequest,
  CopilotRuntimeChatCompletionResponse,
} from "@copilotkit/runtime";
import { ChatMiddleware, ToolCall } from "./types";
import { logger } from "./logger";

export class ToolCallMiddleware implements ChatMiddleware {
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
    // Use a precise regex that matches "/" commands but excludes URLs
    // Look for "/" at word boundaries, not preceded by protocol schemes
    const toolMentions = content.match(
      /(?:^|\s)\/(\w+)(?:\s+(.+?)(?=\s[@+/]|$))?/g
    );

    if (!toolMentions) {
      return next(request);
    }

    logger.info("[ToolCallMiddleware] Processing tool mentions:", toolMentions);

    // Parse forced tools
    const forcedTools: ToolCall[] = [];
    for (const mention of toolMentions) {
      const match = mention.match(/(?:^|\s)\/(\w+)(?:\s+(.+))?/);
      if (match) {
        const [, toolName, context] = match;
        forcedTools.push({
          toolName,
          context: context || "",
        });
      }
    }

    // Clean / mentions and enhance content with tool instructions
    // Use a precise regex to remove tool commands but preserve URLs
    let enhancedContent = content
      .replace(/(?:^|\s)\/\w+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (forcedTools.length > 0) {
      enhancedContent += "\n\n--- Tool Execution Instructions ---\n";
      for (const tool of forcedTools) {
        enhancedContent += `Please use the "${tool.toolName}" tool. ${tool.context}\n`;
      }
      enhancedContent += "--- End Tool Instructions ---\n";
    }

    const enhancedMessages = [...request.messages];
    const enhancedLastMessage = Object.create(
      Object.getPrototypeOf(lastMessage)
    );
    Object.assign(enhancedLastMessage, lastMessage, {
      content: enhancedContent,
    });
    enhancedMessages[enhancedMessages.length - 1] = enhancedLastMessage;

    return next({
      ...request,
      messages: enhancedMessages,
    });
  }
}
