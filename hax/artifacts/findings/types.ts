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

const FindingSourceZod = z.object({
  label: z.string(),
  href: z.string().optional(),
})

const FindingZod = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  sources: z.array(FindingSourceZod).optional(),
})

export const FindingsArtifactZod = z.object({
  id: z.string(),
  type: z.literal("findings"),
  data: z.object({
    title: z.string(),
    findings: z.array(FindingZod),
    sourcesLabel: z.string().optional(),
    maxVisibleSources: z.number().optional(),
  }),
})

export type FindingsArtifact = z.infer<typeof FindingsArtifactZod>

export const ArtifactTabZod = z.discriminatedUnion("type", [FindingsArtifactZod])
export type ArtifactTab = z.infer<typeof ArtifactTabZod>
