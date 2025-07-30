import { RegistryItem } from "@/types"
import { readComponentFile } from "@/utils/registry"

export const artifacts: RegistryItem[] = [
  {
    name: "form",
    type: "registry:artifacts",
    dependencies: [
      "react",
      "clsx",
      "tailwind-merge",
      "zod",
      "@copilotkit/react-core",
    ],
    registryDependencies: ["button", "input", "select"],
    files: [
      {
        path: "hax/artifacts/form/form.tsx",
        type: "registry:component",
        content: readComponentFile("hax/artifacts/form/form.tsx"),
      },
      {
        path: "hax/artifacts/form/action.ts",
        type: "registry:hook",
        content: readComponentFile("hax/artifacts/form/action.ts"),
      },
      {
        path: "hax/artifacts/form/types.ts",
        type: "registry:types",
        content: readComponentFile("hax/artifacts/form/types.ts"),
      },
      {
        path: "hax/artifacts/form/index.ts",
        type: "registry:index",
        content: readComponentFile("hax/artifacts/form/index.ts"),
      },
    ],
  },
  {
    name: "timeline",
    type: "registry:artifacts",
    dependencies: [
      "react",
      "clsx",
      "tailwind-merge",
      "zod",
      "@copilotkit/react-core",
      "date-fns",
      "lucide-react",
    ],
    files: [
      {
        path: "hax/artifacts/timeline/timeline.tsx",
        type: "registry:component",
        content: readComponentFile("hax/artifacts/timeline/timeline.tsx"),
      },
      {
        path: "hax/artifacts/timeline/action.ts",
        type: "registry:hook",
        content: readComponentFile("hax/artifacts/timeline/action.ts"),
      },
      {
        path: "hax/artifacts/timeline/types.ts",
        type: "registry:types",
        content: readComponentFile("hax/artifacts/timeline/types.ts"),
      },
      {
        path: "hax/artifacts/timeline/index.ts",
        type: "registry:index",
        content: readComponentFile("hax/artifacts/timeline/index.ts"),
      },
    ],
  },
  {
    name: "mindmap",
    type: "registry:artifacts",
    dependencies: [
      "react",
      "clsx",
      "tailwind-merge",
      "zod",
      "@copilotkit/react-core",
      "@xyflow/react",
      "elkjs",
    ],
    files: [
      {
        path: "hax/artifacts/mindmap/mindmap.tsx",
        type: "registry:component",
        content: readComponentFile("hax/artifacts/mindmap/mindmap.tsx"),
      },
      {
        path: "hax/artifacts/mindmap/action.tsx",
        type: "registry:hook",
        content: readComponentFile("hax/artifacts/mindmap/action.tsx"),
      },
      {
        path: "hax/artifacts/mindmap/types.ts",
        type: "registry:types",
        content: readComponentFile("hax/artifacts/mindmap/types.ts"),
      },
      {
        path: "hax/artifacts/mindmap/index.ts",
        type: "registry:index",
        content: readComponentFile("hax/artifacts/mindmap/index.ts"),
      },
    ],
  },
]
