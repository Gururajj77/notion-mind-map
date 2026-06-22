import { motion } from 'framer-motion';
import {
  AtSign,
  ChevronRight,
  GitBranch,
  Home,
  Link2,
  Moon,
  Redo2,
  Route,
  Search,
  Sparkles,
  Sun,
  Undo2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { buildExplorerClusters } from '@/lib/explorer-clusters';
import { buildPageClusterColorMap, getClusterTheme } from '@/lib/cluster-colors';
import { cn } from '@/lib/utils';
import { getPathToRoot } from '@/services/graph-builder';
import { GRAPH_LEVEL_LABELS } from '@/types/exploration';
import { useAppStore } from '@/store/app-store';

const legendItems = [
  {
    label: 'Parent',
    description: 'Hierarchy — always visible, low opacity',
    icon: GitBranch,
    lineClass: 'border-muted-foreground/40',
    lineStyle: { borderColor: 'var(--edge-parent)' },
  },
  {
    label: 'Relation',
    description: 'Quiet by default — brighter on hover or selection',
    icon: Link2,
    lineClass: 'border-primary/60',
    lineStyle: { borderColor: 'var(--edge-relation)' },
  },
  {
    label: 'Mention',
    description: 'Dotted — shown in focus or on hover',
    icon: AtSign,
    lineClass: 'border-orange-400/60 dark:border-orange-300/60',
    lineStyle: { borderColor: 'var(--edge-mention)', borderStyle: 'dashed' },
  },
] as const;

export default function Sidebar() {
  const pages = useAppStore((s) => s.pages);
  const graphLevel = useAppStore((s) => s.graphLevel);
  const expandedClusterId = useAppStore((s) => s.expandedClusterId);
  const pathMode = useAppStore((s) => s.pathMode);
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);
  const darkMode = useAppStore((s) => s.darkMode);
  const setPathMode = useAppStore((s) => s.setPathMode);
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const setDarkMode = useAppStore((s) => s.setDarkMode);
  const goHome = useAppStore((s) => s.goHome);
  const expandCluster = useAppStore((s) => s.expandCluster);
  const exploreNode = useAppStore((s) => s.exploreNode);
  const setHoveredClusterId = useAppStore((s) => s.setHoveredClusterId);
  const undoPosition = useAppStore((s) => s.undoPosition);
  const redoPosition = useAppStore((s) => s.redoPosition);
  const canUndo = useAppStore((s) => s.positionPast.length > 0);
  const canRedo = useAppStore((s) => s.positionFuture.length > 0);

  const pathDisabled = !selectedNodeId;
  const pathToRoot = selectedNodeId ? getPathToRoot(selectedNodeId, pages) : [];
  const clusters = buildExplorerClusters(pages);
  const pageClusterColors = buildPageClusterColorMap(pages);
  const selectedCluster = selectedNodeId ? pageClusterColors.get(selectedNodeId) : null;

  const handlePathToggle = () => {
    if (pathDisabled) return;
    setPathMode(!pathMode);
  };

  return (
    <motion.aside
      initial={{ x: -16, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-full min-h-0 w-72 shrink-0 flex-col overflow-hidden border-r border-border/60 bg-sidebar"
    >
      <div className="flex shrink-0 items-center justify-between px-5 py-5">
        <button
          type="button"
          onClick={goHome}
          className="flex min-w-0 items-center gap-3 text-left transition-opacity hover:opacity-80"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="size-4" />
          </div>
          <div className="min-w-0">
            <h1 className="text-[15px] font-semibold tracking-tight">Mind Map</h1>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">KnotCMS startup map</p>
          </div>
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 rounded-lg text-muted-foreground"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
      </div>

      <Separator className="shrink-0" />

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-4 px-5 py-5 pb-8">
          <Button
            variant="outline"
            className="h-11 w-full justify-between rounded-xl border-border/70 bg-card/80 px-4 font-normal text-muted-foreground shadow-none hover:bg-accent/50"
            onClick={() => setSearchOpen(true)}
          >
            <span className="flex items-center gap-2.5 text-sm">
              <Search className="size-4" />
              Search pages...
            </span>
            <kbd className="rounded-md border border-border/70 bg-muted/50 px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </Button>

          {graphLevel > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="h-10 flex-1 rounded-xl shadow-none"
                disabled={!canUndo}
                onClick={undoPosition}
                title="Undo move (⌘Z)"
              >
                <Undo2 className="size-4" />
                Undo
              </Button>
              <Button
                variant="outline"
                className="h-10 flex-1 rounded-xl shadow-none"
                disabled={!canRedo}
                onClick={redoPosition}
                title="Redo move (⌘⇧Z)"
              >
                <Redo2 className="size-4" />
                Redo
              </Button>
            </div>
          )}

          {graphLevel > 0 && graphLevel < 3 && (
            <Card className="gap-0 rounded-2xl border-border/60 py-0 shadow-none">
              <CardHeader className="px-4 py-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Home className="size-4 text-muted-foreground" />
                  {GRAPH_LEVEL_LABELS[graphLevel]}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {graphLevel === 1 && 'Parent, children, relations, and mentions around one page.'}
                  {graphLevel === 2 && 'A focused slice of one cluster.'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 h-8 w-full rounded-lg"
                  onClick={goHome}
                >
                  Back to full graph
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="gap-0 rounded-2xl border-border/60 py-0 shadow-none">
            <CardHeader className="px-4 py-3">
              <CardTitle className="text-sm font-medium text-foreground/80">Clusters</CardTitle>
              <p className="text-xs text-muted-foreground">
                Drill into Vision, Product, Marketing, and more.
              </p>
            </CardHeader>
            <CardContent className="space-y-2 px-4 pb-4">
              {clusters.map((cluster) => {
                const theme = getClusterTheme(cluster.id);
                const isActive = expandedClusterId === cluster.id && graphLevel === 2;
                return (
                  <button
                    key={cluster.id}
                    type="button"
                    onClick={() => expandCluster(cluster.id, cluster.rootId)}
                    onMouseEnter={() => setHoveredClusterId(cluster.id)}
                    onMouseLeave={() => setHoveredClusterId(null)}
                    className={cn(
                      'relative flex w-full items-center justify-between overflow-hidden rounded-xl border py-2.5 pr-4 pl-5 text-left transition-colors hover:bg-accent/30',
                      isActive
                        ? 'border-primary/35 bg-primary/8'
                        : 'border-border/60',
                    )}
                  >
                    {theme && (
                      <span
                        className="absolute left-0 top-2 bottom-2 w-1 rounded-full"
                        style={{ backgroundColor: theme.color }}
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium">{cluster.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {cluster.nodeIds.length} pages
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {graphLevel > 0 && (
            <Card className="gap-0 rounded-2xl border-border/60 py-0 shadow-none">
              <CardHeader className="px-4 py-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Route className="size-4 text-primary" />
                  Path to Root
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-4 pb-4">
                <button
                  type="button"
                  disabled={pathDisabled}
                  onClick={handlePathToggle}
                  className={cn(
                    'relative flex h-10 w-full items-center rounded-xl border px-1 transition-colors duration-150',
                    pathDisabled && 'cursor-not-allowed opacity-40',
                    pathMode
                      ? 'border-primary/35 bg-primary/10'
                      : 'border-border/70 bg-muted/30',
                  )}
                >
                  <motion.span
                    layout
                    transition={{ type: 'spring', stiffness: 480, damping: 38 }}
                    className={cn(
                      'absolute top-1 h-8 w-[calc(50%-4px)] rounded-lg bg-card shadow-sm',
                      pathMode ? 'left-[calc(50%+2px)]' : 'left-1',
                    )}
                  />
                  <span className="relative z-10 flex-1 text-center text-xs font-medium text-foreground/80">
                    Off
                  </span>
                  <span className="relative z-10 flex-1 text-center text-xs font-medium text-foreground/80">
                    On
                  </span>
                </button>
                {pathToRoot.length > 0 && (
                  <div className="max-h-40 space-y-1 overflow-y-auto">
                    {selectedCluster?.clusterLabel && (
                      <p className="mb-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: selectedCluster.primary }}
                        />
                        {selectedCluster.clusterLabel}
                      </p>
                    )}
                    {pathToRoot.map((page, index) => (
                      <div key={page.id} className="flex flex-col items-start">
                        {index > 0 && (
                          <span className="my-0.5 pl-2 text-xs text-muted-foreground/50">↓</span>
                        )}
                        <button
                          type="button"
                          onClick={() => exploreNode(page.id)}
                          className={cn(
                            'rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-accent/40',
                            page.id === selectedNodeId
                              ? 'bg-primary/12 font-medium text-primary'
                              : pathMode
                                ? 'text-foreground/90'
                                : 'text-foreground/75',
                          )}
                        >
                          {page.title}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {graphLevel > 0 && (
            <Card className="gap-0 rounded-2xl border-border/60 py-0 shadow-none">
              <CardHeader className="px-4 py-3">
                <CardTitle className="text-sm font-medium text-foreground/80">Connections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-4 pb-4">
                {legendItems.map(({ label, description, icon: Icon, lineClass, lineStyle }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="mt-1.5 flex w-8 shrink-0 flex-col items-center gap-1">
                      <span
                        className={cn('h-0 w-6 border-t-2', lineClass)}
                        style={lineStyle}
                        aria-hidden
                      />
                      <Icon className="size-3.5 text-muted-foreground" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm text-foreground/80">{label}</p>
                      <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </motion.aside>
  );
}
