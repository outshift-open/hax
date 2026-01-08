# Inline Rationale Component

A React component for displaying AI-driven assessments, decisions, and explanations with intent-based visual theming. Ideal for security assessments, code reviews, policy decisions, and any AI-generated rationale that needs clear visual distinction.

## Installation

### Prerequisites

- React 18+
- Tailwind CSS configured in your project
- HAX CLI installed globally

### Initialize HAX in Your Project

```bash
hax init
```

This sets up the necessary configuration and dependencies in your project.

### Add the Inline Rationale Component

```bash
hax add artifact inline-rationale
```

This command will:
- Install the component files to your project
- Add required dependencies (`zod`, `@copilotkit/react-core`)
- Set up the `cn` utility if not already present

## Usage

### Basic Usage

```tsx
import { InlineRationale } from "@/artifacts/inline-rationale"

function App() {
  return (
    <InlineRationale
      id="security-assessment-1"
      assessmentType="security_assessment"
      intent="block"
      title="SQL Injection Vulnerability Detected"
      description="A critical SQL injection vulnerability was found in the user input handling code."
      summary={{
        impact: "critical",
        exploitability: "high",
        tags: ["OWASP Top 10", "CWE-89"]
      }}
      rationale={[
        { label: "Location", value: "src/api/users.ts:45" },
        { label: "Risk", value: "Allows attackers to execute arbitrary SQL queries" },
        { label: "Recommendation", value: "Use parameterized queries instead of string concatenation" }
      ]}
      confidence={95}
    />
  )
}
```

### HAX Wrapper Component

Use `HAXInlineRationale` for a pre-styled wrapper with margin:

```tsx
import { HAXInlineRationale } from "@/artifacts/inline-rationale"

function App() {
  return (
    <HAXInlineRationale
      assessmentType="code_review"
      intent="approve"
      title="Code Review Passed"
      description="The submitted code meets all quality standards."
      summary={{
        impact: "low",
        exploitability: "none",
        tags: ["Reviewed", "v2.4.0"]
      }}
      rationale={[
        { label: "Test Coverage", value: "92%" },
        { label: "Code Quality", value: "No issues detected" }
      ]}
      confidence={88}
    />
  )
}
```

### Collapsible Content

Enable collapse/expand functionality:

```tsx
<InlineRationale
  id="collapsible-rationale"
  assessmentType="policy_decision"
  intent="warn"
  title="Access Request Pending Review"
  description="Manual review required for elevated permissions."
  summary={{
    impact: "medium",
    exploitability: "low"
  }}
  rationale={[
    { label: "Requester", value: "john.doe@company.com" },
    { label: "Resource", value: "Production Database" }
  ]}
  confidence={75}
  collapsible={true}
  collapsed={false}
  onCollapseChange={(collapsed) => console.log("Collapsed:", collapsed)}
/>
```

### CopilotKit Integration

Use the action hook for AI-driven rationale creation:

```tsx
import { useInlineRationaleAction } from "@/artifacts/inline-rationale"

function ChatComponent() {
  const [artifacts, setArtifacts] = useState([])

  useInlineRationaleAction({
    addOrUpdateArtifact: (type, data) => {
      setArtifacts(prev => [...prev, { type, data, id: Date.now() }])
    }
  })

  return (
    // Your chat UI that renders artifacts
  )
}
```

## Props

### InlineRationaleProps

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `id` | `string` | Yes | - | Unique identifier |
| `assessmentType` | `string` | Yes | - | Type of assessment (e.g., "security_assessment", "code_review") |
| `intent` | `Intent` | Yes | - | Visual theme: "warn", "approve", "block", "inform" |
| `title` | `string` | Yes | - | Display title |
| `description` | `string` | Yes | - | Main description paragraph |
| `summary` | `AssessmentSummary` | Yes | - | Summary with impact and exploitability |
| `rationale` | `RationaleItem[]` | Yes | - | Detail items as label/value pairs |
| `confidence` | `number` | Yes | - | Confidence score (0-100) |
| `metadata` | `Metadata` | No | - | Optional tracking metadata |
| `collapsed` | `boolean` | No | `false` | Initial collapsed state |
| `collapsible` | `boolean` | No | `false` | Enable collapse toggle |
| `onCollapseChange` | `(collapsed: boolean) => void` | No | - | Collapse change callback |
| `className` | `string` | No | - | Additional CSS classes |

## Types

### Intent

```typescript
type Intent = "warn" | "approve" | "block" | "inform"
```

Visual themes:
- `block` (red): Security vulnerabilities, access denials, critical issues
- `warn` (yellow): Performance issues, warnings that need attention
- `approve` (green): Approvals, successful validations
- `inform` (blue): General information, neutral notifications

### ImpactLevel

```typescript
type ImpactLevel = "low" | "medium" | "high" | "critical"
```

### ExploitabilityLevel

```typescript
type ExploitabilityLevel = "none" | "low" | "medium" | "high"
```

### AssessmentSummary

```typescript
interface AssessmentSummary {
  impact: ImpactLevel
  exploitability: ExploitabilityLevel
  tags?: string[]
}
```

### RationaleItem

```typescript
interface RationaleItem {
  label: string
  value: string
}
```

### Metadata

```typescript
interface Metadata {
  generated_by: "ai" | "human" | "hybrid"
  model?: string
  version?: string
  timestamp?: string
}
```

## Files

| File | Description |
|------|-------------|
| `inline-rationale.tsx` | Main React component with `InlineRationale` and `HAXInlineRationale` |
| `types.ts` | Zod schemas and TypeScript type definitions |
| `action.ts` | CopilotKit integration hook (`useInlineRationaleAction`) |
| `description.ts` | AI prompt guidance constant |
| `index.ts` | Module exports |
