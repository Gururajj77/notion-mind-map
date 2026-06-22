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
import BreadcrumbNav from '@/components/BreadcrumbNav';
import CanvasHome from '@/components/CanvasHome';
import GlobalViewWarning from '@/components/GlobalViewWarning';
import GraphStats from '@/components/GraphStats';
import { useAppStore } from '@/store/app-store';
import { NODE_HEIGHT, NODE_WIDTH } from '@/services/dagre-layout';
import {
  getGraphStats,
  getPathEdgePairs,
  getPathNodeIds,
} from '@/services/graph-builder';
import {
  getEdgeOpacity,
  shouldShowEdge,
} from '@/services/visibility';
import type { GraphEdge, GraphNode } from '@/types/graph';
import PageNode from './PageNode';

const nodeTypes = { pageNode: PageNode };

interface GraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  visibleNodeIds: Set<string> | null;
}

function GraphCanvas({ nodes, edges, visibleNodeIds }: GraphProps) {
  const pages = useAppStore((s) => s.pages);
  const graphLevel = useAppStore((s) => s.graphLevel);
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);
  const pathMode = useAppStore((s) => s.pathMode);
  const hoveredNodeId = useAppStore((s) => s.hoveredNodeId);
  const centerOnNodeId = useAppStore((s) => s.centerOnNodeId);
  const expandedClusterId = useAppStore((s) => s.expandedClusterId);
  const exploreNode = useAppStore((s) => s.exploreNode);
  const selectNode = useAppStore((s) => s.selectNode);
  const clearCenter = useAppStore((s) => s.clearCenter);
  const commitPositionDrag = useAppStore((s) => s.commitPositionDrag);

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState(nodes);
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState(edges);
  const reactFlowRef = useRef<ReactFlowInstance<GraphNode, GraphEdge> | null>(null);
  const pendingCenterRef = useRef<string | null>(null);
  const dragOriginRef = useRef<{ id: string; position: { x: number; y: number } } | null>(null);
  const lastLayoutKeyRef = useRef<string>('');

  const layoutKey = useMemo(
    () =>
      `${graphLevel}:${selectedNodeId ?? ''}:${expandedClusterId ?? ''}:${pathMode}:${nodes.map((n) => n.id).join(',')}`,
    [graphLevel, selectedNodeId, expandedClusterId, pathMode, nodes],
  );

  const stats = useMemo(() => getGraphStats(pages), [pages]);
  const pathNodeIds = useMemo(
    () => (selectedNodeId ? getPathNodeIds(selectedNodeId, pages) : new Set<string>()),
    [selectedNodeId, pages],
  );
  const pathEdgePairs = useMemo(
    () => (selectedNodeId ? getPathEdgePairs(selectedNodeId, pages) : []),
    [selectedNodeId, pages],
  );

  const visibleStats = useMemo(() => {
    if (graphLevel === 0) {
      return null;
    }
    if (visibleNodeIds === null) {
      return stats;
    }
    const visibleEdges = edges.filter((edge) =>
      shouldShowEdge(
        edge,
        graphLevel,
        visibleNodeIds,
        selectedNodeId,
        hoveredNodeId,
        pathMode,
        pathNodeIds,
      ),
    );
    return {
      pages: nodes.length,
      relationships: visibleEdges.filter((e) => e.data?.edgeType === 'relation').length,
      clusters: stats.clusters,
    };
  }, [
    graphLevel,
    visibleNodeIds,
    stats,
    nodes.length,
    edges,
    selectedNodeId,
    hoveredNodeId,
    pathMode,
    pathNodeIds,
  ]);

  const showGraph = graphLevel > 0 && nodes.length > 0;

  const centerOnNode = useCallback(
    (nodeId: string) => {
      const instance = reactFlowRef.current;
      const fromProps = nodes.find((n) => n.id === nodeId);

      if (!instance) {
        pendingCenterRef.current = nodeId;
        return;
      }

      if (!fromProps) {
        clearCenter();
        return;
      }

      const flowNode = instance.getNode(nodeId);
      const position = flowNode?.position ?? fromProps.position;

      instance.setCenter(position.x + NODE_WIDTH / 2, position.y + NODE_HEIGHT / 2, {
        zoom: graphLevel === 1 ? 1.05 : 0.9,
        duration: 500,
      });
      clearCenter();
    },
    [clearCenter, graphLevel, nodes],
  );

  const fitVisibleGraph = useCallback(() => {
    const instance = reactFlowRef.current;
    if (!instance || nodes.length === 0) {
      return;
    }

    if (graphLevel === 3) {
      void instance.fitView({ padding: 0.35, duration: 400 });
      return;
    }

    void instance.fitView({
      padding: 0.45,
      duration: 400,
      nodes: nodes.map((node) => ({ id: node.id })),
    });
  }, [graphLevel, nodes]);

  const getNodeDimState = useCallback(
    (nodeId: string) => {
      const isSelected = nodeId === selectedNodeId;
      const onPath = pathNodeIds.has(nodeId);

      if (pathMode) {
        return {
          dimmed: !onPath,
          dimOpacity: onPath ? 1 : 0.05,
          onPath,
        };
      }

      if (graphLevel === 2 && visibleNodeIds?.has(nodeId)) {
        return {
          dimmed: false,
          dimOpacity: isSelected ? 1 : 0.96,
          onPath,
        };
      }

      if (graphLevel === 1 && visibleNodeIds) {
        const inNeighborhood = visibleNodeIds.has(nodeId);
        return {
          dimmed: !inNeighborhood || (!isSelected && graphLevel === 1),
          dimOpacity: isSelected ? 1 : 0.92,
          onPath,
        };
      }

      if (selectedNodeId && !isSelected) {
        return {
          dimmed: true,
          dimOpacity: onPath ? 0.75 : 0.05,
          onPath,
        };
      }

      return { dimmed: false, dimOpacity: 1, onPath };
    },
    [pathMode, pathNodeIds, graphLevel, visibleNodeIds, selectedNodeId],
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
      edges
        .filter((edge) =>
          shouldShowEdge(
            edge,
            graphLevel,
            visibleNodeIds,
            selectedNodeId,
            hoveredNodeId,
            pathMode,
            pathNodeIds,
          ),
        )
        .map((edge) => {
          const isPathEdge = pathEdgePairs.some(
            (pair) => pair.source === edge.source && pair.target === edge.target,
          );
          const opacity = getEdgeOpacity(
            edge,
            graphLevel,
            selectedNodeId,
            hoveredNodeId,
            pathMode,
            isPathEdge,
          );

          return {
            ...edge,
            animated:
              (edge.data?.edgeType === 'relation' && opacity > 0.5) ||
              (isPathEdge && pathMode),
            style: {
              ...edge.style,
              opacity,
              strokeWidth: isPathEdge && pathMode
                ? ((edge.style?.strokeWidth as number) ?? 1) + 1
                : edge.style?.strokeWidth,
              transition: 'opacity 450ms ease, stroke-width 300ms ease',
            },
          };
        }),
    );
  }, [
    edges,
    graphLevel,
    visibleNodeIds,
    selectedNodeId,
    hoveredNodeId,
    pathMode,
    pathNodeIds,
    pathEdgePairs,
    setFlowEdges,
  ]);

  useEffect(() => {
    if (!centerOnNodeId || nodes.length === 0 || graphLevel !== 1) {
      return;
    }

    const nodeId = centerOnNodeId;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => centerOnNode(nodeId));
    });

    return () => cancelAnimationFrame(frame);
  }, [centerOnNodeId, nodes, centerOnNode, graphLevel]);

  useEffect(() => {
    if (!showGraph || nodes.length === 0) {
      return;
    }

    if (lastLayoutKeyRef.current === layoutKey) {
      return;
    }

    lastLayoutKeyRef.current = layoutKey;
    const timer = window.setTimeout(() => {
      if (graphLevel === 1 && selectedNodeId) {
        centerOnNode(selectedNodeId);
        return;
      }
      fitVisibleGraph();
    }, 80);

    return () => window.clearTimeout(timer);
  }, [layoutKey, showGraph, nodes.length, graphLevel, selectedNodeId, centerOnNode, fitVisibleGraph]);

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
      if (node.id === selectedNodeId && graphLevel === 1) {
        selectNode(node.id);
        return;
      }
      exploreNode(node.id);
    },
    [exploreNode, selectNode, selectedNodeId, graphLevel],
  );

  const handlePaneClick = useCallback(() => {
    if (graphLevel === 3) {
      selectNode(null);
    }
  }, [graphLevel, selectNode]);

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
      if (moved && graphLevel === 3) {
        commitPositionDrag(node.id, node.position);
      }
    },
    [commitPositionDrag, graphLevel],
  );

  return (
    <div className="relative h-full w-full bg-canvas">
      {graphLevel === 0 && <CanvasHome />}

      {showGraph && (
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
          minZoom={0.08}
          maxZoom={1.4}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={32}
            size={1}
            color="var(--canvas-dot)"
          />
          <Controls showInteractive={false} position="bottom-left" className="!left-5 !bottom-5" />
        </ReactFlow>
      )}

      <BreadcrumbNav />
      <GlobalViewWarning />

      {visibleStats && graphLevel > 0 && (
        <GraphStats
          nodes={visibleStats.pages}
          relationships={visibleStats.relationships}
          clusters={visibleStats.clusters}
        />
      )}
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
