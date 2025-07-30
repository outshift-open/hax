import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// Load .env files silently by capturing and suppressing output
// This prevents cluttering the console with dotenv debug messages
const originalConsoleLog = console.log
console.log = () => {}
dotenv.config({ debug: false })
dotenv.config({ path: path.join(__dirname, "../../.env"), debug: false })
console.log = originalConsoleLog

export const ENV_CONFIG = {
  registrySource:
    // process.env.HAX_REGISTRY_SOURCE || "github:component-integration",
    process.env.HAX_REGISTRY_SOURCE || "local",

  github: {
    repo: process.env.HAX_GITHUB_REPO || "cisco-eti/agntcy-hax",
    defaultBranch: process.env.HAX_GITHUB_DEFAULT_BRANCH || "main",
    token: process.env.HAX_GITHUB_TOKEN || "",
  },
  cdn: {
    baseUrl: process.env.HAX_CDN_BASE_URL || "",
  },
  devMode: process.env.HAX_DEV_MODE === "true",
} as const

if (process.env.HAX_DEBUG_CONFIG === "true") {
  console.log("ENV_CONFIG:", ENV_CONFIG)
  console.log("HAX_REGISTRY_SOURCE env var:", process.env.HAX_REGISTRY_SOURCE)
}
