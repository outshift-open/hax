import { useCopilotAction } from "@copilotkit/react-core";
import { ArtifactTab } from "./types";
import { MINDMAP_DESCRIPTION } from "./description";

interface UseMindmapActionProps {
  addOrUpdateArtifact: (
    type: "mindmap",
    data: Extract<ArtifactTab, { type: "mindmap" }>["data"]
  ) => void;
}

export const useMindmapAction = ({
  addOrUpdateArtifact,
}: UseMindmapActionProps) => {
  useCopilotAction(
    {
      name: "create_mindmap",
      description: MINDMAP_DESCRIPTION,
      available: "enabled",
      parameters: [
        {
          name: "title",
          type: "string",
          description: "The main title of the mindmap",
          required: true,
        },
        {
          name: "nodesJson",
          type: "string",
          description:
            "JSON string containing array of nodes with {id, label, x?, y?}",
          required: true,
        },
        {
          name: "connectionsJson",
          type: "string",
          description:
            "JSON string containing array of connections with {from, to}",
          required: false,
        },
        {
          name: "layoutAlgorithm",
          type: "string",
          description: `ELK layout algorithm:
            'layered' (hierarchical): Arranges as many edges as possible into one direction by placing nodes into subsequent layers.
            'force' (force-directed): Implements methods that follow physical analogies by simulating forces that move the nodes into a balanced distribution.
            'stress' (stress minimization): Minimizes the stress within a layout using stress majorization.
            'mrtree' (minimum spanning tree): Computes a spanning tree of the input graph and arranges all nodes according to the resulting parent-children hierarchy.
            'radial' (radial tree): The radial layouter takes a tree and places the nodes in radial order around the root.
            'disco' (disconnected components): Layouter for arranging unconnected subgraphs. The subgraphs themselves are, by default, not laid out.
            'box' (box): Algorithm for packing of unconnected boxes, i.e. graphs without edges.
            Default: 'layered'`,
          required: false,
        },
        {
          name: "layoutOptions",
          type: "string",
          description: `JSON string of ELK layout options. Available options:
            "elk.direction": Overall direction of edges, Possible Values: DOWN, UP, RIGHT, UP
            "elk.spacing.nodeNode": The minimal distance to be preserved between each two nodes. Default value: 80
            "elk.layered.spacing.nodeNodeBetweenLayers: The spacing to be preserved between any pair of nodes of two adjacent layers. Default value: 100
            "elk.zoomToFit": Whether the zoom level shall be set to view the whole diagram after layout. Default value: 'true'`,
          required: false,
        },
      ],
      render: ({ status, args }) => {
        console.log("rendering", status, args);
        if (status === "inProgress") {
          return (
            <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-4">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
              <span>Creating mindmap...</span>
            </div>
          );
        } else if (status === "executing") {
          return (
            <div className="flex items-center gap-2 rounded-lg bg-yellow-50 p-4">
              <div className="h-4 w-4 animate-pulse rounded-full bg-yellow-500"></div>
              <span>
                Processing mindmap data for &quot;{args.title}&quot;...
              </span>
            </div>
          );
        }
        return <></>;
      },
      handler: async (args) => {
        try {
          console.log("Raw args received:", args);

          const {
            title,
            nodesJson,
            connectionsJson,
            layoutAlgorithm,
            layoutOptions,
          } = args;

          if (!title || !nodesJson) {
            throw new Error("Missing required parameters");
          }

          // Validate JSON strings are not empty
          if (!nodesJson.trim()) {
            throw new Error("nodesJson is empty");
          }

          let nodes;
          let connections = [];
          let parsedLayoutOptions = {};

          try {
            console.log("Attempting to parse nodesJson:", nodesJson);
            nodes = JSON.parse(nodesJson);
            if (connectionsJson) {
              console.log(
                "Attempting to parse connectionsJson:",
                connectionsJson
              );
              connections = JSON.parse(connectionsJson);
            }
            if (layoutOptions) {
              parsedLayoutOptions = JSON.parse(layoutOptions);
            }
          } catch {
            throw new Error("Failed to parse JSON data");
          }

          if (!Array.isArray(nodes)) {
            throw new Error("Invalid nodes format");
          }

          // Validate layout algorithm
          const validAlgorithms = [
            "layered",
            "force",
            "stress",
            "mrtree",
            "radial",
            "disco",
          ];
          const selectedAlgorithm =
            layoutAlgorithm && validAlgorithms.includes(layoutAlgorithm)
              ? layoutAlgorithm
              : "layered";

          addOrUpdateArtifact("mindmap", {
            title,
            nodes,
            connections,
            layoutAlgorithm: selectedAlgorithm,
            layoutOptions: parsedLayoutOptions,
          });

          return `Created ${selectedAlgorithm} mindmap "${title}" with ${nodes.length} nodes`;
        } catch (error) {
          console.error("Error in create_mindmap handler:", error);
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          return `Failed to create mindmap: ${errorMessage}`;
        }
      },
    },
    []
  );
};
