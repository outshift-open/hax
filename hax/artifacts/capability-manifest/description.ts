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

export const CAPABILITY_MANIFEST_DESCRIPTION =
  `Use capability manifest artifacts to display AI agent capabilities, constraints, and connection status to users. This component is essential for setting user expectations about what an AI agent can and cannot do, preventing the "Mental Model Mismatch" where users assume the agent has capabilities it doesn't possess.

Best used for:
- Agent initialization and handshake displays
- Showing available tools and capabilities
- Displaying runtime constraints and policies
- Session status and connection information
- Multi-agent capability comparison

Structure your manifest with:
1. Agent Header: Name, role, and status text to identify the agent
2. Capabilities: List of available tools/features with their status (enabled, disabled, pending, error)
3. Alerts: Runtime constraints, warnings, or important information
4. Status Footer: Connection state and session identifier

Capability statuses:
- "enabled": Feature is available and ready to use (green checkmark)
- "disabled": Feature is not available (gray circle)
- "pending": Feature is loading or awaiting activation (yellow alert)
- "error": Feature encountered an error (red X)

Alert variants:
- "warning": Orange - for constraints and cautions (e.g., "Requires approval for external API calls")
- "error": Red - for critical issues or failures
- "info": Blue - for informational notices
- "success": Green - for positive confirmations

Connection statuses:
- "connected": Agent is online and ready (green dot)
- "connecting": Establishing connection (pulsing yellow dot)
- "disconnected": Agent is offline (gray dot)
- "error": Connection failed (red dot)

Best practices:
- Always display capability manifest at session start (Phase 1) before user interaction
- Keep capability names concise but descriptive
- Use alerts sparingly - only for important constraints or warnings
- Include session ID for debugging and tracking purposes
- Group related capabilities when there are many (use capabilityGroups)
- Set appropriate connection status to reflect actual agent state

Don't use capability manifest for:
- Displaying conversation history or messages
- Showing detailed technical documentation
- Complex data visualizations
- Form inputs or user interactions` as const
