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

import { Upload, X } from "lucide-react";
import React from "react";
import { InfoIcon } from "./info-icon";
import { DragAndDropType } from "./types";

export const DragAndDropZone = ({
  isDragOver,
  handleDragEnter,
  handleDragLeave,
  handleDragOver,
  handleDrop,
  handleCloseUploadZone,
  isProcessing,
  dragAndDropType,
  fileInputRef,
}: {
  isDragOver: boolean;
  handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleCloseUploadZone: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isProcessing: boolean;
  dragAndDropType: DragAndDropType;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}) => {
  const handleClick = () => {
    fileInputRef?.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative w-full cursor-pointer rounded-lg border-2 border-dashed border-[#187ADC]/30 bg-[#187ADC]/5 transition-all duration-300 ${
          isDragOver ? "shadow-lg" : ""
        }`}
        role="button"
        tabIndex={0}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {/* Close button - only show for programmatic display */}
        {dragAndDropType === DragAndDropType.DropToZone && !isDragOver && (
          <button
            className="absolute top-2 right-2 z-10 cursor-pointer rounded-full bg-white p-1.5 text-xs shadow-md transition-colors hover:bg-gray-50"
            style={{ fontSize: "0px" }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCloseUploadZone(e);
            }}
          >
            <X className="h-3 w-3 text-gray-600" />
          </button>
        )}

        <div className="p-3">
          {isProcessing ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#187ADC] border-t-transparent"></div>
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-800">
                  Processing Files...
                </h3>
                <p className="text-xs text-gray-600">
                  Please wait while we validate your files
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              {/* Upload icon with animation */}
              <div className="relative">
                <div
                  className={`absolute inset-0 animate-pulse rounded-full`}
                ></div>
                <div
                  className={`relative flex h-12 w-12 items-center justify-center rounded-full bg-[#187ADC]/10`}
                >
                  <Upload className="h-6 w-6 animate-bounce text-white" />
                </div>
              </div>

              {/* Title and description */}
              <div className="text-center">
                <h3
                  className={`text-lg font-bold ${
                    isDragOver ? "" : "text-[#187ADC]"
                  }`}
                >
                  {isDragOver
                    ? "Release to upload your files"
                    : dragAndDropType === DragAndDropType.DropToZone
                      ? "Drag files from your file browser into this area"
                      : "Add files to your conversation context"}
                  <InfoIcon className="ml-2" />
                </h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
