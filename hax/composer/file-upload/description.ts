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
