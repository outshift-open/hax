export const artifacts = [
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
      },
      {
        path: "hax/artifacts/form/action.ts",
        type: "registry:hook",
      },
      {
        path: "hax/artifacts/form/types.ts",
        type: "registry:types",
      },
      {
        path: "hax/artifacts/form/index.ts",
        type: "registry:index",
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
      },
      {
        path: "hax/artifacts/timeline/action.ts",
        type: "registry:hook",
      },
      {
        path: "hax/artifacts/timeline/types.ts",
        type: "registry:types",
      },
      {
        path: "hax/artifacts/timeline/index.ts",
        type: "registry:index",
      },
    ],
  },
];
