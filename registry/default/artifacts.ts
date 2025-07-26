export const artifacts = [
  {
    name: "form",
    type: "registry:artifacts",
    dependencies: ["react", "clsx", "tailwind-merge", "zod", "@copilotkit/react-core"],
    registryDependencies: ["button", "input", "select"],
    files: [
      {
        path: "src/artifacts/form/form.tsx",
        type: "registry:component",
      },
      {
        path: "src/artifacts/form/action.ts",
        type: "registry:hook",
      },
      {
        path: "src/artifacts/form/types.ts",
        type: "registry:types",
      },
      {
        path: "src/artifacts/form/index.ts",
        type: "registry:index",
      },
    ],
  },
]