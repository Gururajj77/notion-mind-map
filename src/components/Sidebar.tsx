import { motion } from 'framer-motion';
import {
  AtSign,
  Focus,
  GitBranch,
  Link2,
  Moon,
  Redo2,
  Search,
  Sparkles,
  Sun,
  Undo2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { getPathToRoot } from '@/services/graph-builder';
import { useAppStore } from '@/store/app-store';

const legendItems = [
  { label: 'Parent', description: 'Structural hierarchy', icon: GitBranch, color: 'text-muted-foreground' },
  { label: 'Relation', description: 'Linked ideas', icon: Link2, color: 'text-blue-500' },
  { label: 'Mention', description: 'Referenced in text', icon: AtSign, color: 'text-orange-400' },
] as const;

export default function Sidebar() {
  const pages = useAppStore((s) => s.pages);
  const focusMode = useAppStore((s) => s.focusMode);
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);
  const darkMode = useAppStore((s) => s.darkMode);
  const setFocusMode = useAppStore((s) => s.setFocusMode);
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const setDarkMode = useAppStore((s) => s.setDarkMode);
  const selectAndCenter = useAppStore((s) => s.selectAndCenter);
  const undoPosition = useAppStore((s) => s.undoPosition);
  const redoPosition = useAppStore((s) => s.redoPosition);
  const canUndo = useAppStore((s) => s.positionPast.length > 0);
  const canRedo = useAppStore((s) => s.positionFuture.length > 0);

  const focusDisabled = !selectedNodeId;
  const pathToRoot = selectedNodeId ? getPathToRoot(selectedNodeId, pages) : [];

  const handleFocusToggle = () => {
    if (focusDisabled) return;
    const next = !focusMode;
    setFocusMode(next);
    if (next && selectedNodeId) {
      selectAndCenter(selectedNodeId);
    }
  };

  return (
    <motion.aside
      initial={{ x: -16, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex w-72 shrink-0 flex-col border-r border-border/60 bg-sidebar"
    >
      <div className="flex items-center justify-between px-6 py-7">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-foreground text-background">
            <Sparkles className="size-4" />
          </div>
          <div>
            <h1 className="text-[15px] font-semibold tracking-tight">Mind Map</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">Your thinking space</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg text-muted-foreground"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
      </div>

      <Separator />

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-7">
        <Button
          variant="outline"
          className="h-11 w-full justify-between rounded-xl border-border/70 bg-background px-4 font-normal text-muted-foreground shadow-none hover:bg-accent/40"
          onClick={() => setSearchOpen(true)}
        >
          <span className="flex items-center gap-2.5 text-sm">
            <Search className="size-4" />
            Search pages...
          </span>
          <kbd className="pointer-events-none rounded-md border border-border/70 bg-muted/50 px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </Button>

        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger
              className={cn(
                'inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border/70 bg-background text-sm font-medium shadow-none transition-colors hover:bg-accent/40 disabled:pointer-events-none disabled:opacity-40',
              )}
              disabled={!canUndo}
              onClick={undoPosition}
            >
              <Undo2 className="size-4" />
              Undo
            </TooltipTrigger>
            <TooltipContent side="bottom">Undo move (⌘Z)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              className={cn(
                'inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border/70 bg-background text-sm font-medium shadow-none transition-colors hover:bg-accent/40 disabled:pointer-events-none disabled:opacity-40',
              )}
              disabled={!canRedo}
              onClick={redoPosition}
            >
              <Redo2 className="size-4" />
              Redo
            </TooltipTrigger>
            <TooltipContent side="bottom">Redo move (⌘⇧Z)</TooltipContent>
          </Tooltip>
        </div>

        <Card className="gap-0 rounded-2xl border-border/60 py-0 shadow-none">
          <CardHeader className="px-5 py-4">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Focus className="size-4 text-blue-500" />
              Focus Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-5 pb-5">
            <Tooltip>
              <TooltipTrigger
                className={cn(
                  'relative flex h-10 w-full items-center rounded-xl border px-1 transition-colors duration-150',
                  focusDisabled && 'cursor-not-allowed opacity-40',
                  focusMode
                    ? 'border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/10'
                    : 'border-border/70 bg-muted/25',
                )}
                disabled={focusDisabled}
                onClick={handleFocusToggle}
              >
                <motion.span
                  layout
                  transition={{ type: 'spring', stiffness: 480, damping: 38 }}
                  className={cn(
                    'absolute top-1 h-8 w-[calc(50%-4px)] rounded-lg bg-card shadow-sm',
                    focusMode ? 'left-[calc(50%+2px)]' : 'left-1',
                  )}
                />
                <span className="relative z-10 flex-1 text-center text-xs font-medium text-foreground/80">
                  Off
                </span>
                <span className="relative z-10 flex-1 text-center text-xs font-medium text-foreground/80">
                  On
                </span>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[200px]">
                {focusDisabled
                  ? 'Select a node to enable focus mode'
                  : 'Dim unrelated nodes and center on what matters'}
              </TooltipContent>
            </Tooltip>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {focusDisabled
                ? 'Click a node to explore its neighborhood.'
                : focusMode
                  ? 'Unrelated ideas fade to 10% — stay in context.'
                  : 'See the full landscape of your notes.'}
            </p>
          </CardContent>
        </Card>

        {pathToRoot.length > 0 && (
          <Card className="gap-0 rounded-2xl border-border/60 py-0 shadow-none">
            <CardHeader className="px-5 py-4">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <GitBranch className="size-4 text-muted-foreground" />
                Path to Root
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="flex flex-col items-start gap-1">
                {pathToRoot.map((page, index) => (
                  <motion.div
                    key={page.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.06 }}
                    className="flex flex-col items-start"
                  >
                    {index > 0 && (
                      <span className="my-0.5 pl-2 text-xs text-muted-foreground/50">↓</span>
                    )}
                    <span
                      className={cn(
                        'rounded-lg px-2.5 py-1.5 text-sm',
                        page.id === selectedNodeId
                          ? 'bg-blue-500/10 font-medium text-blue-600 dark:text-blue-400'
                          : 'text-foreground/75',
                      )}
                    >
                      {page.title}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="gap-0 rounded-2xl border-border/60 py-0 shadow-none">
          <CardHeader className="px-5 py-4">
            <CardTitle className="text-sm font-medium text-foreground/80">Connections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-5 pb-5">
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
    </motion.aside>
  );
}
