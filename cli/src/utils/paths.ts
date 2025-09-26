import path from "path"

/**
 * Get the composers directory path based on the artifacts path
 * @param artifactsPath - The artifacts directory path from config
 * @returns The composers directory path (same parent as artifacts)
 */
export function getComposersPath(artifactsPath: string): string {
  return path.join(path.dirname(artifactsPath), "composers")
}
