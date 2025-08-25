import { RegistryItem } from "@/types"
import { readComponentFile } from "@/utils/registry"

export const adapter: RegistryItem[] = [
  {
    name: "adapter",
    type: "registry:adapter",
    dependencies: [
      "@copilotkit/shared",
      "@copilotkit/runtime",
      "@copilotkit/runtime-client-gql",
    ],
    registryDependencies: [],
    files: [
      {
        path: "hax/adapter/adapter.ts",
        type: "registry:component",
        content: readComponentFile("hax/adapter/adapter.ts"),
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
