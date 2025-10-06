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
import { SOURCE_ATTRIBUTION_DESCRIPTION } from "./description"
import { SourceAttributionArtifact } from "./types"

interface UseSourceAttributionActionProps {
  addOrUpdateArtifact: (
    type: "source-attribution",
    data: SourceAttributionArtifact["data"],
  ) => void
}

export const useSourceAttributionAction = ({
  addOrUpdateArtifact,
}: UseSourceAttributionActionProps) => {
  useCopilotAction({
    name: "create_source_attribution",
    description: SOURCE_ATTRIBUTION_DESCRIPTION,
    parameters: [
      {
        name: "claim",
        type: "string",
        description:
          "The specific claim, recommendation, or statement that needs source attribution",
        required: true,
      },
      {
        name: "sourcesJson",
        type: "string",
        description:
          'JSON string of sources array. Each source MUST have \'id\' (unique string) and \'title\' (display name) fields. Optional fields: url. Example: \'[{"id":"source-1","title":"Research Report","url":"https://example.com"}]\'',
        required: true,
      },
      {
        name: "title",
        type: "string",
        description: "Optional title for the source attribution artifact",
        required: false,
      },
      {
        name: "description",
        type: "string",
        description:
          "Brief description or context about the claim and its sources",
        required: false,
      },
    ],
    handler: async (args) => {
      try {
        const { claim, sourcesJson, title, description } = args

        let sources
        try {
          sources = JSON.parse(sourcesJson)
        } catch (error) {
          throw new Error(
            `Invalid sources JSON: ${error instanceof Error ? error.message : "Unknown JSON error"}`,
          )
        }

        if (!Array.isArray(sources)) {
          throw new Error(
            `Sources must be an array, received: ${typeof sources}. Value: ${JSON.stringify(sources)}`,
          )
        }

        sources.forEach((source, i) => {
          if (typeof source !== "object" || source === null) {
            throw new Error(
              `Source at index ${i} must be an object, received: ${typeof source}. Value: ${JSON.stringify(source)}`,
            )
          }

          if (
            !source.id ||
            typeof source.id !== "string" ||
            source.id.trim() === ""
          ) {
            throw new Error(
              `Source at index ${i} is missing or has invalid 'id' field. Found: ${JSON.stringify(source)}. The 'id' field must be a non-empty string.`,
            )
          }

          if (
            !source.title ||
            typeof source.title !== "string" ||
            source.title.trim() === ""
          ) {
            throw new Error(
              `Source at index ${i} is missing or has invalid 'title' field. Found: ${JSON.stringify(source)}. The 'title' field must be a non-empty string.`,
            )
          }
        })

        addOrUpdateArtifact("source-attribution", {
          claim,
          sources,
          title,
          description,
        })

        return `Created source attribution for "${title || claim.substring(0, 50)}..." with ${sources.length} source${sources.length === 1 ? "" : "s"}`
      } catch (error) {
        console.error("Error in create_source_attribution handler:", error)
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error"
        return `Failed to create source attribution: ${errorMessage}`
      }
    },
  })
}
