import {
  maxFileSize,
  validCodeFiles,
  validDocFiles,
  validWebFiles,
} from "./file-upload.constant";
import { Info } from "lucide-react";
import React from "react";

export const InfoIcon = ({ className }: { className?: string }) => {
  return (
    <span
      className={`inline-flex h-6 w-6 cursor-default items-center justify-center rounded-full border border-blue-200 bg-blue-50 transition-colors hover:bg-blue-100 ${className}`}
      title={`Supported File Types:

Code Files: ${validCodeFiles.join(", ")}
Documents: ${validDocFiles.join(", ")}  
Web Files: ${validWebFiles.join(", ")}

Max Size: ${maxFileSize}MB per file`}
    >
      <Info className="h-4 w-4 stroke-[2.5] text-[#187ADC]" />
    </span>
  );
};
