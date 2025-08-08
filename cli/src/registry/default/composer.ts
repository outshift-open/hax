import { RegistryItem } from "@/types"
import { readComponentFile } from "@/utils/registry"

export const composer: RegistryItem[] = [
  {
    name: "rules-context",
    type: "registry:composer",
    dependencies: ["react", "lucide-react"],
    registryDependencies: ["dialog", "button", "input", "badge"],
    files: [
      {
        path: "hax/composer/rules/rules-context.tsx",
        type: "registry:component",
        content: readComponentFile("hax/composer/rules/rules-context.tsx"),
      },
      {
        path: "hax/composer/rules/rules.tsx",
        type: "registry:component",
        content: readComponentFile("hax/composer/rules/rules.tsx"),
      },
      {
        path: "hax/composer/rules/localStorage.ts",
        type: "registry:hook",
        content: readComponentFile("hax/composer/rules/localStorage.ts"),
      },
      {
        path: "hax/composer/rules/types.ts",
        type: "registry:types",
        content: readComponentFile("hax/composer/rules/types.ts"),
      },
      {
        path: "hax/composer/rules/index.ts",
        type: "registry:index",
        content: readComponentFile("hax/composer/rules/index.ts"),
      },
    ],
  },
]
