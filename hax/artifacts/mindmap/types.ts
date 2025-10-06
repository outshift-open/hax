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

import { z } from "zod";

export const NodeZod = z.object({
  id: z.string(),
  label: z.string(),
  x: z.number().optional(),
  y: z.number().optional(),
});

export const ConnectionZod = z.object({
  from: z.string(),
  to: z.string(),
});

export type Node = z.infer<typeof NodeZod>;
export type Connection = z.infer<typeof ConnectionZod>;

export const LayoutOptionsZod = z.record(z.string(), z.string()).optional();

export const MindmapArgsZod = z.object({
  title: z.string(),
  nodes: z.array(NodeZod),
  connections: z.array(ConnectionZod).optional(),
  layoutAlgorithm: z.string().optional(),
  layoutOptions: LayoutOptionsZod,
});

export const MindmapArtifactZod = z.object({
  id: z.string(),
  type: z.literal("mindmap"),
  data: MindmapArgsZod,
});
export type MindmapArtifact = z.infer<typeof MindmapArtifactZod>;

export const ArtifactTabZod = z.discriminatedUnion("type", [
  MindmapArtifactZod,
]);
export type ArtifactTab = z.infer<typeof ArtifactTabZod>;
