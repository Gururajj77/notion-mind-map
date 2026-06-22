import { motion } from 'framer-motion';
import {
  ChevronRight,
  Clock,
  HelpCircle,
  Pin,
  Search,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ClusterExplorerCard from '@/components/ClusterExplorerCard';
import PageAvatar from '@/components/PageAvatar';
import { buildExplorerClusters } from '@/lib/explorer-clusters';
import { formatOpenedAgo } from '@/lib/format-time';
import { PLACEHOLDER_QUESTIONS } from '@/lib/placeholder-questions';
import { useAppStore } from '@/store/app-store';

export default function CanvasHome() {
  const pages = useAppStore((s) => s.pages);
  const pinnedNodeIds = useAppStore((s) => s.pinnedNodeIds);
  const recentEntries = useAppStore((s) => s.recentEntries);
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const exploreNode = useAppStore((s) => s.exploreNode);
  const expandCluster = useAppStore((s) => s.expandCluster);
  const setHoveredClusterId = useAppStore((s) => s.setHoveredClusterId);

  const pageMap = new Map(pages.map((p) => [p.id, p]));
  const clusters = buildExplorerClusters(pages);

  const pinnedPages = pinnedNodeIds
    .map((id) => pageMap.get(id))
    .filter((p): p is NonNullable<typeof p> => p != null);

  const recentPages = recentEntries
    .map((entry) => {
      const page = pageMap.get(entry.id);
      return page ? { page, openedAt: entry.openedAt } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item != null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-10 overflow-y-auto bg-background"
    >
      <div className="mx-auto w-full max-w-2xl px-6 py-10 pb-16">
        <header className="mb-10">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
            <Sparkles className="size-5" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">What matters right now?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Pick up where you left off, or search to jump into context.
          </p>
        </header>

        <Button
          variant="outline"
          className="mb-10 h-12 w-full justify-between rounded-xl border-border/70 bg-card px-4 text-base font-normal shadow-sm hover:bg-accent/40"
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

        {recentPages.length > 0 && (
          <section className="mb-10 space-y-3">
            <h3 className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              <Clock className="size-3.5" />
              Continue Exploring
            </h3>
            <div className="space-y-2">
              {recentPages.map(({ page, openedAt }) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => exploreNode(page.id)}
                  className="group flex w-full items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3.5 text-left transition-colors hover:border-border hover:bg-accent/30"
                >
                  <PageAvatar page={page} className="text-xl" initialClassName="size-9 text-sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{page.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatOpenedAgo(openedAt)}
                    </p>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </section>
        )}

        {pinnedPages.length > 0 && (
          <section className="mb-10 space-y-3">
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
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 text-left transition-colors hover:bg-accent/30"
                >
                  <PageAvatar page={page} initialClassName="size-8 text-xs" />
                  <span className="truncate text-sm font-medium">{page.title}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10 space-y-3">
          <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Clusters
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {clusters.map((cluster) => (
              <ClusterExplorerCard
                key={cluster.id}
                cluster={cluster}
                onClick={() => expandCluster(cluster.id, cluster.rootId)}
                onHoverStart={() => setHoveredClusterId(cluster.id)}
                onHoverEnd={() => setHoveredClusterId(null)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            <HelpCircle className="size-3.5" />
            Questions
          </h3>
          <div className="grid gap-2">
            {PLACEHOLDER_QUESTIONS.map((question) => (
              <div
                key={question.id}
                className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-3.5"
              >
                <p className="text-sm font-medium text-foreground/90">{question.text}</p>
                <p className="mt-1 text-xs text-muted-foreground">{question.hint}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
