import { z } from "zod";

export const NodeZod = z.object({
  id: z.string(),
  label: z.string(),
  x: z.number().optional(),
  y: z.number().optional(),
});

export const ConnectionZod = z.object({
  from: z.string(),
  to: z.string(),
});

export type Node = z.infer<typeof NodeZod>;
export type Connection = z.infer<typeof ConnectionZod>;

export const LayoutOptionsZod = z.record(z.string(), z.string()).optional();

export const MindmapArgsZod = z.object({
  title: z.string(),
  nodes: z.array(NodeZod),
  connections: z.array(ConnectionZod).optional(),
  layoutAlgorithm: z.string().optional(),
  layoutOptions: LayoutOptionsZod,
});

export const MindmapArtifactZod = z.object({
  id: z.string(),
  type: z.literal("mindmap"),
  data: MindmapArgsZod,
});
export type MindmapArtifact = z.infer<typeof MindmapArtifactZod>;

export const ArtifactTabZod = z.discriminatedUnion("type", [
  MindmapArtifactZod,
]);
export type ArtifactTab = z.infer<typeof ArtifactTabZod>;
