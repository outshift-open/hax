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
import { ArtifactTab } from "./types"
import { RATIONALE_DESCRIPTION } from "./description"

interface UseRationaleActionProps {
  addOrUpdateArtifact: (
    type: "rationale",
    data: Extract<ArtifactTab, { type: "rationale" }>["data"],
  ) => void
}

export const useRationaleAction = ({
  addOrUpdateArtifact,
}: UseRationaleActionProps) => {
  useCopilotAction({
    name: "create_rationale",
    description: RATIONALE_DESCRIPTION,
    parameters: [
      {
        name: "decision",
        type: "string",
        description: "Clear, actionable decision or conclusion statement",
        required: true,
      },
      {
        name: "reasoning",
        type: "string",
        description:
          "Detailed explanation of the logic, context, and implications behind the decision",
        required: true,
      },
      {
        name: "title",
        type: "string",
        description: "Optional title for the rationale artifact",
        required: false,
      },
      {
        name: "criteriaJson",
        type: "string",
        description:
          "JSON string of criteria array with {label, value, description?, sentiment?} objects showing decision factors. Use sentiment 'positive' for good indicators (high performance), 'negative' for concerning indicators (high risk), or 'neutral' for factual data.",
        required: false,
      },
      {
        name: "confidence",
        type: "number",
        description:
          "Confidence level as percentage number (e.g., 95) indicating certainty of the decision (0-100)",
        required: false,
      },
      {
        name: "confidenceDescription",
        type: "string",
        description:
          "Detailed explanation of confidence level factors, methodology, or reasoning behind the confidence assessment",
        required: false,
      },
      {
        name: "variant",
        type: "string",
        description:
          "Visual variant: 'priority' (orange, urgency), 'severity' (red, risk), 'impact' (blue, scope), 'decision' (green, approval), 'default' (gray)",
        required: false,
      },
      {
        name: "expandable",
        type: "boolean",
        description: "Whether the detailed reasoning can be expanded/collapsed",
        required: false,
      },
      {
        name: "defaultExpanded",
        type: "boolean",
        description:
          "Whether to show detailed reasoning expanded by default (default: true)",
        required: false,
      },
      {
        name: "showConfidence",
        type: "boolean",
        description: "Whether to display the confidence level badge",
        required: false,
      },
      {
        name: "description",
        type: "string",
        description:
          "Brief description or summary text to display below the title",
        required: false,
      },
    ],
    handler: async (args) => {
      try {
        const {
          decision,
          reasoning,
          title,
          criteriaJson,
          confidence,
          confidenceDescription,
          variant,
          expandable,
          defaultExpanded,
          showConfidence,
          description,
        } = args

        let criteria
        if (criteriaJson) {
          criteria = JSON.parse(criteriaJson)
        }

        addOrUpdateArtifact("rationale", {
          decision,
          reasoning,
          title,
          criteria,
          confidence,
          confidenceDescription,
          variant: variant as
            | "priority"
            | "severity"
            | "impact"
            | "decision"
            | "default"
            | undefined,
          expandable,
          defaultExpanded,
          showConfidence,
          description,
        })

        return `Created rationale "${title || decision}"`
      } catch (error) {
        console.error("Error in create_rationale handler:", error)
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error"
        return `Failed to create rationale: ${errorMessage}`
      }
    },
  })
}
