export const uiComponents = [
  {
    name: "button",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-slot", "class-variance-authority"],
    files: [
      {
        path: "hax/components/ui/button.tsx",
        type: "registry:component",
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
      },
    ],
  },
];
