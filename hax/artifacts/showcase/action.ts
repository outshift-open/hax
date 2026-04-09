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

import { useCopilotAction } from "@copilotkit/react-core";
import { z } from "zod";
import {
  ShowcaseArtifact,
  ShowcaseItemZod,
  ShowcaseCategoryZod,
  ShowcaseVariantZod,
} from "./types";
import { SHOWCASE_DESCRIPTION } from "./description";

interface UseShowcaseActionProps {
  addOrUpdateArtifact: (artifact: ShowcaseArtifact) => void;
}

export const useShowcaseAction = ({
  addOrUpdateArtifact,
}: UseShowcaseActionProps) => {
  useCopilotAction({
    name: "create_showcase",
    description: SHOWCASE_DESCRIPTION,
    parameters: [
      {
        name: "variant",
        type: "string",
        description:
          "Layout variant: grid, list, dense-grid, table, categorized, featured",
        required: false,
      },
      {
        name: "itemsJson",
        type: "string",
        description:
          "JSON string of items array: [{id, title, description, badge?, imageUrl?, author?, category?}]",
        required: false,
      },
      {
        name: "categoriesJson",
        type: "string",
        description:
          'JSON string of categories array (for categorized variant): [{title, icon?, items: [...]}]',
        required: false,
      },
    ],
    handler: async (args: {
      variant?: string;
      itemsJson?: string;
      categoriesJson?: string;
    }) => {
      try {
        const variant = args.variant
          ? ShowcaseVariantZod.parse(args.variant)
          : "grid";

        let items: z.infer<typeof ShowcaseItemZod>[] | undefined;
        if (args.itemsJson) {
          const parsed = JSON.parse(args.itemsJson);
          items = z.array(ShowcaseItemZod).parse(parsed);
        }

        let categories: z.infer<typeof ShowcaseCategoryZod>[] | undefined;
        if (args.categoriesJson) {
          const parsed = JSON.parse(args.categoriesJson);
          categories = z.array(ShowcaseCategoryZod).parse(parsed);
        }

        const artifact: ShowcaseArtifact = {
          id: `showcase-${Date.now()}`,
          type: "showcase",
          data: {
            variant,
            ...(items && { items }),
            ...(categories && { categories }),
          },
        };

        addOrUpdateArtifact(artifact);
        return `Created showcase (${variant}) with ${items?.length ?? 0} items`;
      } catch (error) {
        return `Error creating showcase: ${String(error)}`;
      }
    },
  });
};