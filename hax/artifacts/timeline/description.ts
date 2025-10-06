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

export const TIMELINE_DESCRIPTION =
  `Use timelines to show chronological sequences of events, processes, or project milestones. Best for project tracking, historical overviews, process workflows, and status updates. Supports different status types (completed, pending, error, warning, in_progress, input_required) with visual indicators.

Order items chronologically with most recent first unless showing a planned sequence. Use descriptive titles and brief descriptions for each item. Choose appropriate status types: 'completed' for finished tasks, 'pending' for upcoming items, 'in_progress' for active work, 'error' for failures, 'warning' for issues, 'input_required' for blocked items.

Keep item titles concise (3-8 words) but descriptive. Use timeAgo format for relative times ("2 hours ago", "yesterday") or specific timestamps for precision. Limit to 8-12 items for optimal visual clarity. Group related activities under logical phases or categories.

Don't mix different time scales without clear indication (don't show minutes and years in same timeline). Avoid overly technical titles that users won't understand. Don't use error status for minor issues - reserve for actual failures. Avoid extremely long descriptions that overwhelm the timeline view. Don't show future items with past tense descriptions.` as const;
