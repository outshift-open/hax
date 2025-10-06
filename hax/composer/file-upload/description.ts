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

export const FILE_UPLOAD_DESCRIPTION = {
  fileUpload: (fileTypes: string, maxFileSize: number) =>
    `Use this action to activate the file upload interface when users request file uploads or attachments. This displays a drag-and-drop overlay for uploading code files, documents, and text files.

### When to Use This Action

Use this action when users:
- Request to upload files or attachments
- Want to share code, documents, or data files
- Ask to add files to the conversation context
- Need to provide files for analysis or processing

### Technical Specifications

- **Supported file types:** ${fileTypes}
- **Maximum file size:** ${maxFileSize}MB per file
- **Interface features:** Drag-and-drop support, file validation, error handling, upload progress feedback

### Example User Requests

- "I want to upload a file"
- "Can I attach my code?"
- "Let me share this document"
- "Add this file to context" 
- "Help me analyze this file"
- "Upload my configuration"
- "Share my logs/data"`,
} as const;
