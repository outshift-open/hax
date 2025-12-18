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
import { DIAGNOSTIC_REPORT_DESCRIPTION } from "./description"

interface UseDiagnosticReportActionProps {
  addOrUpdateArtifact: (
    type: "diagnostic-report",
    data: Extract<ArtifactTab, { type: "diagnostic-report" }>["data"],
  ) => void
}

export const useDiagnosticReportAction = ({
  addOrUpdateArtifact,
}: UseDiagnosticReportActionProps) => {
  useCopilotAction({
    name: "create_diagnostic_report",
    description: DIAGNOSTIC_REPORT_DESCRIPTION,
    parameters: [
      {
        name: "title",
        type: "string",
        description: "Title for the diagnostic report card",
        required: false,
      },
      {
        name: "itemsJson",
        type: "string",
        description:
          "JSON string of diagnostic items array. Each item must have: id (unique string), suspectedCause (string describing the potential cause), confidence (number 0-100), confidenceLevel ('high'|'medium'|'low'), rationale (string explaining the assessment), recommendedAction (string with actionable next step)",
        required: true,
      },
    ],
    handler: async (args) => {
      try {
        const { title, itemsJson } = args

        const items = JSON.parse(itemsJson)

        addOrUpdateArtifact("diagnostic-report", {
          title,
          items,
        })

        return `Created diagnostic report "${title || "Diagnostic Report With Actionables"}" with ${items.length} items`
      } catch (error) {
        console.error("Error in create_diagnostic_report handler:", error)
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error"
        return `Failed to create diagnostic report: ${errorMessage}`
      }
    },
  })
}
