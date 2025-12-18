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

const DiagnosticItemZod = z.object({
  id: z.string(),
  suspectedCause: z.string(),
  confidence: z.number().min(0).max(100),
  confidenceLevel: z.enum(["high", "medium", "low"]),
  rationale: z.string(),
  recommendedAction: z.string(),
})

export const DiagnosticReportArtifactZod = z.object({
  id: z.string(),
  type: z.literal("diagnostic-report"),
  data: z.object({
    title: z.string().optional(),
    items: z.array(DiagnosticItemZod),
  }),
})

export type DiagnosticReportArtifact = z.infer<typeof DiagnosticReportArtifactZod>

export const ArtifactTabZod = z.discriminatedUnion("type", [
  DiagnosticReportArtifactZod,
])
export type ArtifactTab = z.infer<typeof ArtifactTabZod>
