import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  type NodeMouseHandler,
  type OnNodeDrag,
  type ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ClusterBackground from '@/components/ClusterBackground';
import GraphStats from '@/components/GraphStats';
import { buildClusters, computeClusterBounds } from '@/lib/cluster-builder';
import { useAppStore } from '@/store/app-store';
import { NODE_HEIGHT, NODE_WIDTH } from '@/services/dagre-layout';
import {
  getGraphStats,
  getPathEdgePairs,
  getPathNodeIds,
} from '@/services/graph-builder';
import type { GraphEdge, GraphNode } from '@/types/graph';
import PageNode from './PageNode';

const nodeTypes = { pageNode: PageNode };

interface GraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  focusNodeIds: Set<string> | null;
}

function GraphCanvas({ nodes, edges, focusNodeIds }: GraphProps) {
  const pages = useAppStore((s) => s.pages);
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);
  const focusMode = useAppStore((s) => s.focusMode);
  const centerOnNodeId = useAppStore((s) => s.centerOnNodeId);
  const selectNode = useAppStore((s) => s.selectNode);
  const clearCenter = useAppStore((s) => s.clearCenter);
  const commitPositionDrag = useAppStore((s) => s.commitPositionDrag);

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState(nodes);
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState(edges);
  const reactFlowRef = useRef<ReactFlowInstance<GraphNode, GraphEdge> | null>(null);
  const pendingCenterRef = useRef<string | null>(null);
  const dragOriginRef = useRef<{ id: string; position: { x: number; y: number } } | null>(null);

  const stats = useMemo(() => getGraphStats(pages), [pages]);
  const pathNodeIds = useMemo(
    () => (selectedNodeId ? getPathNodeIds(selectedNodeId, pages) : new Set<string>()),
    [selectedNodeId, pages],
  );
  const pathEdgePairs = useMemo(
    () => (selectedNodeId ? getPathEdgePairs(selectedNodeId, pages) : []),
    [selectedNodeId, pages],
  );
  const clusterBounds = useMemo(() => {
    const clusters = buildClusters(pages);
    return computeClusterBounds(clusters, nodes);
  }, [pages, nodes]);

  const centerOnNode = useCallback(
    (nodeId: string) => {
      const instance = reactFlowRef.current;
      if (!instance) {
        pendingCenterRef.current = nodeId;
        return;
      }

      const node = instance.getNode(nodeId);
      if (node) {
        instance.setCenter(node.position.x + NODE_WIDTH / 2, node.position.y + NODE_HEIGHT / 2, {
          zoom: focusMode ? 1.08 : 1,
          duration: 650,
        });
      }
      clearCenter();
    },
    [clearCenter, focusMode],
  );

  const getNodeDimState = useCallback(
    (nodeId: string) => {
      const inFocus = !focusNodeIds || focusNodeIds.has(nodeId);
      const isSelected = nodeId === selectedNodeId;
      const onPath = pathNodeIds.has(nodeId);

      if (focusMode && focusNodeIds) {
        return {
          dimmed: !inFocus,
          dimOpacity: 0.1,
          onPath,
        };
      }

      if (selectedNodeId && !isSelected) {
        return {
          dimmed: true,
          dimOpacity: onPath ? 0.75 : 0.4,
          onPath,
        };
      }

      return { dimmed: false, dimOpacity: 1, onPath };
    },
    [focusMode, focusNodeIds, selectedNodeId, pathNodeIds],
  );

  useEffect(() => {
    setFlowNodes((current) =>
      nodes.map((node) => {
        const dimState = getNodeDimState(node.id);
        const currentNode = current.find((n) => n.id === node.id);
        return {
          ...node,
          position: currentNode?.dragging ? currentNode.position : node.position,
          selected: node.id === selectedNodeId,
          data: {
            ...node.data,
            ...dimState,
          },
          style: { transition: 'opacity 450ms ease' },
        };
      }),
    );
  }, [nodes, selectedNodeId, getNodeDimState, setFlowNodes]);

  useEffect(() => {
    setFlowEdges(
      edges.map((edge) => {
        const inFocus =
          !focusNodeIds || (focusNodeIds.has(edge.source) && focusNodeIds.has(edge.target));
        const isPathEdge = pathEdgePairs.some(
          (pair) => pair.source === edge.source && pair.target === edge.target,
        );
        const baseOpacity = (edge.style?.opacity as number | undefined) ?? 1;

        let opacity = baseOpacity;
        if (focusMode && focusNodeIds && !inFocus) {
          opacity = 0.1;
        } else if (selectedNodeId && !isPathEdge) {
          const touchesSelection =
            edge.source === selectedNodeId || edge.target === selectedNodeId;
          opacity = touchesSelection ? baseOpacity : baseOpacity * 0.4;
        }
        if (isPathEdge) {
          opacity = 1;
        }

        return {
          ...edge,
          animated: edge.data?.edgeType === 'relation' || isPathEdge,
          style: {
            ...edge.style,
            opacity,
            strokeWidth: isPathEdge
              ? ((edge.style?.strokeWidth as number) ?? 1) + 0.75
              : edge.style?.strokeWidth,
            transition: 'opacity 450ms ease, stroke-width 300ms ease',
          },
        };
      }),
    );
  }, [edges, focusNodeIds, focusMode, selectedNodeId, pathEdgePairs, setFlowEdges]);

  useEffect(() => {
    if (centerOnNodeId) {
      centerOnNode(centerOnNodeId);
    }
  }, [centerOnNodeId, centerOnNode]);

  useEffect(() => {
    if (focusMode && selectedNodeId) {
      centerOnNode(selectedNodeId);
    }
  }, [focusMode, selectedNodeId, centerOnNode]);

  useEffect(() => {
    if (selectedNodeId && !focusMode) {
      centerOnNode(selectedNodeId);
    }
  }, [selectedNodeId, focusMode, centerOnNode]);

  const handleInit = useCallback(
    (instance: ReactFlowInstance<GraphNode, GraphEdge>) => {
      reactFlowRef.current = instance;
      if (pendingCenterRef.current) {
        const nodeId = pendingCenterRef.current;
        pendingCenterRef.current = null;
        centerOnNode(nodeId);
      }
    },
    [centerOnNode],
  );

  const handleNodeClick: NodeMouseHandler<GraphNode> = useCallback(
    (_, node) => {
      selectNode(node.id);
    },
    [selectNode],
  );

  const handlePaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const handleNodeDragStart: OnNodeDrag<GraphNode> = useCallback((_, node) => {
    dragOriginRef.current = { id: node.id, position: { ...node.position } };
  }, []);

  const handleNodeDragStop: OnNodeDrag<GraphNode> = useCallback(
    (_, node) => {
      const origin = dragOriginRef.current;
      dragOriginRef.current = null;

      if (!origin || origin.id !== node.id) {
        return;
      }

      const moved =
        origin.position.x !== node.position.x || origin.position.y !== node.position.y;
      if (moved) {
        commitPositionDrag(node.id, node.position);
      }
    },
    [commitPositionDrag],
  );

  return (
    <div className="relative h-full w-full bg-canvas">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        onNodeDragStart={handleNodeDragStart}
        onNodeDragStop={handleNodeDragStop}
        onInit={handleInit}
        fitView
        fitViewOptions={{ padding: 0.4 }}
        minZoom={0.08}
        maxZoom={1.4}
        proOptions={{ hideAttribution: true }}
      >
        <ClusterBackground clusters={clusterBounds} />
        <Background
          variant={BackgroundVariant.Dots}
          gap={32}
          size={1}
          color="var(--canvas-dot)"
        />
        <Controls showInteractive={false} position="bottom-left" className="!left-5 !bottom-5" />
      </ReactFlow>

      <GraphStats
        nodes={stats.pages}
        relationships={stats.relationships}
        clusters={stats.clusters}
      />
    </div>
  );
}

export default function Graph(props: GraphProps) {
  return (
    <ReactFlowProvider>
      <GraphCanvas {...props} />
    </ReactFlowProvider>
  );
}
