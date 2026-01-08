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

export const INLINE_RATIONALE_DESCRIPTION =
  `Use inline-rationale artifacts to display AI-driven assessments, decisions, and explanations with intent-based visual theming. Best for security assessments, code reviews, policy decisions, and any AI-generated rationale that needs clear visual distinction.

Schema (Single Source of Truth):
- intent: Drives the visual theme (warn=yellow, block=red, approve=green, inform=blue)
- description: Main paragraph text explaining the assessment
- summary: { impact, exploitability } for generating badges
- rationale: Detail items as { label, value } pairs
- confidence: 0-100 score (badge color comes from intent)

Choose the appropriate intent based on the nature of the assessment:
- "block" (red): Security vulnerabilities, access denials, critical issues requiring immediate action
- "warn" (yellow): Performance issues, potential problems, warnings that need attention
- "approve" (green): Code review approvals, successful validations, positive outcomes
- "inform" (blue): General information, deployment summaries, neutral notifications

Impact levels: "low", "medium", "high", "critical"
Exploitability levels: "none", "low", "medium", "high"

Best practices:
- Use clear, actionable titles
- Keep description focused on the key message
- Limit rationale items to 3-6 most important factors
- Match intent to the severity/nature of the assessment
- Include confidence when the AI has varying certainty

Don't use inline-rationale for simple text responses. Use it when you need to communicate structured AI reasoning with visual distinction based on the nature of the decision.` as const
