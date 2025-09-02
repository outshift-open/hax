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
