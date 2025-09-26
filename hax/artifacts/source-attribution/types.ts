import { z } from "zod"

export const SourceZod = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().optional(),
})

export const SourceAttributionArtifactZod = z.object({
  id: z.string(),
  type: z.literal("source-attribution"),
  data: z.object({
    claim: z.string(),
    sources: z.array(SourceZod),
    title: z.string().optional(),
    description: z.string().optional(),
  }),
})

export type Source = z.infer<typeof SourceZod>
export type SourceAttributionArtifact = z.infer<
  typeof SourceAttributionArtifactZod
>

export const ArtifactTabZod = z.discriminatedUnion("type", [
  SourceAttributionArtifactZod,
])
export type ArtifactTab = z.infer<typeof ArtifactTabZod>
