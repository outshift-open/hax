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
]
