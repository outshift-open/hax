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

export {
  HAXDisclosure,
  DisclosureAIIcon,
  DisclosureBadge,
  DisclosureInfoAlert,
  DisclosureCollapsible,
  DisclosurePrivacyBox,
  DisclosureList,
  DisclosureButton,
} from "./disclosure"
export type { HAXDisclosureProps } from "./disclosure"
export { useDisclosureAction } from "./action"
export type { DisclosureArtifact, DisclosureData, DisclosureCollapsibleItem } from "./types"
export { DisclosureArtifactZod, DisclosureCollapsibleItemZod } from "./types"
export { DISCLOSURE_DESCRIPTION } from "./description"
