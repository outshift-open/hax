import { CopilotRuntimeChatCompletionRequest } from "@copilotkit/runtime";

export interface CopilotEventStream {
  sendTextMessageStart(payload: { messageId: string }): void;
  sendTextMessageContent(payload: { messageId: string; content: string }): void;
  sendTextMessageEnd(payload: { messageId: string }): void;
  sendActionExecutionStart(payload: {
    actionExecutionId: string;
    parentMessageId?: string;
    actionName: string;
  }): void;
  sendActionExecutionArgs(payload: {
    actionExecutionId: string;
    args: string;
  }): void;
  sendActionExecutionEnd(payload: { actionExecutionId: string }): void;
  complete(): void;
}

export type ProcessMessageActions =
  CopilotRuntimeChatCompletionRequest["actions"];
