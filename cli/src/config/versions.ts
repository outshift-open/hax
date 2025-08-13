export const COPILOTKIT_VERSION = "1.9.3"

export const PINNED_DEPENDENCIES = {
  "@copilotkit/react-core": COPILOTKIT_VERSION,
  "@copilotkit/react-ui": COPILOTKIT_VERSION,
  "@copilotkit/runtime": COPILOTKIT_VERSION,
} as const

export function getPinnedDependency(packageName: string): string {
  if (packageName in PINNED_DEPENDENCIES) {
    return `${packageName}@${PINNED_DEPENDENCIES[packageName as keyof typeof PINNED_DEPENDENCIES]}`
  }
  return packageName
}
