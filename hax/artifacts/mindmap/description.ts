export const MINDMAP_DESCRIPTION =
  `Use mindmaps to visualize hierarchical relationships and branching concepts. Best for showing how ideas connect and flow from central themes. Ideal for brainstorming sessions, project planning, or concept mapping. Root nodes automatically get special styling (larger, blue border) to indicate hierarchy.

Keep node labels concise (1-4 words) for best visual clarity. Use descriptive IDs that make sense in your context (e.g. 'root', 'branch1', 'leaf1'). If you don't specify x,y coordinates, nodes will auto-position in a radial layout. Root nodes are determined automatically - any node that appears in 'from' but never in 'to'. Multiple root nodes will be arranged in a circle around the center.

Start with 1-3 root concepts, then branch out 2-4 levels deep. Group related concepts under the same parent for logical organization. Don't create circular connections (A→B→C→A) as this breaks the hierarchy. Avoid more than 6-8 children per parent node to prevent visual clutter. Don't mix different abstraction levels under the same parent. Very long labels (>20 characters) may cause layout issues.

Root nodes position in a circle around center with 200px radius. Child nodes branch out radially from their parents at increasing distances. Each hierarchy level adds 150px to the radius from its parent. Sibling nodes are distributed evenly around their parent using angles.` as const;
