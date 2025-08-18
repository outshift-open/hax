import { RegistryItem } from "@/types"
import { readComponentFile } from "@/utils/registry"

export const composer: RegistryItem[] = [
  {
    name: "rules-context",
    type: "registry:composer",
    dependencies: [
      "react",
      "clsx",
      "tailwind-merge",
      "zod",
      "@copilotkit/react-core",
    ],
    registryDependencies: [
      "dialog",
      "button",
      "input",
      "badge",
      "card",
      "label",
    ],
    files: [
      {
        path: "hax/composer/rules-context/rules-context.tsx",
        type: "registry:component",
        content: readComponentFile(
          "hax/composer/rules-context/rules-context.tsx",
        ),
      },
      {
        path: "hax/composer/rules-context/rules.tsx",
        type: "registry:component",
        content: readComponentFile("hax/composer/rules-context/rules.tsx"),
      },
      {
        path: "hax/composer/rules-context/localStorage.ts",
        type: "registry:hook",
        content: readComponentFile(
          "hax/composer/rules-context/localStorage.ts",
        ),
      },
      {
        path: "hax/composer/rules-context/types.ts",
        type: "registry:types",
        content: readComponentFile("hax/composer/rules-context/types.ts"),
      },
      {
        path: "hax/composer/rules-context/index.ts",
        type: "registry:index",
        content: readComponentFile("hax/composer/rules-context/index.ts"),
      },
    ],
  },
  {
    name: "file-upload",
    type: "registry:composer",
    dependencies: [
      "react",
      "clsx",
      "tailwind-merge",
      "zod",
      "@copilotkit/react-core",
    ],
    registryDependencies: [],
    files: [
      {
        path: "hax/composer/file-upload/file-upload.constant.ts",
        type: "registry:constants",
        content: readComponentFile(
          "hax/composer/file-upload/file-upload.constant.ts",
        ),
      },
      {
        path: "hax/composer/file-upload/description.ts",
        type: "registry:description",
        content: readComponentFile("hax/composer/file-upload/description.ts"),
      },
      {
        path: "hax/composer/file-upload/action.tsx",
        type: "registry:hook",
        content: readComponentFile("hax/composer/file-upload/action.tsx"),
      },
      {
        path: "hax/composer/file-upload/drag-drop-zone.tsx",
        type: "registry:component",
        content: readComponentFile(
          "hax/composer/file-upload/drag-drop-zone.tsx",
        ),
      },
      {
        path: "hax/composer/file-upload/info-icon.tsx",
        type: "registry:component",
        content: readComponentFile("hax/composer/file-upload/info-icon.tsx"),
      },
      {
        path: "hax/composer/file-upload/types.ts",
        type: "registry:types",
        content: readComponentFile("hax/composer/file-upload/types.ts"),
      },
      {
        path: "hax/composer/file-upload/index.ts",
        type: "registry:index",
        content: readComponentFile("hax/composer/file-upload/index.ts"),
      },
    ],
  },
  {
    name: "chat-commands",
    type: "registry:composer",
    dependencies: [
      "react",
      "clsx",
      "tailwind-merge",
      "zod",
      "@copilotkit/react-core",
      "@copilotkit/runtime",
    ],
    registryDependencies: ["input", "loading-spinner", "dropdown-menu"],
    files: [
      {
        path: "hax/composer/chat-commands/command-hints.tsx",
        type: "registry:component",
        content: readComponentFile(
          "hax/composer/chat-commands/command-hints.tsx",
        ),
      },
      {
        path: "hax/composer/chat-commands/command-suggestions.tsx",
        type: "registry:component",
        content: readComponentFile(
          "hax/composer/chat-commands/command-suggestions.tsx",
        ),
      },
      {
        path: "hax/composer/chat-commands/context-items-list.tsx",
        type: "registry:component",
        content: readComponentFile(
          "hax/composer/chat-commands/context-items-list.tsx",
        ),
      },
      {
        path: "hax/composer/chat-commands/file-picker-input.tsx",
        type: "registry:component",
        content: readComponentFile(
          "hax/composer/chat-commands/file-picker-input.tsx",
        ),
      },
      {
        path: "hax/composer/chat-commands/file-upload.constant.ts",
        type: "registry:constants",
        content: readComponentFile(
          "hax/composer/chat-commands/file-upload.constant.ts",
        ),
      },
      {
        path: "hax/composer/chat-commands/types.ts",
        type: "registry:types",
        content: readComponentFile("hax/composer/chat-commands/types.ts"),
      },

      {
        path: "hax/composer/chat-commands/commands/agent-delegation-command.tsx",
        type: "registry:component",
        content: readComponentFile(
          "hax/composer/chat-commands/commands/agent-delegation-command.tsx",
        ),
      },
      {
        path: "hax/composer/chat-commands/commands/context-command.tsx",
        type: "registry:component",
        content: readComponentFile(
          "hax/composer/chat-commands/commands/context-command.tsx",
        ),
      },
      {
        path: "hax/composer/chat-commands/commands/tool-call-command.tsx",
        type: "registry:component",
        content: readComponentFile(
          "hax/composer/chat-commands/commands/tool-call-command.tsx",
        ),
      },
      {
        path: "hax/composer/chat-commands/commands/index.ts",
        type: "registry:index",
        content: readComponentFile(
          "hax/composer/chat-commands/commands/index.ts",
        ),
      },

      {
        path: "hax/composer/chat-commands/hooks/useChatCommands.ts",
        type: "registry:hook",
        content: readComponentFile(
          "hax/composer/chat-commands/hooks/useChatCommands.ts",
        ),
      },
      {
        path: "hax/composer/chat-commands/hooks/useDragAndDrop.ts",
        type: "registry:hook",
        content: readComponentFile(
          "hax/composer/chat-commands/hooks/useDragAndDrop.ts",
        ),
      },
      {
        path: "hax/composer/chat-commands/hooks/useLocalContext.ts",
        type: "registry:hook",
        content: readComponentFile(
          "hax/composer/chat-commands/hooks/useLocalContext.ts",
        ),
      },
      {
        path: "hax/composer/chat-commands/hooks/useSuggestions.ts",
        type: "registry:hook",
        content: readComponentFile(
          "hax/composer/chat-commands/hooks/useSuggestions.ts",
        ),
      },
      {
        path: "hax/composer/chat-commands/hooks/useTools.ts",
        type: "registry:hook",
        content: readComponentFile(
          "hax/composer/chat-commands/hooks/useTools.ts",
        ),
      },

      {
        path: "hax/composer/chat-commands/middleware/agent-delegation.ts",
        type: "registry:lib",
        content: readComponentFile(
          "hax/composer/chat-commands/middleware/agent-delegation.ts",
        ),
      },
      {
        path: "hax/composer/chat-commands/middleware/chat-middleware-adapter.ts",
        type: "registry:lib",
        content: readComponentFile(
          "hax/composer/chat-commands/middleware/chat-middleware-adapter.ts",
        ),
      },
      {
        path: "hax/composer/chat-commands/middleware/middleware-chain.ts",
        type: "registry:lib",
        content: readComponentFile(
          "hax/composer/chat-commands/middleware/middleware-chain.ts",
        ),
      },
      {
        path: "hax/composer/chat-commands/middleware/tool-call.ts",
        type: "registry:lib",
        content: readComponentFile(
          "hax/composer/chat-commands/middleware/tool-call.ts",
        ),
      },
      {
        path: "hax/composer/chat-commands/middleware/types.ts",
        type: "registry:types",
        content: readComponentFile(
          "hax/composer/chat-commands/middleware/types.ts",
        ),
      },
      {
        path: "hax/composer/chat-commands/middleware/index.ts",
        type: "registry:index",
        content: readComponentFile(
          "hax/composer/chat-commands/middleware/index.ts",
        ),
      },

      {
        path: "hax/composer/chat-commands/state/command-registry.tsx",
        type: "registry:component",
        content: readComponentFile(
          "hax/composer/chat-commands/state/command-registry.tsx",
        ),
      },
    ],
  },
]
