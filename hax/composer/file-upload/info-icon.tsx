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
