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

export const TIMELINE_STATUSES = [
  "completed",
  "pending",
  "error",
  "warning",
  "in_progress",
  "input_required",
] as const;

export const TimelineItemZod = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  timeAgo: z.string().optional(),
  timestamp: z.number().optional(),
  status: z.enum(TIMELINE_STATUSES).default("completed"),
});

export const TimelineDataZod = z.object({
  title: z.string(),
  items: z.array(TimelineItemZod),
});

export const TimelineArtifactZod = z.object({
  id: z.string(),
  type: z.literal("timeline"),
  data: TimelineDataZod,
});

export type TimelineItem = z.infer<typeof TimelineItemZod>;
export type TimelineData = z.infer<typeof TimelineDataZod>;
export type TimelineArtifact = z.infer<typeof TimelineArtifactZod>;

export const ArtifactTabZod = z.discriminatedUnion("type", [
  TimelineArtifactZod,
]);
export type ArtifactTab = z.infer<typeof ArtifactTabZod>;
