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
      {
        path: "hax/artifacts/form/description.ts",
        type: "registry:description",
        content: readComponentFile("hax/artifacts/form/description.ts"),
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
      {
        path: "hax/artifacts/timeline/description.ts",
        type: "registry:description",
        content: readComponentFile("hax/artifacts/timeline/description.ts"),
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
      {
        path: "hax/artifacts/mindmap/description.ts",
        type: "registry:description",
        content: readComponentFile("hax/artifacts/mindmap/description.ts"),
      },
    ],
  },
  {
    name: "code-editor",
    type: "registry:artifacts",
    dependencies: [
      "react",
      "clsx",
      "tailwind-merge",
      "zod",
      "@copilotkit/react-core",
      "@monaco-editor/react",
      "monaco-editor",
    ],
    registryDependencies: ["select", "generated-ui-wrapper"],
    files: [
      {
        path: "hax/artifacts/code-editor/code-editor.tsx",
        type: "registry:component",
        content: readComponentFile("hax/artifacts/code-editor/code-editor.tsx"),
      },
      {
        path: "hax/artifacts/code-editor/action.ts",
        type: "registry:hook",
        content: readComponentFile("hax/artifacts/code-editor/action.ts"),
      },
      {
        path: "hax/artifacts/code-editor/types.ts",
        type: "registry:types",
        content: readComponentFile("hax/artifacts/code-editor/types.ts"),
      },
      {
        path: "hax/artifacts/code-editor/index.ts",
        type: "registry:index",
        content: readComponentFile("hax/artifacts/code-editor/index.ts"),
      },
      {
        path: "hax/artifacts/code-editor/description.ts",
        type: "registry:description",
        content: readComponentFile("hax/artifacts/code-editor/description.ts"),
      },
    ],
  },
  {
    name: "details",
    type: "registry:artifacts",
    dependencies: [
      "react",
      "clsx",
      "tailwind-merge",
      "zod",
      "@copilotkit/react-core",
      "lucide-react",
    ],
    registryDependencies: ["card", "table"],
    files: [
      {
        path: "hax/artifacts/details/details.tsx",
        type: "registry:component",
        content: readComponentFile("hax/artifacts/details/details.tsx"),
      },
      {
        path: "hax/artifacts/details/action.ts",
        type: "registry:hook",
        content: readComponentFile("hax/artifacts/details/action.ts"),
      },
      {
        path: "hax/artifacts/details/types.ts",
        type: "registry:types",
        content: readComponentFile("hax/artifacts/details/types.ts"),
      },
      {
        path: "hax/artifacts/details/index.ts",
        type: "registry:index",
        content: readComponentFile("hax/artifacts/details/index.ts"),
      },
      {
        path: "hax/artifacts/details/description.ts",
        type: "registry:description",
        content: readComponentFile("hax/artifacts/details/description.ts"),
      },
    ],
  },
  {
    name: "data-visualizer",
    type: "registry:artifacts",
    dependencies: [
      "react",
      "clsx",
      "tailwind-merge",
      "zod",
      "@copilotkit/react-core",
      "react-chartjs-2",
      "chart.js",
    ],
    registryDependencies: [],
    files: [
      {
        path: "hax/artifacts/data-visualizer/data-visualizer.tsx",
        type: "registry:component",
        content: readComponentFile(
          "hax/artifacts/data-visualizer/data-visualizer.tsx",
        ),
      },
      {
        path: "hax/artifacts/data-visualizer/action.ts",
        type: "registry:hook",
        content: readComponentFile("hax/artifacts/data-visualizer/action.ts"),
      },
      {
        path: "hax/artifacts/data-visualizer/types.ts",
        type: "registry:types",
        content: readComponentFile("hax/artifacts/data-visualizer/types.ts"),
      },
      {
        path: "hax/artifacts/data-visualizer/index.ts",
        type: "registry:index",
        content: readComponentFile("hax/artifacts/data-visualizer/index.ts"),
      },
      {
        path: "hax/artifacts/data-visualizer/description.ts",
        type: "registry:description",
        content: readComponentFile(
          "hax/artifacts/data-visualizer/description.ts",
        ),
      },
    ],
  },
]
