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

import { z } from "zod"

export const DiagnosticItemZod = z.object({
  id: z.string().describe("Unique identifier for the diagnostic item"),
  suspectedCause: z.string().describe("Description of the potential cause"),
  confidence: z.number().min(0).max(100).describe("Confidence percentage 0-100"),
  confidenceLevel: z
    .enum(["high", "medium", "low"])
    .describe("Confidence category: high (70-100%), medium (40-69%), low (0-39%)"),
  rationale: z.string().describe("Explanation connecting evidence to the suspected cause"),
  recommendedAction: z.string().describe("Actionable next step to investigate or resolve"),
})

export const DiagnosticReportArtifactZod = z.object({
  id: z.string(),
  type: z.literal("diagnostic-report"),
  data: z.object({
    title: z.string().optional().describe("Title for the diagnostic report"),
    items: z.array(DiagnosticItemZod).describe("Diagnostic items ordered by confidence"),
  }),
})

export type DiagnosticReportArtifact = z.infer<typeof DiagnosticReportArtifactZod>
export type DiagnosticItem = z.infer<typeof DiagnosticItemZod>
