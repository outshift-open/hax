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

import path from "path"

/**
 * Get the composers directory path based on the artifacts path
 * @param artifactsPath - The artifacts directory path from config
 * @returns The composers directory path (same parent as artifacts)
 */
export function getComposersPath(artifactsPath: string): string {
  return path.join(path.dirname(artifactsPath), "composers")
}
