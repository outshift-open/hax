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

export { HAXShowcase } from "./showcase";
export type { HAXShowcaseProps } from "./showcase";
export { useShowcaseAction } from "./action";
export { SHOWCASE_DESCRIPTION } from "./description";
export {
  ShowcaseArtifactZod,
  ShowcaseItemZod,
  ShowcaseCategoryZod,
  ShowcaseVariantZod,
} from "./types";
export type {
  ShowcaseArtifact,
  ShowcaseItemData,
  ShowcaseCategoryData,
  ShowcaseVariant,
} from "./types";