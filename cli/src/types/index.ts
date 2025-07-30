import { z } from "zod"

export const FileExtensionSchema = z.enum([
  ".tsx",
  ".ts",
  ".jsx",
  ".js",
  ".vue",
])
export type FileExtension = z.infer<typeof FileExtensionSchema>

export const FILE_EXTENSIONS = {
  TYPESCRIPT: [".tsx", ".ts"] as const,
  JAVASCRIPT: [".jsx", ".js"] as const,
  OTHER: [".vue"] as const,
} as const

export const RegistryFileTypeSchema = z.enum([
  "registry:component",
  "registry:types",
  "registry:hook",
  "registry:index",
])
export type RegistryFileType = z.infer<typeof RegistryFileTypeSchema>

export const RegistryItemTypeSchema = z.enum([
  "registry:artifacts",
  "registry:ui",
  "registry:lib",
])
export type RegistryItemType = z.infer<typeof RegistryItemTypeSchema>

export const RegistryFileSchema = z.object({
  path: z.string(),
  type: z.string(),
  content: z.string().optional(),
})

export const RegistryItemSchema = z.object({
  name: z.string(),
  type: RegistryItemTypeSchema,
  dependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(RegistryFileSchema),
})

export const RegistryIndexSchema = z.array(
  z.object({
    name: z.string(),
    type: z.string(),
  }),
)

export type RegistryFile = z.infer<typeof RegistryFileSchema>
export type RegistryItem = z.infer<typeof RegistryItemSchema>
export type RegistryIndex = z.infer<typeof RegistryIndexSchema>

export const CompilerOptionsSchema = z
  .object({
    baseUrl: z.string().optional(),
    paths: z.record(z.string(), z.array(z.string())).optional(),
  })
  .catchall(z.unknown())

export const ProjectConfigSchema = z
  .object({
    compilerOptions: CompilerOptionsSchema.optional(),
  })
  .catchall(z.unknown())

export type CompilerOptions = z.infer<typeof CompilerOptionsSchema>
export type ProjectConfig = z.infer<typeof ProjectConfigSchema>

export const HaxConfigSchema = z.object({
  $schema: z.string().optional(),
  style: z.string(),
  artifacts: z.object({
    path: z.string(),
  }),
  zones: z.object({
    path: z.string(),
  }),
  messages: z.object({
    path: z.string(),
  }),
  prompts: z.object({
    path: z.string(),
  }),
  components: z.array(z.string()).optional(),
  backend_framework: z.string().optional(),
  frontend_framework: z.string().optional(),
})

export type HaxConfig = z.infer<typeof HaxConfigSchema>

export const CONFIG_FILE = "hax.json"

export const DIRECTORIES = {
  UI_COMPONENTS: "src/components/ui",
  LIB: "src/lib",
  BACKEND_TOOLS: "backend/tools",
} as const

export const REGISTRY_FILE_TYPES = {
  COMPONENT: "registry:component",
  TYPES: "registry:types",
  HOOK: "registry:hook",
  INDEX: "registry:index",
} as const

export const REGISTRY_ITEM_TYPES = {
  ARTIFACTS: "registry:artifacts",
  UI: "registry:ui",
  LIB: "registry:lib",
} as const

export const IMPORT_PATTERNS = {
  UTILS_RELATIVE: /from ["']\.\.\/lib\/utils["']/g,
  UTILS_ALIAS: 'from "@/lib/utils"',
} as const

export const REGISTRY_SOURCES = {
  LOCAL: "file://",
  NPM: "",
  GITHUB: (branch: string) =>
    `https://raw.githubusercontent.com/cisco-eti/agntcy-hax/${branch}/registry/`,
  CDN: "",
} as const
