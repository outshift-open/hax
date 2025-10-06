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

import z from "zod";

const StatZod = z.object({
  label: z.string(),
  value: z.string(),
});

const SubStatZod = z.object({
  label: z.string(),
  value: z.string(),
  sublabel: z.string().optional(),
  highlight: z.boolean().optional(),
});

const TableColumnZod = z.object({
  label: z.string(),
});

const TableZod = z.object({
  columns: z.array(TableColumnZod),
  data: z.array(z.array(z.string())),
});
export const DetailsArtifactZod = z.object({
  id: z.string(),
  type: z.literal("details"),
  data: z.object({
    title: z.string(),
    description: z.string().optional(),
    stats: z.array(StatZod).optional(),
    subtitle: z.string().optional(),
    substats: z.array(SubStatZod).optional(),
    table: TableZod.optional(),
  }),
});
export type DetailsArtifact = z.infer<typeof DetailsArtifactZod>;

export const ArtifactTabZod = z.discriminatedUnion("type", [
  DetailsArtifactZod,
]);
export type ArtifactTab = z.infer<typeof ArtifactTabZod>;
