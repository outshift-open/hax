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

export const filePickerInputId = "file-picker-input";
export const maxFileSize = 10; // in MB

export const validCodeFiles = [
  ".js",
  ".ts",
  ".jsx",
  ".tsx",
  ".py",
  ".java",
  ".cpp",
  ".cs",
  ".go",
  ".rs",
];

export const validDocFiles = [
  ".doc",
  ".docx",
  ".txt",
  ".md",
  ".json",
  ".xml",
  ".yaml",
  ".yml",
];

export const validWebFiles = [".html", ".css", ".php", ".rb"];

export const validExtensions = [
  ...validCodeFiles,
  ...validDocFiles,
  ...validWebFiles,
];
