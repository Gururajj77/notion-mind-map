import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Pin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import ClusterColorStrip from '@/components/ClusterColorStrip';
import { formatEdited } from '@/lib/format-time';
import { buildPageClusterColorMap } from '@/lib/cluster-colors';
import { getPagePreview } from '@/lib/page-display';
import { useAppStore } from '@/store/app-store';
import type { NotionPage } from '@/types/notion';

function getPageById(pages: NotionPage[], id: string): NotionPage | undefined {
  return pages.find((p) => p.id === id);
}

function LinkChip({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-border/50 bg-muted/30 px-2 py-1 text-left text-[11px] text-foreground/80 transition-colors hover:bg-accent/50 hover:text-foreground"
    >
      {label}
    </button>
  );
}

function ConnectionGroup({
  label,
  items,
  onSelect,
}: {
  label: string;
  items: Array<{ id: string; title: string }>;
  onSelect: (id: string) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/80">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <LinkChip key={item.id} label={item.title} onClick={() => onSelect(item.id)} />
        ))}
      </div>
    </div>
  );
}

export default function NodeDetails() {
  const pages = useAppStore((s) => s.pages);
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);
  const graphLevel = useAppStore((s) => s.graphLevel);
  const pinnedNodeIds = useAppStore((s) => s.pinnedNodeIds);
  const exploreNode = useAppStore((s) => s.exploreNode);
  const selectNode = useAppStore((s) => s.selectNode);
  const togglePin = useAppStore((s) => s.togglePin);
  const page = pages.find((p) => p.id === selectedNodeId) ?? null;

  if (graphLevel === 0) {
    return null;
  }

  const children =
    page == null
      ? []
      : pages.filter((p) => p.parentId === page.id).map((p) => ({ id: p.id, title: p.title }));
  const relations =
    page?.relationIds
      .map((id) => getPageById(pages, id))
      .filter((p): p is NotionPage => p != null)
      .map((p) => ({ id: p.id, title: p.title })) ?? [];
  const mentionedBy =
    page == null
      ? []
      : pages
          .filter((p) => p.mentionIds.includes(page.id))
          .map((p) => ({ id: p.id, title: p.title }));
  const relatedBy =
    page == null
      ? []
      : pages
          .filter((p) => p.relationIds.includes(page.id))
          .map((p) => ({ id: p.id, title: p.title }));
  const allRelations = [
    ...new Map([...relations, ...relatedBy].map((item) => [item.id, item])).values(),
  ];
  const allMentions = [...new Map(mentionedBy.map((item) => [item.id, item])).values()];
  const preview = page ? getPagePreview(page) : '';
  const isPinned = page ? pinnedNodeIds.includes(page.id) : false;
  const clusterInfo = page ? buildPageClusterColorMap(pages).get(page.id) : null;
  const hasConnections =
    children.length > 0 || allRelations.length > 0 || allMentions.length > 0;

  return (
    <AnimatePresence>
      {page && (
        <motion.div
          key={page.id}
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="pointer-events-auto absolute top-5 right-5 z-30 flex w-[min(340px,calc(100vw-2rem))] max-h-[min(420px,calc(100vh-6rem))] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-lg backdrop-blur-xl"
        >
          {clusterInfo && (
            <ClusterColorStrip colors={clusterInfo.colors} className="rounded-none" />
          )}

          <div className="flex items-start gap-2 border-b border-border/50 px-4 py-3">
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-[15px] font-semibold leading-tight tracking-tight">
                {page.title}
              </h2>
              {clusterInfo?.clusterLabel && (
                <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span
                    className="size-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: clusterInfo.primary }}
                  />
                  {clusterInfo.clusterLabel}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className={cn('size-8 rounded-lg', isPinned && 'text-primary')}
                onClick={() => togglePin(page.id)}
                aria-label={isPinned ? 'Unpin page' : 'Pin page'}
              >
                <Pin className={cn('size-3.5', isPinned && 'fill-current')} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-lg text-muted-foreground"
                onClick={() => selectNode(null)}
                aria-label="Close"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-4 px-4 py-3">
              {preview && (
                <p className="text-[13px] leading-relaxed text-muted-foreground">{preview}</p>
              )}

              <p className="text-[11px] text-muted-foreground/80">
                {formatEdited(page.lastEditedTime)}
              </p>

              {hasConnections && (
                <div className="space-y-3 border-t border-border/40 pt-3">
                  <ConnectionGroup label="Relations" items={allRelations} onSelect={exploreNode} />
                  <ConnectionGroup label="Children" items={children} onSelect={exploreNode} />
                  <ConnectionGroup label="Mentions" items={allMentions} onSelect={exploreNode} />
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-border/50 px-4 py-2.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-full justify-center gap-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="size-3.5" />
              Open in Notion
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
