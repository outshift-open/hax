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

"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Controls,
  MiniMap,
  Background,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ELK from "elkjs/lib/elk.bundled.js";
import { LayoutOptions } from "elkjs";

interface MindmapProps {
  title?: string;
  nodes?: Array<{ id: string; label: string; x?: number; y?: number }>;
  connections?: Array<{ from: string; to: string }>;
  layoutAlgorithm?: string;
  layoutOptions?: LayoutOptions;
}

export function HAXMindmap({
  title,
  nodes: mindmapNodes,
  connections,
  layoutAlgorithm = "layered",
  layoutOptions = {},
}: MindmapProps) {
  console.log(
    JSON.stringify({
      title,
      mindmapNodes,
      connections,
      layoutAlgorithm,
      layoutOptions,
    })
  );

  const [layoutedNodes, setLayoutedNodes] = useState<Node[]>([]);
  const [layoutedEdges, setLayoutedEdges] = useState<Edge[]>([]);
  const [isLayouting, setIsLayouting] = useState(false);

  // ELK layout calculation
  const calculateLayout = useCallback(async () => {
    if (!mindmapNodes?.length) {
      setLayoutedNodes([]);
      setLayoutedEdges([]);
      return;
    }

    setIsLayouting(true);

    try {
      const elk = new ELK();

      // Convert our data format to ELK format
      const elkGraph = {
        id: "root",
        layoutOptions: {
          "elk.algorithm": layoutAlgorithm,
          "elk.direction": "DOWN",
          "elk.spacing.nodeNode": "80",
          "elk.layered.spacing.nodeNodeBetweenLayers": "100",
          "elk.padding": "[top=50,left=50,bottom=50,right=50]",
          "elk.zoomToFit": "true",
          ...layoutOptions, // Allow custom options to override defaults
        },
        children: mindmapNodes.map((node) => {
          // Calculate dynamic width based on text length to fix overflow
          const textWidth = Math.max(120, node.label.length * 10 + 40);

          return {
            id: node.id,
            width: textWidth,
            height: 50, // Default node height
            labels: [{ text: node.label }],
          };
        }),
        edges:
          connections?.map((conn, index) => ({
            id: `edge-${index}`,
            sources: [conn.from],
            targets: [conn.to],
          })) || [],
      };
      console.log("ELK Graph:", elkGraph);

      // Run ELK layout
      const layoutedGraph = await elk.layout(elkGraph);

      console.log("Layouted Graph:", layoutedGraph);

      // Convert back to React Flow format
      const nodes: Node[] =
        layoutedGraph.children?.map((elkNode) => {
          const originalNode = mindmapNodes.find((n) => n.id === elkNode.id);
          const isRoot = !connections?.some((conn) => conn.to === elkNode.id);

          return {
            id: elkNode.id,
            type: "default",
            position: {
              x: elkNode.x || 0,
              y: elkNode.y || 0,
            },
            data: { label: originalNode?.label || elkNode.id },
            style: {
              background: isRoot ? "#f0f9ff" : "#ffffff",
              border: isRoot ? "3px solid #0ea5e9" : "2px solid #93c5fd",
              borderRadius: "8px",
              padding: "12px 16px",
              fontSize: isRoot ? "16px" : "14px",
              fontWeight: isRoot ? "600" : "400",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              width: "auto",
              height: "auto",
              whiteSpace: "nowrap",
            },
          };
        }) || [];

      const edges: Edge[] =
        layoutedGraph.edges?.map((elkEdge) => ({
          id: elkEdge.id,
          source: elkEdge.sources[0],
          target: elkEdge.targets[0],
          type: "smoothstep",
          animated: true,
        })) || [];

      setLayoutedNodes(nodes);
      setLayoutedEdges(edges);
    } catch (error) {
      console.error("ELK layout error:", error);
      // Fallback to simple positioning if ELK fails
      const fallbackNodes: Node[] = mindmapNodes.map((node, index) => {
        const isRoot = !connections?.some((conn) => conn.to === node.id);
        return {
          id: node.id,
          type: "default",
          position: {
            x: 100 + (index % 3) * 200,
            y: 100 + Math.floor(index / 3) * 150,
          },
          data: { label: node.label },
          style: {
            background: isRoot ? "#f0f9ff" : "#ffffff",
            border: isRoot ? "3px solid #0ea5e9" : "2px solid #93c5fd",
            borderRadius: "8px",
            padding: "12px",
            fontSize: isRoot ? "16px" : "14px",
            fontWeight: isRoot ? "600" : "400",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          },
        };
      });
      setLayoutedNodes(fallbackNodes);

      const fallbackEdges: Edge[] =
        connections?.map((conn, index) => ({
          id: `edge-${index}`,
          source: conn.from,
          target: conn.to,
          type: "smoothstep",
          animated: true,
        })) || [];
      setLayoutedEdges(fallbackEdges);
    } finally {
      setIsLayouting(false);
    }
  }, [mindmapNodes, connections, layoutAlgorithm, layoutOptions]);

  // Trigger layout calculation when inputs change
  useEffect(() => {
    calculateLayout();
  }, [calculateLayout]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [layoutedNodes, layoutedEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="h-full w-full">
      <h3 className="mb-4 text-center text-lg font-semibold">
        {title || "Mindmap"} {isLayouting && "(Calculating layout...)"}
      </h3>
      <div className="h-[600px] rounded-lg border">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          fitViewOptions={{
            padding: 0.2,
            includeHiddenNodes: false,
            minZoom: 0.1,
            maxZoom: 1,
          }}
          attributionPosition="bottom-left"
        >
          <Controls />
          <MiniMap />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}
