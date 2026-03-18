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

export const DIAGNOSTIC_REPORT_DESCRIPTION =
  `Use diagnostic report artifacts to present structured diagnostic findings with actionable recommendations. Best for troubleshooting results, root cause analysis, system health assessments, and any situation where users need to see potential causes ranked by confidence with corresponding actions.

Structure each diagnostic item with a suspected cause, confidence level (high/medium/low with percentage), rationale explaining the assessment, and a recommended action. Multiple items are displayed in a tabular format for easy comparison.

Confidence levels map to visual indicators:
- "high" (green): 70-100% confidence, strong evidence supports this cause
- "medium" (orange): 40-69% confidence, moderate evidence, needs investigation
- "low" (yellow): 0-39% confidence, possible but requires validation

Best practices:
- Order items by confidence level (highest first) to prioritize investigation
- Keep suspected cause text concise and specific
- Provide clear rationale connecting evidence to the suspected cause
- Make recommended actions actionable and specific
- Limit to 3-5 diagnostic items to avoid overwhelming users

Don't use diagnostic reports for simple status updates or single-cause issues. Avoid vague or generic suspected causes. Don't include items without supporting rationale.` as const
