import { useEffect, useMemo } from 'react';
import Graph from '@/components/Graph';
import NodeDetails from '@/components/NodeDetails';
import SearchCommand from '@/components/SearchCommand';
import Sidebar from '@/components/Sidebar';
import { fetchPages } from '@/data/pages-adapter';
import { usePositionUndoShortcuts } from '@/hooks/use-position-undo';
import { buildGraph, filterGraph } from '@/services/graph-builder';
import { applyDagreLayout } from '@/services/dagre-layout';
import { getVisibleNodeIds } from '@/services/visibility';
import { useAppStore } from '@/store/app-store';

export default function Home() {
  const pages = useAppStore((s) => s.pages);
  const setPages = useAppStore((s) => s.setPages);
  const graphLevel = useAppStore((s) => s.graphLevel);
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);
  const expandedClusterId = useAppStore((s) => s.expandedClusterId);
  const pathMode = useAppStore((s) => s.pathMode);
  const positionOverrides = useAppStore((s) => s.positionOverrides);

  usePositionUndoShortcuts();

  useEffect(() => {
    void fetchPages().then(setPages);
  }, [setPages]);

  const visibleNodeIds = useMemo(
    () =>
      getVisibleNodeIds(
        graphLevel,
        selectedNodeId,
        expandedClusterId,
        pathMode,
        pages,
      ),
    [graphLevel, selectedNodeId, expandedClusterId, pathMode, pages],
  );

  const graph = useMemo(() => {
    const fullGraph = buildGraph(pages);

    if (graphLevel === 0) {
      return { nodes: [], edges: [] };
    }

    if (visibleNodeIds === null) {
      return {
        nodes: fullGraph.nodes.map((node) => ({
          ...node,
          position: positionOverrides[node.id] ?? node.position,
        })),
        edges: fullGraph.edges,
      };
    }

    if (visibleNodeIds.size === 0) {
      return { nodes: [], edges: [] };
    }

    const filtered = filterGraph(fullGraph, visibleNodeIds);
    const layouted = applyDagreLayout(filtered.nodes, filtered.edges);

    return {
      nodes: layouted,
      edges: filtered.edges,
    };
  }, [pages, graphLevel, visibleNodeIds, positionOverrides]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="relative h-full min-h-0 min-w-0 flex-1">
        <Graph nodes={graph.nodes} edges={graph.edges} visibleNodeIds={visibleNodeIds} />
        <NodeDetails />
      </main>
      <SearchCommand />
    </div>
  );
}
