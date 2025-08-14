import { useState, useEffect, useRef } from "react";
import { useCopilotReadable } from "@copilotkit/react-core";

export interface LocalContextItem {
  type: "file" | "browse";
  name: string;
  path: string;
  content?: string; // For browsed files
}

export function useLocalContext() {
  const [localContext, setLocalContext] = useState<LocalContextItem[]>([]);
  const [selectedContextItems, setSelectedContextItems] = useState<
    LocalContextItem[]
  >([]);
  const [isBrowsingFiles, setIsBrowsingFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadedFilesContext = selectedContextItems
    .filter((item) => item.content && item.type === "file")
    .map((file) => ({
      name: file.name,
      path: file.path,
      content: file.content,
    }));

  useCopilotReadable(
    {
      description: "Files uploaded by the user for context and analysis.",
      value: uploadedFilesContext,
      available: uploadedFilesContext.length > 0 ? "enabled" : "disabled",
    },
    [selectedContextItems]
  );

  // Initialize local context with only browse files option
  useEffect(() => {
    const browseOption: LocalContextItem = {
      type: "browse",
      name: "Browse Files",
      path: "browse://files",
    };
    setLocalContext([browseOption]);
  }, []);

  const handleFileSelection = async (files: FileList) => {
    try {
      const filePromises = Array.from(files).map(async (file) => {
        const content = await file.text();
        const sizeLimit = 1024 * 50; // 50KB
        if (content.length > sizeLimit) {
          console.warn(
            `File ${file.name} exceeds size limit of ${sizeLimit} bytes, content will be truncated`
          );
        }
        return {
          type: "file" as const,
          name: file.name,
          path: file.name,
          content: content.slice(0, sizeLimit), // Limit content size
        };
      });

      const processedFiles = await Promise.all(filePromises);
      setSelectedContextItems((prev) => [...prev, ...processedFiles]);
      console.log(
        "Files processed and added:",
        processedFiles.map((f) => f.name)
      );
    } catch (error) {
      console.error("Error processing files:", error);
    } finally {
      setIsBrowsingFiles(false);
    }
  };

  const triggerFileBrowser = () => {
    if (isBrowsingFiles) {
      console.log("File browsing already in progress, ignoring trigger");
      return;
    }

    setIsBrowsingFiles(true);
    // Small delay to ensure dropdown is closed first
    setTimeout(() => {
      if (fileInputRef.current) {
        console.log("Triggering file browser");
        fileInputRef.current.click();
      } else {
        setIsBrowsingFiles(false);
      }
    }, 50);
  };

  const removeContextItem = (item: LocalContextItem) => {
    setSelectedContextItems((prev) =>
      prev.filter((ctx) => ctx.path !== item.path)
    );
  };

  return {
    localContext,
    selectedContextItems,
    isBrowsingFiles,
    fileInputRef,
    handleFileSelection,
    triggerFileBrowser,
    removeContextItem,
    setIsBrowsingFiles,
  };
}
