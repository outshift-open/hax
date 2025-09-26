export const pluralize = (
  count: number,
  singular: string,
  plural?: string,
): string => (count === 1 ? singular : plural || `${singular}s`)

export const conjugate = (
  count: number,
  singular: string,
  plural: string,
): string => (count === 1 ? singular : plural)

export const generateComponentMessage = (
  count: number,
  type: "success" | "error",
): string => {
  const componentText = pluralize(count, "component")

  if (type === "success") {
    return [
      `✨ Successfully added ${count} ${componentText}!`,
      "📦 Components are ready to use",
    ]
      .filter(Boolean)
      .join("\n")
  } else {
    return `❌ No components were successfully added.`
  }
}
