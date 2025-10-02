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

export const RATIONALE_DESCRIPTION =
  `Use rationale artifacts to provide transparent explanations for AI decisions, recommendations, and assessments. Best for incident prioritization, security assessments, impact analysis, approval decisions, and any situation where users need to understand the reasoning behind AI conclusions.

Structure rationale with a clear decision statement, supporting criteria, and detailed reasoning. Use criteria to show the factors that influenced the decision. For each criterion, optionally specify sentiment ('positive', 'negative', 'neutral') to indicate whether high/low values are good or concerning. Provide comprehensive reasoning that explains the logic, context, and implications.

Choose appropriate variants based on context:
- "priority" for urgency and importance assessments (orange theme)
- "severity" for risk and security evaluations (red theme) 
- "impact" for scope and scale analysis (blue theme)
- "decision" for approvals and conclusions (green theme)
- "default" for general explanations (gray theme)

Include confidence levels when available to indicate certainty (0-100 scale: High ≥80%, Medium ≥40%, Low <40%). Use criteria to show key decision factors with sentiment guidance for proper visual styling. Make reasoning comprehensive but concise - explain not just what was decided but why it matters and what the implications are.

Best practices: Keep decision statements clear and actionable. Limit criteria to 3-5 most important factors to avoid complexity. Provide reasoning that connects criteria to the decision outcome. Include business impact and next steps when relevant.

Don't use rationale for simple informational responses that don't involve decision-making. Avoid overly technical reasoning that users can't understand. Don't include irrelevant criteria. Avoid extremely long reasoning that should be broken into multiple rationales.` as const
