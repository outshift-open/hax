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
  "registry:description",
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
  source: z.string().optional(),
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

// GitHub registry metadata types
export interface GitHubRegistryMetadata {
  [componentName: string]: {
    type: RegistryItemType
    dependencies: string[]
    registryDependencies: string[]
    files: Array<{
      name: string
      type: RegistryFileType
      path?: string
    }>
  }
}

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
  zones: z
    .object({
      path: z.string(),
    })
    .optional(),
  messages: z
    .object({
      path: z.string(),
    })
    .optional(),
  prompts: z
    .object({
      path: z.string(),
    })
    .optional(),
  registries: z
    .object({
      default: z.string(),
      fallback: z.array(z.string()),
      sources: z.record(
        z.string(),
        z.object({
          type: z.enum(["github", "local", "npm"]),
          repo: z.string().optional(),
          branch: z.string().optional(),
          token: z.string().optional(),
          name: z.string(),
        }),
      ),
    })
    .optional(),
  components: z
    .array(
      z.union([
        z.string(),
        z.object({
          name: z.string(),
          source: z.string(),
          version: z.string().optional(),
          installedAt: z.string().optional(),
        }),
      ]),
    )
    .optional(),
  backend_framework: z.string().optional(),
  frontend_framework: z.string().optional(),
})

export type HaxConfig = z.infer<typeof HaxConfigSchema>

export const CONFIG_FILE = "hax.json"

export const DIRECTORIES = {
  UI_COMPONENTS: "src/components/ui",
  COMPONENTS: "src/components",
  LIB: "src/lib",
  BACKEND_TOOLS: "backend/tools",
} as const

export const REGISTRY_FILE_TYPES = {
  COMPONENT: "registry:component",
  TYPES: "registry:types",
  HOOK: "registry:hook",
  INDEX: "registry:index",
  DESCRIPTION: "registry:description",
} as const

export interface RegistrySource {
  type: "github" | "local" | "npm"
  repo?: string
  branch?: string
  token?: string
  githubUrl?: string
  name: string
}

export interface RegistryConfig {
  default: string
  fallback: string[]
  sources: Record<string, RegistrySource>
}

export const REGISTRY_SOURCES = {
  GITHUB: (repo: string, branch: string, githubUrl?: string) => {
    const baseGitHubUrl = githubUrl || "https://github.com"
    const rawUrl = baseGitHubUrl.replace(
      "github.com",
      "raw.githubusercontent.com",
    )
    return `${rawUrl}/${repo}/${branch}/`
  },
  LOCAL: "file://",
  NPM: "",
  CDN: "",
} as const
