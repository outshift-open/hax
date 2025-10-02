/*
 * Copyright 2025 Cisco Systems, Inc. and its affiliates
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FileUploadError } from "./types";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import { filePickerInputId, validExtensions } from "./file-upload.constant";

interface FilePickerInputProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isBrowsingFiles: boolean;
  onFileSelection: (files: FileList) => void;
  onBrowsingStateChange: (browsing: boolean) => void;
  dragAndDropEnabled?: boolean;
  multiple?: boolean;
  onError?: (error: FileUploadError) => void;
  maxFileSize?: number;
}

export function FilePickerInput({
  dragAndDropEnabled = false,
  fileInputRef,
  isBrowsingFiles,
  multiple = true,
  onBrowsingStateChange,
  onError,
  onFileSelection,
}: FilePickerInputProps) {
  const {
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    isDragOver,
    isProcessing,
  } = useDragAndDrop({
    enableDragDrop: dragAndDropEnabled,
    onFileSelection,
    onFileError: onError,
  });

  // Handle file picker cancellation by detecting window focus
  useEffect(() => {
    const handleWindowFocus = () => {
      if (isBrowsingFiles) {
        // Check if file input still has files selected after a short delay
        setTimeout(() => {
          if (fileInputRef.current && !fileInputRef.current.files?.length) {
            console.log(
              "File picker appears to have been cancelled (window focus detected)"
            );
            onBrowsingStateChange(false);
          }
        }, 200);
      }
    };

    window.addEventListener("focus", handleWindowFocus);
    return () => window.removeEventListener("focus", handleWindowFocus);
  }, [isBrowsingFiles, fileInputRef, onBrowsingStateChange]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    console.log("fileInputRef", fileInputRef.current);
  }, [fileInputRef]);

  return (
    <>
      <Input
        id={filePickerInputId}
        ref={fileInputRef as React.RefObject<HTMLInputElement>}
        type="file"
        multiple={multiple}
        accept={validExtensions.join(",")}
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onFileSelection(e.target.files);
          } else {
            // User cancelled file selection
            onBrowsingStateChange(false);
          }
          // Reset input value so same file can be selected again
          e.target.value = "";
        }}
      />

      {isProcessing && (
        <div className="absolute top-0 left-0 h-full w-full rounded-lg">
          <LoadingSpinner contained />
        </div>
      )}

      {dragAndDropEnabled && !isProcessing && (
        <div
          className={`absolute top-0 left-0 h-full w-full rounded-lg transition-all duration-200 ${
            // Show drag overlay when files are being dragged over
            isDragOver
              ? "pointer-events-auto border-2 border-dashed border-blue-500 bg-blue-50/80"
              : "pointer-events-none bg-transparent"
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={dragAndDropEnabled ? undefined : handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleClick();
            }
          }}
        />
      )}
    </>
  );
}
