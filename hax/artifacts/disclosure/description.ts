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

export const DISCLOSURE_DESCRIPTION =
  `Use disclosure artifacts to present AI transparency information, terms of service, or important notices that users must acknowledge before proceeding. Best for AI interaction disclaimers, capability/limitation disclosures, privacy notices, and consent flows.

Structure each disclosure with:
- A title (header of the dialog)
- A badge (e.g., "AI Powered")
- A headline (main title in the body)
- An info alert (key message with gradient border)
- Capabilities section (what the AI can do)
- Limitations section (what the AI cannot do)
- Privacy box (data usage information)
- Action button (acknowledgment/continue)

Best practices:
- Keep the info alert message clear and concise
- List 3-5 capabilities and limitations for easy scanning
- Make the privacy text transparent about data usage
- Use clear action button text (e.g., "I Understand, Continue")
- Show cancel button when declining is an option

Don't use disclosure artifacts for general information display. Avoid overly technical language. Don't include excessive items in capability/limitation lists.` as const
