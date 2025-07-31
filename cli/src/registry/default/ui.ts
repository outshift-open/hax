import { RegistryItem } from "@/types"
import { readComponentFile } from "@/utils/registry"

export const uiComponents: RegistryItem[] = [
  {
    name: "button",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-slot", "class-variance-authority"],
    files: [
      {
        path: "hax/components/ui/button.tsx",
        type: "registry:component",
        content: readComponentFile("hax/components/ui/button.tsx"),
      },
    ],
  },
  {
    name: "input",
    type: "registry:ui",
    dependencies: ["class-variance-authority"],
    files: [
      {
        path: "hax/components/ui/input.tsx",
        type: "registry:component",
        content: readComponentFile("hax/components/ui/input.tsx"),
      },
    ],
  },
  {
    name: "select",
    type: "registry:ui",
    dependencies: [
      "@radix-ui/react-select",
      "class-variance-authority",
      "lucide-react",
    ],
    files: [
      {
        path: "hax/components/ui/select.tsx",
        type: "registry:component",
        content: readComponentFile("hax/components/ui/select.tsx"),
      },
    ],
  },
  {
    name: "card",
    type: "registry:ui",
    dependencies: ["class-variance-authority"],
    files: [
      {
        path: "hax/components/ui/card.tsx",
        type: "registry:component",
        content: readComponentFile("hax/components/ui/card.tsx"),
      },
    ],
  },
  {
    name: "table",
    type: "registry:ui",
    dependencies: ["class-variance-authority"],
    files: [
      {
        path: "hax/components/ui/table.tsx",
        type: "registry:component",
        content: readComponentFile("hax/components/ui/table.tsx"),
      },
    ],
  },
  {
    name: "generated-ui-wrapper",
    type: "registry:ui",
    dependencies: [],
    files: [
      {
        path: "hax/components/generated-ui-wrapper.tsx",
        type: "registry:component",
        content: readComponentFile(
          "hax/components/generated-ui-wrapper.tsx",
        ),
      },
    ],
  },
]
