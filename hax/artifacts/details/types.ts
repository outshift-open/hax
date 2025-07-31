import z from "zod";

const StatZod = z.object({
  label: z.string(),
  value: z.string(),
});

const SubStatZod = z.object({
  label: z.string(),
  value: z.string(),
  sublabel: z.string().optional(),
  highlight: z.boolean().optional(),
});

const TableColumnZod = z.object({
  label: z.string(),
});

const TableZod = z.object({
  columns: z.array(TableColumnZod),
  data: z.array(z.array(z.string())),
});
export const DetailsArtifactZod = z.object({
  id: z.string(),
  type: z.literal("details"),
  data: z.object({
    title: z.string(),
    description: z.string().optional(),
    stats: z.array(StatZod).optional(),
    subtitle: z.string().optional(),
    substats: z.array(SubStatZod).optional(),
    table: TableZod.optional(),
  }),
});
export type DetailsArtifact = z.infer<typeof DetailsArtifactZod>;

export const ArtifactTabZod = z.discriminatedUnion("type", [
  DetailsArtifactZod,
]);
export type ArtifactTab = z.infer<typeof ArtifactTabZod>;
