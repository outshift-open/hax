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

export const DATA_TABLE_DESCRIPTION =
  `Use data tables to display structured, tabular data that the user can manage and refine. Best for datasets, comparisons, lists with multiple attributes, task tracking, and bulk data management.

Define columns with id and header. Each row has an id and a cells object mapping column ids to values. Cell values can be plain text, numbers, or special types:
- { "type": "avatar", "initials": "AB", "name": "Alice Brown" } for user avatars with names
- { "type": "progress", "value": 75 } for progress bars (0-100, auto-colored: red/orange/yellow/green)
- { "type": "labels", "items": [{ "text": "Tag", "color": "green" }] } for label badges (colors: red, green, blue, orange, gray)

Keep tables concise — prefer 3-6 columns and reasonable row counts. Use sortable columns for key data fields.` as const;
