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

export const SOURCE_ATTRIBUTION_DESCRIPTION = `Create a source attribution component that displays claims with their supporting sources as clickable badges.

This component allows transparent citation of information sources for verification and accountability. Users can click on source badges to verify information and explore additional context.

Each source in sourcesJson MUST include:
- id: Unique string identifier
- title: Display name/title

Optional source fields:
- url: Makes the badge clickable`
