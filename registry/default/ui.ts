export const uiComponents = [
  {
    name: "button",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-slot", "class-variance-authority"],
    files: [
      {
        path: "src/ui/button.tsx",
        type: "registry:component",
      }
    ]
  },
  {
    name: "input", 
    type: "registry:ui",
    dependencies: ["class-variance-authority"],
    files: [
      {
        path: "src/ui/input.tsx",
        type: "registry:component",
      }
    ]
  },
  {
    name: "select",
    type: "registry:ui", 
    dependencies: ["@radix-ui/react-select", "class-variance-authority", "lucide-react"],
    files: [
      {
        path: "src/ui/select.tsx",
        type: "registry:component",
      }
    ]
  },
]