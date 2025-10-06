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

export const FORM_DESCRIPTION =
  `Use forms to collect structured user input with validation and proper field types. Best for user registration, settings configuration, surveys, contact forms, and data entry workflows. Supports text, email, number, select, checkbox, and textarea field types with optional validation.

Choose appropriate field types: 'email' for email validation, 'number' for numeric input, 'select' for predefined options, 'checkbox' for boolean choices, 'textarea' for multi-line text. Always provide clear labels and helpful placeholder text. Mark required fields explicitly and provide validation feedback.

Keep forms focused and concise - limit to 3-7 fields per form for better completion rates. Group related fields logically and use progressive disclosure for complex forms. Provide clear instructions and help text for complex fields. Use consistent spacing and alignment for professional appearance.

Avoid generic labels like "Input" or "Field" - be specific about what data you're collecting. Don't use select dropdowns for more than 10-12 options - consider autocomplete or search instead. Don't make optional fields appear required. Avoid long forms that require scrolling on mobile devices. Always validate email format and provide clear error messages.` as const;
