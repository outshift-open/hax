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

export const CONTEXTUAL_EXPLANATION_DESCRIPTION =
  `Use contextual explanation artifacts to present structured explanations for system changes, agent decisions, or automated actions. Best for explaining why something happened, displaying configuration changes, routing modifications, and any situation where users need to understand the reasoning behind an action with supporting details.

Structure each explanation with an alert section (title and description explaining why something happened) and a details section with label-value pairs. Include action buttons for user response.

Best practices:
- Provide a clear, concise alert title that summarizes why something happened
- Use the alert description to give more context about the reasoning
- Keep detail labels consistent and descriptive
- Use isSubItem for hierarchical or nested information
- Use isBoldLabel to emphasize important details
- Limit to 5-8 detail items for readability
- Make button labels action-oriented and clear

Don't use contextual explanations for simple notifications or single-line messages. Avoid vague explanations. Don't include details without clear labels.` as const
