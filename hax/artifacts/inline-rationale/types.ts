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

/**
 * Intent drives the visual theme of the inline rationale
 * - warn: yellow/amber theme for warnings
 * - approve: green theme for approvals
 * - block: red theme for blocks/denials
 * - inform: blue theme for informational
 */
const IntentZod = z.enum(["warn", "approve", "block", "inform"])

/**
 * Impact level for summary badge
 */
const ImpactLevelZod = z.enum(["low", "medium", "high", "critical"])

/**
 * Exploitability level for summary badge
 */
const ExploitabilityLevelZod = z.enum(["none", "low", "medium", "high"])

/**
 * Source of the assessment
 */
const GeneratedByZod = z.enum(["ai", "human", "hybrid"])

/**
 * Assessment summary with enum-based fields
 */
const AssessmentSummaryZod = z.object({
  impact: ImpactLevelZod,
  exploitability: ExploitabilityLevelZod,
  tags: z.array(z.string()).optional(),
})

/**
 * A single rationale detail item
 */
const RationaleItemZod = z.object({
  label: z.string(),
  value: z.string(),
})

/**
 * Optional metadata for tracking
 */
const MetadataZod = z.object({
  generated_by: GeneratedByZod,
  model: z.string().optional(),
  version: z.string().optional(),
  timestamp: z.string().optional(),
})

/**
 * Inline Rationale Artifact Data Schema
 */
export const InlineRationaleArtifactZod = z.object({
  id: z.string(),
  type: z.literal("inline-rationale"),
  data: z.object({
    /** Assessment type - flexible string (e.g., "security_assessment", "code_review") */
    assessmentType: z.string(),
    /** Intent drives visual theme: warn=yellow, block=red, approve=green, inform=blue */
    intent: IntentZod,
    /** Display title */
    title: z.string(),
    /** Main description paragraph */
    description: z.string(),
    /** Structured summary for badges (impact + exploitability) */
    summary: AssessmentSummaryZod,
    /** Detail items displayed as "Label: Value" pairs */
    rationale: z.array(RationaleItemZod),
    /** Confidence score 0-100 (badge color derived from intent) */
    confidence: z.number().min(0).max(100),
    /** Optional metadata */
    metadata: MetadataZod.optional(),
    /** Optional: collapsed state */
    collapsed: z.boolean().optional(),
    /** Optional: enable collapse toggle */
    collapsible: z.boolean().optional(),
  }),
})

export type InlineRationaleArtifact = z.infer<typeof InlineRationaleArtifactZod>

// Re-export individual types for convenience
export type Intent = z.infer<typeof IntentZod>
export type ImpactLevel = z.infer<typeof ImpactLevelZod>
export type ExploitabilityLevel = z.infer<typeof ExploitabilityLevelZod>
export type GeneratedBy = z.infer<typeof GeneratedByZod>
export type AssessmentSummary = z.infer<typeof AssessmentSummaryZod>
export type RationaleItem = z.infer<typeof RationaleItemZod>
export type Metadata = z.infer<typeof MetadataZod>
