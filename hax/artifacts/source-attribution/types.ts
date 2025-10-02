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

export const SourceZod = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().optional(),
})

export const SourceAttributionArtifactZod = z.object({
  id: z.string(),
  type: z.literal("source-attribution"),
  data: z.object({
    claim: z.string(),
    sources: z.array(SourceZod),
    title: z.string().optional(),
    description: z.string().optional(),
  }),
})

export type Source = z.infer<typeof SourceZod>
export type SourceAttributionArtifact = z.infer<
  typeof SourceAttributionArtifactZod
>

export const ArtifactTabZod = z.discriminatedUnion("type", [
  SourceAttributionArtifactZod,
])
export type ArtifactTab = z.infer<typeof ArtifactTabZod>
