import { useEffect, useState } from "react";
import { FileUploadError } from "./types";
import { maxFileSize, validExtensions } from "./file-upload.constant";

interface UseDragAndDropProps {
  enableDragDrop: boolean;
  onFileSelection?: (files: FileList) => void;
  onFileError?: (error: FileUploadError) => void;
}

export const useDragAndDrop = ({
  enableDragDrop,
  onFileSelection,
  onFileError,
}: UseDragAndDropProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Simplified global drag detection
  useEffect(() => {
    if (!enableDragDrop) return;

    let dragCounter = 0; // ← Local variable, no state

    const handleDocumentDragEnter = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes("Files")) {
        e.preventDefault();
        dragCounter++;
        setIsDragOver(true);
      }
    };

    const handleDocumentDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes("Files")) {
        e.preventDefault();
      }
    };

    const handleDocumentDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setIsDragOver(false);
    };

    const handleDocumentDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;

      // Only hide when we've left all nested elements OR left the window
      if (dragCounter <= 0 || !e.relatedTarget) {
        dragCounter = 0; // Ensure it doesn't go negative
        setIsDragOver(false);
      }
    };

    document.addEventListener("dragenter", handleDocumentDragEnter);
    document.addEventListener("dragover", handleDocumentDragOver);
    document.addEventListener("drop", handleDocumentDrop);
    document.addEventListener("dragleave", handleDocumentDragLeave);

    return () => {
      document.removeEventListener("dragenter", handleDocumentDragEnter);
      document.removeEventListener("dragover", handleDocumentDragOver);
      document.removeEventListener("drop", handleDocumentDrop);
      document.removeEventListener("dragleave", handleDocumentDragLeave);
    };
  }, [enableDragDrop]);

  // File validation
  const validateFile = (file: File): FileUploadError | null => {
    const isValidType = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );
    if (!isValidType) {
      return {
        type: "FILE_TYPE",
        message: `File type not supported: ${file.name}`,
        fileName: file.name,
        details: { supportedTypes: validExtensions },
      };
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      return {
        type: "FILE_SIZE",
        message: `File too large: ${file.name} (${fileSizeMB.toFixed(1)}MB). Max size: ${maxFileSize}MB`,
        fileName: file.name,
        details: { actualSize: fileSizeMB, maxSize: maxFileSize },
      };
    }

    return null;
  };

  // Enhanced file processing
  const handleFiles = async (fileList: FileList) => {
    if (!onFileSelection) return;

    setIsProcessing(true);

    try {
      const files = Array.from(fileList);
      const validFiles: File[] = [];
      const errors: FileUploadError[] = [];

      for (const file of files) {
        const error = validateFile(file);
        if (error) {
          errors.push(error);
        } else {
          validFiles.push(file);
        }
      }

      for (const error of errors) {
        onFileError?.(error);
      }

      if (validFiles.length > 0) {
        try {
          const dataTransfer = new DataTransfer();
          validFiles.forEach((file) => dataTransfer.items.add(file));
          onFileSelection(dataTransfer.files);
        } catch (error) {
          onFileError?.({
            type: "UPLOAD_ERROR",
            message: `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
            details: error,
          });
        }
      }
    } catch (error) {
      onFileError?.({
        type: "UPLOAD_ERROR",
        message: `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        details: error,
      });
    } finally {
      setIsProcessing(false);
      setIsDragOver(false);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await handleFiles(files);
    }
  };

  return {
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    isDragOver,
    isProcessing,
  };
};
