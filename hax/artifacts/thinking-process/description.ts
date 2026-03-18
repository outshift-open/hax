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

export const THINKING_PROCESS_DESCRIPTION =
  `Use thinking process artifacts to visualize AI reasoning, decision-making steps, and workflow progress. Best for showing multi-step analysis, debugging processes, agent reasoning chains, and any situation where users need to understand how conclusions were reached.

Structure each step with a clear title, optional description, and status indicator. The component displays steps in a collapsible violet-themed section with visual status indicators (completed, in-progress, pending, error).

Features:
- Card header with customizable title and optional badge
- Collapsible Agent Reasoning section with purple theme
- Individual process steps with status icons (checkmark, spinner, circle, X)
- Step metrics/confidence chips for completion tracking
- Optional toggle to show/hide reasoning

Step statuses:
- "completed": Green checkmark - step finished successfully
- "in-progress": Spinning loader - currently processing
- "pending": Gray circle - waiting to be processed
- "error": Red X - step failed or encountered an error

Best practices:
- Use clear, action-oriented step titles (e.g., "Analyzing input data", "Validating results")
- Mark current step as "in-progress" to show active processing
- Include descriptions for complex steps that need explanation
- Use metrics to show overall progress (e.g., "Steps Completed: 3/5")
- Limit to 3-7 steps per process for readability

Don't use thinking process for simple status updates or single-step operations. Avoid using it when the reasoning process isn't relevant to the user's understanding.` as const
