/*
 * Copyright 2025 Cisco Systems, Inc. and its affiliates
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

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
        content: readComponentFile("hax/components/generated-ui-wrapper.tsx"),
      },
    ],
  },

  {
    name: "badge",
    type: "registry:ui",
    dependencies: ["class-variance-authority"],
    files: [
      {
        path: "hax/components/ui/badge.tsx",
        type: "registry:component",
        content: readComponentFile("hax/components/ui/badge.tsx"),
      },
    ],
  },

  {
    name: "dialog",
    type: "registry:ui",
    dependencies: ["class-variance-authority", "@radix-ui/react-dialog"],
    files: [
      {
        path: "hax/components/ui/dialog.tsx",
        type: "registry:component",
        content: readComponentFile("hax/components/ui/dialog.tsx"),
      },
    ],
  },

  {
    name: "label",
    type: "registry:ui",
    dependencies: ["class-variance-authority", "@radix-ui/react-label"],
    files: [
      {
        path: "hax/components/ui/label.tsx",
        type: "registry:component",
        content: readComponentFile("hax/components/ui/label.tsx"),
      },
    ],
  },
  {
    name: "dropdown-menu",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-dropdown-menu", "class-variance-authority"],
    files: [
      {
        path: "hax/components/ui/dropdown-menu.tsx",
        type: "registry:component",
        content: readComponentFile("hax/components/ui/dropdown-menu.tsx"),
      },
    ],
  },
  {
    name: "loading-spinner",
    type: "registry:ui",
    dependencies: [],
    files: [
      {
        path: "hax/components/ui/loading-spinner.tsx",
        type: "registry:component",
        content: readComponentFile("hax/components/ui/loading-spinner.tsx"),
      },
    ],
  },
  {
    name: "tabs",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-tabs", "class-variance-authority"],
    files: [
      {
        path: "hax/components/ui/tabs.tsx",
        type: "registry:component",
        content: readComponentFile("hax/components/ui/tabs.tsx"),
      },
    ],
  },
  {
    name: "drawer",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-dialog", "class-variance-authority"],
    files: [
      {
        path: "hax/components/ui/drawer.tsx",
        type: "registry:component",
        content: readComponentFile("hax/components/ui/drawer.tsx"),
      },
    ],
  },
  {
    name: "progress",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-progress", "clsx", "tailwind-merge"],
    files: [
      {
        path: "hax/components/ui/progress.tsx",
        type: "registry:component",
        content: readComponentFile("hax/components/ui/progress.tsx"),
      },
    ],
  },
]
