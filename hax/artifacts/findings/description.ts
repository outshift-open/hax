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

export const FINDINGS_DESCRIPTION =
  `Use findings artifacts to present a list of key insights, recommendations, or discoveries with their supporting sources. Best for research summaries, analysis results, audit findings, security assessments, and any situation where users need to see multiple findings with source attribution.

Structure each finding with a clear title, descriptive explanation, and optional source references. The panel displays findings in a clean, scannable format with source chips for quick reference.

Features:
- Panel header with customizable title
- Individual finding cards with title and description
- Source chips with overflow handling (shows "+N" when exceeding maxVisibleSources)
- Clean, professional styling following design system guidelines

Best practices:
- Keep finding titles concise and actionable (under 10 words)
- Provide clear, specific descriptions that explain the finding's significance
- Include relevant sources to build credibility and enable follow-up
- Limit to 3-7 findings per panel to maintain readability
- Use consistent source labeling conventions

Don't use findings for simple lists without context or single-item displays. Avoid overly long descriptions that should be broken into separate findings.` as const
