import { useCopilotAction } from "@copilotkit/react-core";
import {
  validExtensions,
  maxFileSize,
  validCodeFiles,
  validDocFiles,
  validWebFiles,
} from "./file-upload.constant";
import { ArtifactTab } from "./types";
import { FILE_UPLOAD_DESCRIPTION } from "./description";

interface UseFileUploadActionProps {
  onShowFileUpload?: () => void;
  addOrUpdateArtifact: (
    type: "fileUpload",
    data: Extract<ArtifactTab, { type: "fileUpload" }>["data"]
  ) => void;
}

export const useFileUploadAction = ({
  onShowFileUpload,
  addOrUpdateArtifact,
}: UseFileUploadActionProps) => {
  const fileTypes = validExtensions.join(", ");

  useCopilotAction({
    name: "show_file_upload_zone",
    description: FILE_UPLOAD_DESCRIPTION.fileUpload(fileTypes, maxFileSize),
    parameters: [
      {
        name: "message",
        type: "string",
        description:
          "Custom message to display with the upload instruction (optional)",
        required: false,
      },
    ],
    handler: async (args) => {
      try {
        const { message } = args;
        const customMessage =
          message || "I've activated the file upload interface for you!";

        // Trigger the existing drag-and-drop overlay
        onShowFileUpload?.();
        addOrUpdateArtifact("fileUpload", {
          message: customMessage,
        });

        return `${customMessage}
  
  🎯 **File Upload Ready!** You can now:
  
  📁 **Drag & Drop:** Simply drag files from your file browser into this chat area
  🖱️ **Upload Interface:** The beautiful upload overlay will appear when you start dragging
  📋 **Multiple Files:** Upload several files at once for bulk analysis
  
  **Supported formats:**
  - **Code files:** ${validCodeFiles.join(", ")}
  - **Documents:** ${validDocFiles.join(", ")}  
  - **Web files:** ${validWebFiles.join(", ")}
  
  **File size limit:** Up to ${maxFileSize}MB per file
  **Total supported extensions:** ${validExtensions.length} file types
  
  Once uploaded, I'll automatically have access to your files and can help you analyze, debug, refactor, or work with them in any way you need!
  
  *💡 Tip: You can also just start dragging files from your file browser - the upload zone will appear automatically!*`;
      } catch (error) {
        console.error("Error in show_file_upload_zone handler:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        return `Failed to activate file upload interface: ${errorMessage}. You can still drag files directly into this chat area to upload them! Supported file types: ${validExtensions.join(", ")} (max ${maxFileSize}MB each)`;
      }
    },
  });
};
