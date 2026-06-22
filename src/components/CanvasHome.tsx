import { motion } from 'framer-motion';
import { ChevronRight, Pin, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { buildExplorerClusters } from '@/lib/explorer-clusters';
import { getPageIcon } from '@/lib/page-display';
import { useAppStore } from '@/store/app-store';

export default function CanvasHome() {
  const pages = useAppStore((s) => s.pages);
  const pinnedNodeIds = useAppStore((s) => s.pinnedNodeIds);
  const recentNodeIds = useAppStore((s) => s.recentNodeIds);
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const exploreNode = useAppStore((s) => s.exploreNode);
  const expandCluster = useAppStore((s) => s.expandCluster);

  const clusters = buildExplorerClusters(pages);
  const pinnedPages = pinnedNodeIds
    .map((id) => pages.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p != null);
  const recentPages = recentNodeIds
    .map((id) => pages.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p != null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-10 flex items-center justify-center overflow-y-auto bg-canvas/90 p-8 backdrop-blur-md dark:bg-canvas/95"
    >
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
            <Sparkles className="size-5" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight">What matters right now?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Search a page or pick a starting point. The graph appears only in context.
          </p>
        </div>

        <Button
          variant="outline"
          className="h-12 w-full justify-between rounded-2xl border-border/70 bg-card px-5 text-base font-normal shadow-sm"
          onClick={() => setSearchOpen(true)}
        >
          <span className="flex items-center gap-3 text-muted-foreground">
            <Search className="size-4" />
            Search pages...
          </span>
          <kbd className="rounded-md border border-border/70 bg-muted/50 px-2 py-0.5 font-mono text-[10px]">
            ⌘K
          </kbd>
        </Button>

        {pinnedPages.length > 0 && (
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              <Pin className="size-3.5" />
              Pinned
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {pinnedPages.map((page) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => exploreNode(page.id)}
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 text-left transition-colors hover:bg-accent/40"
                >
                  <span className="text-lg">{getPageIcon(page)}</span>
                  <span className="truncate text-sm font-medium">{page.title}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {recentPages.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Recently opened
            </h3>
            <div className="flex flex-wrap gap-2">
              {recentPages.map((page) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => exploreNode(page.id)}
                  className="rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs text-foreground/80 transition-colors hover:bg-accent/40"
                >
                  {page.title}
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-3">
          <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Clusters
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {clusters.map((cluster) => (
              <Card
                key={cluster.id}
                className="cursor-pointer rounded-2xl border-border/60 py-0 shadow-none transition-colors hover:bg-accent/30"
                onClick={() => expandCluster(cluster.id, cluster.rootId)}
              >
                <CardContent className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="font-medium">{cluster.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {cluster.nodeIds.length} nodes
                    </p>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
