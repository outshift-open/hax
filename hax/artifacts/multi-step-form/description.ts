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

export const MULTI_STEP_FORM_DESCRIPTION =
  `Use the multi-step-form artifact to display a wizard-style form with a stepper progress bar.

The form shows numbered step indicators (completed with checkmark, active with number, upcoming with muted number) connected by horizontal lines, a form section with labeled input fields, and navigation buttons (back/continue).

Provide step definitions (id + label), current step index (0-based), form title, form fields (name, label, type, placeholder, required flag), and button labels.

Use this component for multi-page onboarding flows, account setup wizards, upgrade plans, or any progressive disclosure form pattern.` as const;
