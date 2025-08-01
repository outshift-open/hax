import { z } from "zod";

export const CodeEditorArgsZod = z.object({
  language: z.string(),
  code: z.string(),
});

export const CodeEditorArtifactZod = z.object({
  id: z.string(),
  type: z.literal("codeEditor"),
  data: CodeEditorArgsZod,
});

export type CodeEditorArtifact = z.infer<typeof CodeEditorArtifactZod>;
export const ArtifactTabZod = z.discriminatedUnion("type", [
  CodeEditorArtifactZod,
]);
export type ArtifactTab = z.infer<typeof ArtifactTabZod>;
