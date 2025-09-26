import {
  CopilotRuntimeChatCompletionRequest,
  CopilotRuntimeChatCompletionResponse,
} from "@copilotkit/runtime"

export interface ChatMiddleware {
  process(
    request: CopilotRuntimeChatCompletionRequest,
    next: (
      request: CopilotRuntimeChatCompletionRequest,
    ) => Promise<CopilotRuntimeChatCompletionResponse>,
  ): Promise<CopilotRuntimeChatCompletionResponse>
}

export interface AgentDelegation {
  agentId: string
  message: string
}

export interface ToolCall {
  toolName: string
  context: string
}
