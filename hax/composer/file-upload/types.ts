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
export enum DragAndDropType {
  DropToZone = "dropToZone",
  DropToChat = "dropToChat",
}

export interface FileUploadError {
  type: "FILE_TYPE" | "FILE_SIZE" | "UPLOAD_ERROR";
  message: string;
  fileName?: string;
  details?: unknown;
}
