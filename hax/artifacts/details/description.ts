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

export const DETAILS_DESCRIPTION =
  `Use details views to present comprehensive information about a specific entity or topic. Best for dashboards, profile pages, report summaries, and data deep-dives. Supports statistics, key-value pairs, tables, and hierarchical information display with optional highlighting.

Structure information hierarchically with title, subtitle, and description at the top, followed by key stats, then detailed breakdowns. Use stats for highlighting important metrics (revenue, users, performance). Use substats for secondary metrics or comparisons with highlighting for notable values. Include tables for detailed data that needs comparison or sorting.

Keep titles concise but descriptive. Limit main stats to 3-5 key metrics to avoid overwhelming users. Use substats for supporting metrics and comparisons. Organize table data logically with clear column headers. Use highlighting sparingly for truly important values or alerts.

Don't overload with too many statistics - prioritize the most important metrics. Avoid inconsistent data units or formatting within the same view. Don't use tables for simple key-value pairs that would be better as stats. Avoid very wide tables that require horizontal scrolling. Don't mix different types of information without clear grouping or sections.` as const;
