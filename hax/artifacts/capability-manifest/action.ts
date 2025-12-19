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
import { CAPABILITY_MANIFEST_DESCRIPTION } from "./description"

interface UseCapabilityManifestActionProps {
  addOrUpdateArtifact: (
    type: "capability-manifest",
    data: Extract<ArtifactTab, { type: "capability-manifest" }>["data"],
  ) => void
}

export const useCapabilityManifestAction = ({
  addOrUpdateArtifact,
}: UseCapabilityManifestActionProps) => {
  useCopilotAction({
    name: "create_capability_manifest",
    description: CAPABILITY_MANIFEST_DESCRIPTION,
    parameters: [
      // Agent Header
      {
        name: "agentName",
        type: "string",
        description: "Name of the AI agent (e.g., 'Data Analyst', 'Code Assistant')",
        required: true,
      },
      {
        name: "agentRole",
        type: "string",
        description: "Role or type of the agent (e.g., 'Agent', 'AI', 'Enterprise AI')",
        required: false,
      },
      {
        name: "statusText",
        type: "string",
        description: "Status message displayed below agent name (e.g., 'Ready for interaction')",
        required: false,
      },
      {
        name: "agentTagsJson",
        type: "string",
        description: "JSON array of tags: [{label: string, variant?: 'default'|'outline'|'filled', color?: string}]",
        required: false,
      },

      // Capabilities
      {
        name: "capabilitiesJson",
        type: "string",
        description: "JSON array of capabilities: [{id: string, name: string, status: 'enabled'|'disabled'|'pending'|'error', description?: string, iconColor?: string}]",
        required: false,
      },
      {
        name: "capabilityGroupsJson",
        type: "string",
        description: "JSON array of capability groups for organized display: [{id: string, label: string, capabilities: [...], collapsible?: boolean, defaultCollapsed?: boolean}]",
        required: false,
      },
      {
        name: "capabilitiesLabel",
        type: "string",
        description: "Custom label for capabilities section (default: 'Capabilities')",
        required: false,
      },
      {
        name: "showCapabilities",
        type: "boolean",
        description: "Whether to show capabilities section (default: true)",
        required: false,
      },

      // Alerts
      {
        name: "alertsJson",
        type: "string",
        description: "JSON array of alerts: [{id: string, title: string, description: string, variant: 'warning'|'error'|'info'|'success', dismissible?: boolean}]",
        required: false,
      },

      // Status
      {
        name: "connectionStatus",
        type: "string",
        description: "Connection status: 'connected', 'connecting', 'disconnected', or 'error'",
        required: false,
      },
      {
        name: "connectionLabel",
        type: "string",
        description: "Custom label for connection status (e.g., 'Handshake Complete')",
        required: false,
      },
      {
        name: "sessionId",
        type: "string",
        description: "Session identifier for tracking (e.g., 'HAX-2024-DA-001')",
        required: false,
      },
      {
        name: "statusMetadataJson",
        type: "string",
        description: "JSON object of additional status metadata: {key: value} (e.g., {\"Region\": \"US-EAST\", \"Uptime\": \"99.9%\"})",
        required: false,
      },

      // Customization
      {
        name: "showSeparator",
        type: "boolean",
        description: "Whether to show separator line before status (default: true)",
        required: false,
      },
      {
        name: "showStatus",
        type: "boolean",
        description: "Whether to show status footer (default: true)",
        required: false,
      },

      // Styling
      {
        name: "variant",
        type: "string",
        description: "Card style variant: 'default' (with shadow), 'outline' (border only), 'ghost' (transparent)",
        required: false,
      },
      {
        name: "size",
        type: "string",
        description: "Size variant: 'sm' (compact), 'md' (default), 'lg' (expanded)",
        required: false,
      },
      {
        name: "showShadow",
        type: "boolean",
        description: "Whether to show card shadow (default: true)",
        required: false,
      },
    ],
    handler: async (args) => {
      try {
        const {
          agentName,
          agentRole,
          statusText,
          agentTagsJson,
          capabilitiesJson,
          capabilityGroupsJson,
          capabilitiesLabel,
          showCapabilities,
          alertsJson,
          connectionStatus,
          connectionLabel,
          sessionId,
          statusMetadataJson,
          showSeparator,
          showStatus,
          variant,
          size,
          showShadow,
        } = args

        // Parse JSON strings
        let agentTags
        if (agentTagsJson) {
          agentTags = JSON.parse(agentTagsJson)
        }

        let capabilities
        if (capabilitiesJson) {
          capabilities = JSON.parse(capabilitiesJson)
        }

        let capabilityGroups
        if (capabilityGroupsJson) {
          capabilityGroups = JSON.parse(capabilityGroupsJson)
        }

        let alerts
        if (alertsJson) {
          alerts = JSON.parse(alertsJson)
        }

        let statusMetadata
        if (statusMetadataJson) {
          statusMetadata = JSON.parse(statusMetadataJson)
        }

        addOrUpdateArtifact("capability-manifest", {
          agentName,
          agentRole,
          statusText,
          agentTags,
          capabilities,
          capabilityGroups,
          capabilitiesLabel,
          showCapabilities,
          alerts,
          connectionStatus: connectionStatus as
            | "connected"
            | "connecting"
            | "disconnected"
            | "error"
            | undefined,
          connectionLabel,
          sessionId,
          statusMetadata,
          showSeparator,
          showStatus,
          variant: variant as "default" | "outline" | "ghost" | undefined,
          size: size as "sm" | "md" | "lg" | undefined,
          showShadow,
        })

        return `Created capability manifest for "${agentName}"`
      } catch (error) {
        console.error("Error in create_capability_manifest handler:", error)
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error"
        return `Failed to create capability manifest: ${errorMessage}`
      }
    },
  })
}
