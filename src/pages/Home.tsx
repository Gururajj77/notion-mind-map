import { useEffect, useMemo } from 'react';
import Graph from '@/components/Graph';
import NodeDetails from '@/components/NodeDetails';
import SearchCommand from '@/components/SearchCommand';
import Sidebar from '@/components/Sidebar';
import { fetchPages } from '@/data/pages-adapter';
import { buildGraph, getFocusNodeIds } from '@/services/graph-builder';
import { useAppStore } from '@/store/app-store';

export default function Home() {
  const pages = useAppStore((s) => s.pages);
  const setPages = useAppStore((s) => s.setPages);
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);
  const focusMode = useAppStore((s) => s.focusMode);

  useEffect(() => {
    void fetchPages().then(setPages);
  }, [setPages]);

  const fullGraph = useMemo(() => buildGraph(pages), [pages]);

  const focusNodeIds = useMemo(() => {
    if (!focusMode || !selectedNodeId) {
      return null;
    }
    return getFocusNodeIds(selectedNodeId, pages);
  }, [focusMode, selectedNodeId, pages]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="relative min-w-0 flex-1">
        <Graph
          nodes={fullGraph.nodes}
          edges={fullGraph.edges}
          focusNodeIds={focusNodeIds}
        />
      </main>
      <NodeDetails />
      <SearchCommand />
    </div>
  );
}
