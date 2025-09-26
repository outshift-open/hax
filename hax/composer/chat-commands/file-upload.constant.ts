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
