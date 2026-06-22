import { motion } from 'framer-motion';
import {
  AlertTriangle,
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
import { cn } from '@/lib/utils';
import { getPathToRoot } from '@/services/graph-builder';
import { GRAPH_LEVEL_LABELS } from '@/types/exploration';
import { useAppStore } from '@/store/app-store';

const legendItems = [
  { label: 'Parent', description: 'Structural hierarchy', icon: GitBranch, color: 'text-muted-foreground' },
  { label: 'Relation', description: 'On hover or selection', icon: Link2, color: 'text-primary' },
  { label: 'Mention', description: 'Neighborhood only', icon: AtSign, color: 'text-orange-400 dark:text-orange-300' },
] as const;

export default function Sidebar() {
  const pages = useAppStore((s) => s.pages);
  const graphLevel = useAppStore((s) => s.graphLevel);
  const pathMode = useAppStore((s) => s.pathMode);
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);
  const darkMode = useAppStore((s) => s.darkMode);
  const setPathMode = useAppStore((s) => s.setPathMode);
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const setDarkMode = useAppStore((s) => s.setDarkMode);
  const setGraphLevel = useAppStore((s) => s.setGraphLevel);
  const goHome = useAppStore((s) => s.goHome);
  const expandCluster = useAppStore((s) => s.expandCluster);
  const exploreNode = useAppStore((s) => s.exploreNode);
  const undoPosition = useAppStore((s) => s.undoPosition);
  const redoPosition = useAppStore((s) => s.redoPosition);
  const canUndo = useAppStore((s) => s.positionPast.length > 0);
  const canRedo = useAppStore((s) => s.positionFuture.length > 0);

  const pathDisabled = !selectedNodeId;
  const pathToRoot = selectedNodeId ? getPathToRoot(selectedNodeId, pages) : [];
  const clusters = buildExplorerClusters(pages);

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
            <p className="mt-0.5 truncate text-xs text-muted-foreground">Your thinking space</p>
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

          {graphLevel > 0 && (
            <Card className="gap-0 rounded-2xl border-border/60 py-0 shadow-none">
              <CardHeader className="px-4 py-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Home className="size-4 text-muted-foreground" />
                  View
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-sm font-medium">{GRAPH_LEVEL_LABELS[graphLevel]}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {graphLevel === 1 && 'Neighborhood — parent, children, and links.'}
                  {graphLevel === 2 && 'Cluster expanded — a focused slice of your workspace.'}
                  {graphLevel === 3 && 'Experimental global view.'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 h-8 w-full rounded-lg"
                  onClick={goHome}
                >
                  Back home
                </Button>
              </CardContent>
            </Card>
          )}

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
                <div className="max-h-36 space-y-1 overflow-y-auto">
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

          {graphLevel === 0 && (
            <Card className="gap-0 rounded-2xl border-border/60 py-0 shadow-none">
              <CardHeader className="px-4 py-3">
                <CardTitle className="text-sm font-medium text-foreground/80">Clusters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-4 pb-4">
                {clusters.map((cluster) => (
                  <button
                    key={cluster.id}
                    type="button"
                    onClick={() => expandCluster(cluster.id, cluster.rootId)}
                    className="flex w-full items-center justify-between rounded-xl border border-border/60 px-4 py-2.5 text-left transition-colors hover:bg-accent/30"
                  >
                    <div>
                      <p className="text-sm font-medium">{cluster.label}</p>
                      <p className="text-xs text-muted-foreground">{cluster.nodeIds.length} nodes</p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </button>
                ))}
              </CardContent>
            </Card>
          )}

          <Card className="gap-0 rounded-2xl border-amber-500/20 py-0 shadow-none">
            <CardHeader className="px-4 py-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-amber-800 dark:text-amber-300">
                <AlertTriangle className="size-4 shrink-0" />
                Experimental
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pb-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                Large graphs become difficult to interpret. Use neighborhood or cluster views
                instead.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-full rounded-lg border-amber-500/30"
                onClick={() => setGraphLevel(3)}
              >
                Global View
              </Button>
            </CardContent>
          </Card>

          <Card className="gap-0 rounded-2xl border-border/60 py-0 shadow-none">
            <CardHeader className="px-4 py-3">
              <CardTitle className="text-sm font-medium text-foreground/80">Connections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pb-4">
              {legendItems.map(({ label, description, icon: Icon, color }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon className={cn('mt-0.5 size-4 shrink-0', color)} />
                  <div>
                    <p className="text-sm text-foreground/80">{label}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </motion.aside>
  );
}
