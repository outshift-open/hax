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

import { useCopilotAction } from "@copilotkit/react-core"
import z from "zod"
import {
  ContextualExplanationArtifact,
  ExplanationDetailZod,
} from "./types"
import { CONTEXTUAL_EXPLANATION_DESCRIPTION } from "./description"

interface UseContextualExplanationActionProps {
  addOrUpdateArtifact: (
    type: "contextual-explanation",
    data: ContextualExplanationArtifact["data"],
  ) => void
}

export const useContextualExplanationAction = ({
  addOrUpdateArtifact,
}: UseContextualExplanationActionProps) => {
  useCopilotAction({
    name: "create_contextual_explanation",
    description: CONTEXTUAL_EXPLANATION_DESCRIPTION,
    parameters: [
      {
        name: "title",
        type: "string",
        description: "Title for the contextual explanation card",
        required: false,
      },
      {
        name: "alertTitle",
        type: "string",
        description:
          "Title for the alert section explaining why something happened",
        required: false,
      },
      {
        name: "alertDescription",
        type: "string",
        description: "Detailed description of why the change or action occurred",
        required: false,
      },
      {
        name: "detailsJson",
        type: "string",
        description:
          "JSON string of detail items array. Each item must have: label (string), value (string), and optionally: additionalInfo (string), isSubItem (boolean), isBoldLabel (boolean)",
        required: true,
      },
      {
        name: "secondaryButtonLabel",
        type: "string",
        description: "Label for the secondary action button",
        required: false,
      },
      {
        name: "primaryButtonLabel",
        type: "string",
        description: "Label for the primary action button",
        required: false,
      },
    ],
    handler: async (args) => {
      try {
        const {
          title,
          alertTitle,
          alertDescription,
          detailsJson,
          secondaryButtonLabel,
          primaryButtonLabel,
        } = args

        const parsed = JSON.parse(detailsJson)
        const details = z.array(ExplanationDetailZod).parse(parsed)

        addOrUpdateArtifact("contextual-explanation", {
          title,
          alertTitle,
          alertDescription,
          details,
          secondaryButtonLabel,
          primaryButtonLabel,
        })

        return `Created contextual explanation "${title || "Contextual Explanation"}" with ${details.length} details`
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error"
        return `Failed to create contextual explanation: ${errorMessage}`
      }
    },
  })
}
