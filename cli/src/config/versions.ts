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

/**
 * Version management and dependency pinning for HAX CLI
 *
 * This file manages specific version constraints for critical dependencies
 * to ensure compatibility and prevent version conflicts. The CLI will
 * automatically pin these packages to their specified versions when
 * installing components that depend on them.
 */

export const COPILOTKIT_VERSION = "1.10.0"

export const PINNED_DEPENDENCIES = {
  "@copilotkit/react-core": COPILOTKIT_VERSION,
  "@copilotkit/react-ui": COPILOTKIT_VERSION,
  "@copilotkit/runtime": COPILOTKIT_VERSION,
  "@copilotkit/runtime-client-gql": COPILOTKIT_VERSION,
  "@copilotkit/shared": COPILOTKIT_VERSION,
} as const

export function getPinnedDependency(packageName: string): string {
  if (packageName in PINNED_DEPENDENCIES) {
    return `${packageName}@${PINNED_DEPENDENCIES[packageName as keyof typeof PINNED_DEPENDENCIES]}`
  }
  return packageName
}
