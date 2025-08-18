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
