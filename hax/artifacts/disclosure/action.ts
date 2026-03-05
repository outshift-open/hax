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
import { DisclosureData } from "./types"
import { DISCLOSURE_DESCRIPTION } from "./description"

interface UseDisclosureActionProps {
  addOrUpdateArtifact: (
    type: "disclosure",
    data: DisclosureData,
  ) => void
}

export const useDisclosureAction = ({
  addOrUpdateArtifact,
}: UseDisclosureActionProps) => {
  useCopilotAction({
    name: "create_disclosure",
    description: DISCLOSURE_DESCRIPTION,
    parameters: [
      {
        name: "title",
        type: "string",
        description: "Title for the disclosure dialog header (e.g., 'Disclosure')",
        required: false,
      },
      {
        name: "badge",
        type: "string",
        description: "Badge text to show below the AI icon (e.g., 'AI Powered')",
        required: false,
      },
      {
        name: "headline",
        type: "string",
        description: "Main headline in the dialog body",
        required: false,
      },
      {
        name: "infoAlert",
        type: "string",
        description: "Important message displayed in the info alert box with gradient border",
        required: true,
      },
      {
        name: "capabilitiesJson",
        type: "string",
        description: "JSON string with capabilities section: { title: string, items: string[] }",
        required: false,
      },
      {
        name: "limitationsJson",
        type: "string",
        description: "JSON string with limitations section: { title: string, items: string[] }",
        required: false,
      },
      {
        name: "privacyTitle",
        type: "string",
        description: "Title for the privacy box (e.g., 'Privacy & Data')",
        required: false,
      },
      {
        name: "privacyText",
        type: "string",
        description: "Privacy/data usage information text",
        required: false,
      },
      {
        name: "actionButtonText",
        type: "string",
        description: "Text for the main action button (e.g., 'I Understand, Continue')",
        required: false,
      },
      {
        name: "showCancelButton",
        type: "boolean",
        description: "Whether to show a cancel/decline button",
        required: false,
      },
      {
        name: "cancelButtonText",
        type: "string",
        description: "Text for the cancel button (e.g., 'Decline')",
        required: false,
      },
    ],
    handler: async (args) => {
      try {
        const {
          title,
          badge,
          headline,
          infoAlert,
          capabilitiesJson,
          limitationsJson,
          privacyTitle,
          privacyText,
          actionButtonText,
          showCancelButton,
          cancelButtonText,
        } = args

        const data: DisclosureData = {
          title: title || "Disclosure",
          badge: badge || "AI Powered",
          headline: headline || "Disclosure",
          infoAlert,
          privacyTitle,
          privacyText,
          actionButtonText: actionButtonText || "I Understand, Continue",
          showCancelButton,
          cancelButtonText,
        }

        if (capabilitiesJson) {
          const capabilities = JSON.parse(capabilitiesJson)
          data.capabilities = {
            title: capabilities.title || "What I Can Do",
            icon: "check",
            items: capabilities.items || [],
            defaultOpen: true,
          }
        }

        if (limitationsJson) {
          const limitations = JSON.parse(limitationsJson)
          data.limitations = {
            title: limitations.title || "Important Limitations",
            icon: "warning",
            items: limitations.items || [],
            defaultOpen: true,
          }
        }

        addOrUpdateArtifact("disclosure", data)

        return `Created disclosure "${title || "Disclosure"}"`
      } catch (error) {
        console.error("Error in create_disclosure handler:", error)
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error"
        return `Failed to create disclosure: ${errorMessage}`
      }
    },
  })
}
