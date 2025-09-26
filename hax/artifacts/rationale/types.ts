import z from "zod"

const RationaleCriterionZod = z.object({
  label: z.string(),
  value: z.string(),
  description: z.string().optional(),
  sentiment: z.enum(["positive", "negative", "neutral"]).optional(),
})

export const RationaleArtifactZod = z.object({
  id: z.string(),
  type: z.literal("rationale"),
  data: z.object({
    decision: z.string(),
    criteria: z.array(RationaleCriterionZod).optional(),
    reasoning: z.string(),
    confidence: z.number().optional(),
    confidenceDescription: z.string().optional(),
    variant: z
      .enum(["priority", "severity", "impact", "decision", "default"])
      .optional(),
    expandable: z.boolean().optional(),
    defaultExpanded: z.boolean().optional(),
    showConfidence: z.boolean().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
  }),
})

export type RationaleArtifact = z.infer<typeof RationaleArtifactZod>

export const ArtifactTabZod = z.discriminatedUnion("type", [
  RationaleArtifactZod,
])
export type ArtifactTab = z.infer<typeof ArtifactTabZod>
