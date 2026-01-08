# Capability Manifest Artifact

A component for displaying AI agent capabilities, constraints, and connection status. This artifact helps set user expectations about what an AI agent can and cannot do, preventing the "Mental Model Mismatch" where users assume the agent has capabilities it doesn't possess.

## Installation

Install using the HAX CLI:

```bash
hax add artifact capability-manifest
```

This will:
1. Copy the component files to your `src/hax/artifacts/capability-manifest/` directory
2. Install required dependencies (`lucide-react`, `zod`)
3. Configure path aliases in your TypeScript/JavaScript config

## Usage

### Basic Usage

```tsx
import { HAXCapabilityManifest } from "@/hax/artifacts/capability-manifest";

function AgentHandshake() {
  return (
    <HAXCapabilityManifest
      data={{
        agentName: "Data Analyst",
        agentRole: "Agent",
        statusText: "Capability handshake initiated • Ready for interaction",
        capabilities: [
          { id: "1", name: "Access SQL Database", status: "enabled" },
          { id: "2", name: "Visualize Data", status: "enabled" },
          { id: "3", name: "Read Analytics Report", status: "enabled" },
        ],
        alerts: [
          {
            id: "1",
            title: "Runtime Constraints",
            description: "Requires approval for external API calls.",
            variant: "warning",
          },
        ],
        connectionStatus: "connected",
        connectionLabel: "Handshake Complete",
        sessionId: "HAX-2024-DA-001",
      }}
    />
  );
}
```

### Using the CopilotKit Action Hook

The artifact includes a CopilotKit action hook for AI agents to dynamically create capability manifests:

```tsx
import { useCapabilityManifestAction } from "@/hax/artifacts/capability-manifest";

function MyApp() {
  const addOrUpdateArtifact = (type, data) => {
    // Handle artifact creation/update
    console.log("Creating artifact:", type, data);
  };

  useCapabilityManifestAction({ addOrUpdateArtifact });

  return <div>Your app content</div>;
}
```

## Schema

### CapabilityManifestData

The main data structure for the component:

```typescript
interface CapabilityManifestData {
  // Agent Header
  agentName?: string;           // Name of the AI agent
  agentRole?: string;           // Role or type (e.g., "Agent", "AI")
  statusText?: string;          // Status message below agent name
  agentTags?: AgentTag[];       // Tags/badges to display

  // Capabilities
  capabilities?: Capability[];           // List of capabilities (flat list)
  capabilityGroups?: CapabilityGroup[];  // Grouped capabilities
  capabilitiesLabel?: string;            // Section label (default: "Capabilities")
  showCapabilities?: boolean;            // Show/hide section (default: true)

  // Alerts
  alerts?: Alert[];             // Array of alerts to display

  // Status
  connectionStatus?: ConnectionStatus;   // Connection state
  connectionLabel?: string;              // Custom status label
  sessionId?: string;                    // Session identifier
  statusMetadata?: Record<string, string | number>;  // Additional metadata

  // Customization
  showSeparator?: boolean;      // Show separator line (default: true)
  showStatus?: boolean;         // Show status footer (default: true)

  // Styling
  variant?: "default" | "outline" | "ghost";   // Card style
  size?: "sm" | "md" | "lg";                   // Size variant
  showShadow?: boolean;                        // Show card shadow (default: true)
}
```

### Capability

```typescript
interface Capability {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  description?: string;          // Description of the capability
  status: CapabilityStatus;      // "enabled" | "disabled" | "pending" | "error"
  iconColor?: string;            // Custom icon color
  metadata?: Record<string, string | number | boolean>;  // Additional info
}
```

### Alert

```typescript
interface Alert {
  id: string;                    // Unique identifier
  title: string;                 // Alert title
  description: string;           // Alert message
  variant: AlertVariant;         // "warning" | "error" | "info" | "success"
  dismissible?: boolean;         // Allow dismissal
}
```

### CapabilityGroup

```typescript
interface CapabilityGroup {
  id: string;                    // Unique identifier
  label: string;                 // Group label/title
  capabilities: Capability[];    // Capabilities in this group
  collapsible?: boolean;         // Allow collapse/expand
  defaultCollapsed?: boolean;    // Initially collapsed
}
```

### Status Types

```typescript
type CapabilityStatus = "enabled" | "disabled" | "pending" | "error";
type AlertVariant = "warning" | "error" | "info" | "success";
type ConnectionStatus = "connected" | "connecting" | "disconnected" | "error";
```

## Action Parameters

When using the CopilotKit action hook, the AI can call `create_capability_manifest` with these parameters:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `agentName` | string | Yes | Name of the AI agent |
| `agentRole` | string | No | Role or type of the agent |
| `statusText` | string | No | Status message displayed below name |
| `agentTagsJson` | string | No | JSON array of tags |
| `capabilitiesJson` | string | No | JSON array of capabilities |
| `capabilityGroupsJson` | string | No | JSON array of capability groups |
| `capabilitiesLabel` | string | No | Label for capabilities section |
| `showCapabilities` | boolean | No | Show/hide capabilities |
| `alertsJson` | string | No | JSON array of alerts |
| `connectionStatus` | string | No | Connection status |
| `connectionLabel` | string | No | Custom status label |
| `sessionId` | string | No | Session identifier |
| `statusMetadataJson` | string | No | JSON object of status metadata |
| `showSeparator` | boolean | No | Show separator line |
| `showStatus` | boolean | No | Show status footer |
| `variant` | string | No | Card style variant |
| `size` | string | No | Size variant |
| `showShadow` | boolean | No | Show card shadow |

## Examples

### With Capability Groups

```tsx
<HAXCapabilityManifest
  data={{
    agentName: "Full Stack Agent",
    statusText: "Ready for development tasks",
    capabilityGroups: [
      {
        id: "frontend",
        label: "Frontend Capabilities",
        collapsible: true,
        capabilities: [
          { id: "1", name: "React Development", status: "enabled" },
          { id: "2", name: "CSS Styling", status: "enabled" },
        ],
      },
      {
        id: "backend",
        label: "Backend Capabilities",
        collapsible: true,
        capabilities: [
          { id: "3", name: "Node.js API", status: "enabled" },
          { id: "4", name: "Database Design", status: "pending" },
        ],
      },
    ],
    connectionStatus: "connected",
  }}
/>
```

### With Multiple Alerts

```tsx
<HAXCapabilityManifest
  data={{
    agentName: "System Monitor",
    capabilities: [
      { id: "1", name: "CPU Monitoring", status: "enabled" },
    ],
    alerts: [
      {
        id: "1",
        title: "High Memory Usage",
        description: "Memory usage is above 85%.",
        variant: "warning",
      },
      {
        id: "2",
        title: "Connection Restored",
        description: "Database connection restored successfully.",
        variant: "success",
      },
    ],
    connectionStatus: "connected",
  }}
/>
```

### Different Styling Variants

```tsx
// Outline variant
<HAXCapabilityManifest
  data={{
    agentName: "Outlined Agent",
    variant: "outline",
    // ...
  }}
/>

// Ghost variant (transparent)
<HAXCapabilityManifest
  data={{
    agentName: "Ghost Agent",
    variant: "ghost",
    // ...
  }}
/>

// Small size
<HAXCapabilityManifest
  data={{
    agentName: "Compact Agent",
    size: "sm",
    // ...
  }}
/>
```

### With Event Handlers

```tsx
<HAXCapabilityManifest
  data={{
    agentName: "Interactive Agent",
    capabilities: [
      { id: "1", name: "Feature 1", status: "enabled" },
    ],
    alerts: [
      { id: "1", title: "Notice", description: "...", variant: "info", dismissible: true },
    ],
    connectionStatus: "connected",
  }}
  onCapabilityClick={(cap) => console.log("Clicked:", cap.name)}
  onAlertDismiss={(alert) => console.log("Dismissed:", alert.title)}
  onStatusClick={() => console.log("Status clicked")}
/>
```

## Best Practices

1. **Display at Session Start**: Show the capability manifest during agent initialization (Phase 1) before user interaction begins.

2. **Keep Capability Names Concise**: Use clear, descriptive names that users can quickly understand.

3. **Use Alerts Sparingly**: Only include alerts for important constraints or warnings that affect user expectations.

4. **Include Session ID**: Add session identifiers for debugging and tracking purposes.

5. **Group Related Capabilities**: When there are many capabilities, use `capabilityGroups` to organize them logically.

6. **Set Appropriate Status**: Reflect the actual agent state with the correct connection status.

## File Structure

```
capability-manifest/
├── capability-manifest.tsx  # Main React component
├── action.ts               # CopilotKit action hook
├── types.ts                # TypeScript definitions & Zod schemas
├── description.ts          # AI agent instructions
├── index.ts                # Exports
└── README.md               # This file
```

## Dependencies

- `react` >= 18.0.0
- `lucide-react` - Icons
- `zod` - Schema validation
- `@copilotkit/react-core` - CopilotKit integration

## License

Apache License 2.0 - See [LICENSE](../../../LICENSE) for details.
