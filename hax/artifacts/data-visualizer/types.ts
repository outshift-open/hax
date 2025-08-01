import z from "zod";

export const DataVisualizerArgsZod = z.object({
  type: z.string(),
  data: z.unknown(),
  options: z.unknown(),
});

export const DataVisualizerArtifactZod = z.object({
  id: z.string(),
  type: z.literal("data_visualizer"),
  data: DataVisualizerArgsZod,
});

export type ChartArtifact = z.infer<typeof DataVisualizerArtifactZod>;

export const ArtifactTabZod = z.discriminatedUnion("type", [
  DataVisualizerArtifactZod,
]);
export type ArtifactTab = z.infer<typeof ArtifactTabZod>;
