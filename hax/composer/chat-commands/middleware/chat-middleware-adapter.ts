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
