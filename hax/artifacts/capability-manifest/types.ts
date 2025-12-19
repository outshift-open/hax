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

import z from "zod"

// Capability status enum
export const CapabilityStatusZod = z.enum([
  "enabled",
  "disabled",
  "pending",
  "error",
])
export type CapabilityStatus = z.infer<typeof CapabilityStatusZod>

// Alert variant enum
export const AlertVariantZod = z.enum(["warning", "error", "info", "success"])
export type AlertVariant = z.infer<typeof AlertVariantZod>

// Connection status enum
export const ConnectionStatusZod = z.enum([
  "connected",
  "connecting",
  "disconnected",
  "error",
])
export type ConnectionStatus = z.infer<typeof ConnectionStatusZod>

// Card variant enum
export const CardVariantZod = z.enum(["default", "outline", "ghost"])
export type CardVariant = z.infer<typeof CardVariantZod>

// Size variant enum
export const SizeVariantZod = z.enum(["sm", "md", "lg"])
export type SizeVariant = z.infer<typeof SizeVariantZod>

// Capability schema
export const CapabilityZod = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: CapabilityStatusZod,
  iconColor: z.string().optional(),
  metadata: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
})
export type Capability = z.infer<typeof CapabilityZod>

// Alert schema
export const AlertZod = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  variant: AlertVariantZod,
  dismissible: z.boolean().optional(),
})
export type Alert = z.infer<typeof AlertZod>

// Capability group schema
export const CapabilityGroupZod = z.object({
  id: z.string(),
  label: z.string(),
  capabilities: z.array(CapabilityZod),
  collapsible: z.boolean().optional(),
  defaultCollapsed: z.boolean().optional(),
})
export type CapabilityGroup = z.infer<typeof CapabilityGroupZod>

// Agent header schema
export const AgentHeaderZod = z.object({
  name: z.string(),
  role: z.string().optional(),
  statusText: z.string().optional(),
})
export type AgentHeader = z.infer<typeof AgentHeaderZod>

// Agent tag schema
export const AgentTagZod = z.object({
  label: z.string(),
  color: z.string().optional(),
  variant: z.enum(["default", "outline", "filled"]).optional(),
})
export type AgentTag = z.infer<typeof AgentTagZod>

// Status info schema
export const StatusInfoZod = z.object({
  status: ConnectionStatusZod,
  label: z.string().optional(),
  sessionId: z.string().optional(),
  metadata: z.record(z.union([z.string(), z.number()])).optional(),
  color: z.string().optional(),
})
export type StatusInfo = z.infer<typeof StatusInfoZod>

// Main artifact data schema
export const CapabilityManifestDataZod = z.object({
  // Agent header
  agentName: z.string().optional(),
  agentRole: z.string().optional(),
  statusText: z.string().optional(),
  agentTags: z.array(AgentTagZod).optional(),

  // Capabilities
  capabilities: z.array(CapabilityZod).optional(),
  capabilityGroups: z.array(CapabilityGroupZod).optional(),
  capabilitiesLabel: z.string().optional(),
  showCapabilities: z.boolean().optional(),

  // Alerts
  alerts: z.array(AlertZod).optional(),

  // Status
  connectionStatus: ConnectionStatusZod.optional(),
  connectionLabel: z.string().optional(),
  sessionId: z.string().optional(),
  statusMetadata: z.record(z.union([z.string(), z.number()])).optional(),

  // Customization
  showSeparator: z.boolean().optional(),
  showStatus: z.boolean().optional(),

  // Styling
  variant: CardVariantZod.optional(),
  size: SizeVariantZod.optional(),
  showShadow: z.boolean().optional(),
})
export type CapabilityManifestData = z.infer<typeof CapabilityManifestDataZod>

// Full artifact schema
export const CapabilityManifestArtifactZod = z.object({
  id: z.string(),
  type: z.literal("capability-manifest"),
  data: CapabilityManifestDataZod,
})
export type CapabilityManifestArtifact = z.infer<
  typeof CapabilityManifestArtifactZod
>

// Artifact tab union (for integration with other artifacts)
export const ArtifactTabZod = z.discriminatedUnion("type", [
  CapabilityManifestArtifactZod,
])
export type ArtifactTab = z.infer<typeof ArtifactTabZod>
