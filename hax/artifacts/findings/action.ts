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
import { FINDINGS_DESCRIPTION } from "./description"

interface UseFindingsActionProps {
  addOrUpdateArtifact: (
    type: "findings",
    data: Extract<ArtifactTab, { type: "findings" }>["data"],
  ) => void
}

export const useFindingsAction = ({
  addOrUpdateArtifact,
}: UseFindingsActionProps) => {
  useCopilotAction({
    name: "create_findings",
    description: FINDINGS_DESCRIPTION,
    parameters: [
      {
        name: "title",
        type: "string",
        description: "Header title for the findings panel",
        required: true,
      },
      {
        name: "findingsJson",
        type: "string",
        description:
          "JSON string of findings array. Each finding must have: id (unique string), title (string), description (string), and optionally sources (array of {label: string, href?: string})",
        required: true,
      },
      {
        name: "sourcesLabel",
        type: "string",
        description: "Custom label for sources section (default: 'Sources:')",
        required: false,
      },
      {
        name: "maxVisibleSources",
        type: "number",
        description:
          "Maximum number of source chips to show before collapsing into '+N' (default: 2)",
        required: false,
      },
    ],
    handler: async (args) => {
      try {
        const { title, findingsJson, sourcesLabel, maxVisibleSources } = args

        const findings = JSON.parse(findingsJson)

        addOrUpdateArtifact("findings", {
          title,
          findings,
          sourcesLabel,
          maxVisibleSources,
        })

        return `Created findings panel "${title}" with ${findings.length} findings`
      } catch (error) {
        console.error("Error in create_findings handler:", error)
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error"
        return `Failed to create findings: ${errorMessage}`
      }
    },
  })
}
