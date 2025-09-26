export interface FileUploadError {
  type: "FILE_TYPE" | "FILE_SIZE" | "UPLOAD_ERROR";
  message: string;
  fileName?: string;
  details?: unknown;
}
