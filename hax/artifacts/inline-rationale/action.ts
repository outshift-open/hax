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
import { INLINE_RATIONALE_DESCRIPTION } from "./description"
import type { InlineRationaleArtifact, Intent, ImpactLevel, ExploitabilityLevel } from "./types"

interface UseInlineRationaleActionProps {
  addOrUpdateArtifact: (
    type: "inline-rationale",
    data: InlineRationaleArtifact["data"],
  ) => void
}

export const useInlineRationaleAction = ({
  addOrUpdateArtifact,
}: UseInlineRationaleActionProps) => {
  useCopilotAction({
    name: "create_inline_rationale",
    description: INLINE_RATIONALE_DESCRIPTION,
    parameters: [
      {
        name: "title",
        type: "string",
        description: "Display title for the rationale card",
        required: true,
      },
      {
        name: "description",
        type: "string",
        description: "Main paragraph text explaining the assessment",
        required: true,
      },
      {
        name: "intent",
        type: "string",
        description:
          "Visual theme intent: 'block' (red, critical issues), 'warn' (yellow, warnings), 'approve' (green, approvals), 'inform' (blue, information)",
        required: true,
      },
      {
        name: "assessmentType",
        type: "string",
        description:
          "Type of assessment (e.g., 'security_assessment', 'code_review', 'policy_decision', 'performance_alert')",
        required: true,
      },
      {
        name: "impact",
        type: "string",
        description: "Impact level: 'low', 'medium', 'high', 'critical'",
        required: true,
      },
      {
        name: "exploitability",
        type: "string",
        description: "Exploitability level: 'none', 'low', 'medium', 'high'",
        required: true,
      },
      {
        name: "confidence",
        type: "number",
        description: "Confidence score 0-100 (badge color derived from intent)",
        required: true,
      },
      {
        name: "rationaleJson",
        type: "string",
        description:
          "JSON string of rationale array with {label, value} objects for detail items",
        required: true,
      },
      {
        name: "tagsJson",
        type: "string",
        description: "Optional JSON string of tags array (e.g., ['v2.4.0', 'Production'])",
        required: false,
      },
      {
        name: "collapsible",
        type: "boolean",
        description: "Whether the content can be collapsed/expanded",
        required: false,
      },
      {
        name: "collapsed",
        type: "boolean",
        description: "Initial collapsed state (default: false)",
        required: false,
      },
    ],
    handler: async (args) => {
      try {
        const {
          title,
          description,
          intent,
          assessmentType,
          impact,
          exploitability,
          confidence,
          rationaleJson,
          tagsJson,
          collapsible,
          collapsed,
        } = args

        // Parse rationale JSON
        let rationale = []
        if (rationaleJson) {
          rationale = JSON.parse(rationaleJson)
        }

        // Parse tags JSON
        let tags: string[] | undefined
        if (tagsJson) {
          tags = JSON.parse(tagsJson)
        }

        addOrUpdateArtifact("inline-rationale", {
          assessmentType,
          intent: intent as Intent,
          title,
          description,
          summary: {
            impact: impact as ImpactLevel,
            exploitability: exploitability as ExploitabilityLevel,
            tags,
          },
          rationale,
          confidence,
          collapsible,
          collapsed,
        })

        return `Created inline rationale "${title}"`
      } catch (error) {
        console.error("Error in create_inline_rationale handler:", error)
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error"
        return `Failed to create inline rationale: ${errorMessage}`
      }
    },
  })
}
