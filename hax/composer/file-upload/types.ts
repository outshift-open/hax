import { z } from "zod";

export const FileUploadArtifactZod = z.object({
  id: z.string(),
  type: z.literal("fileUpload"),
  data: z.object({
    message: z.string().optional(),
  }),
});
export type FileUploadArtifact = z.infer<typeof FileUploadArtifactZod>;
export const ArtifactTabZod = z.discriminatedUnion("type", [
  FileUploadArtifactZod,
]);

export type ArtifactTab = z.infer<typeof ArtifactTabZod>;
