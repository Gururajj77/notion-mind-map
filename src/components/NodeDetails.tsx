import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Pin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { formatCreated, formatEdited } from '@/lib/format-time';
import { getPageIcon, getPagePreview } from '@/lib/page-display';
import { useAppStore } from '@/store/app-store';
import type { NotionPage } from '@/types/notion';

function getPageById(pages: NotionPage[], id: string): NotionPage | undefined {
  return pages.find((p) => p.id === id);
}

function ConnectionList({
  items,
  onSelect,
}: {
  items: Array<{ id: string; title: string }>;
  onSelect: (id: string) => void;
}) {
  if (items.length === 0) {
    return <p className="text-[13px] text-muted-foreground">None</p>;
  }

  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
          className="rounded-xl border border-border/50 bg-muted/15 px-4 py-3 text-left text-[13px] text-foreground/85 transition-colors hover:bg-accent/40"
        >
          {item.title}
        </button>
      ))}
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3.5">
      <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </h3>
      {children}
    </section>
  );
}

export default function NodeDetails() {
  const pages = useAppStore((s) => s.pages);
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);
  const pinnedNodeIds = useAppStore((s) => s.pinnedNodeIds);
  const exploreNode = useAppStore((s) => s.exploreNode);
  const togglePin = useAppStore((s) => s.togglePin);
  const page = pages.find((p) => p.id === selectedNodeId) ?? null;

  const parent = page?.parentId ? getPageById(pages, page.parentId) : null;
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

  return (
    <AnimatePresence mode="wait">
      {page ? (
        <motion.aside
          key={page.id}
          initial={{ x: 28, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 28, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 360, damping: 34 }}
          className="flex w-[360px] shrink-0 flex-col border-l border-border/60 bg-card"
        >
          <div className="px-8 py-9">
            <div className="flex items-start gap-4">
              <span className="text-[32px] leading-none">{getPageIcon(page)}</span>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold tracking-tight">{page.title}</h2>
                {page.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {page.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="font-normal capitalize">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'size-9 shrink-0 rounded-xl',
                  isPinned && 'text-primary',
                )}
                onClick={() => togglePin(page.id)}
                aria-label={isPinned ? 'Unpin page' : 'Pin page'}
              >
                <Pin className={cn('size-4', isPinned && 'fill-current')} />
              </Button>
            </div>
          </div>

          <Separator />

          <ScrollArea className="flex-1">
            <div className="space-y-9 px-8 py-9">
              <Section label="Created">
                <p className="text-[13px] text-muted-foreground">
                  {formatCreated(page.createdTime)}
                </p>
              </Section>

              <Separator />

              <Section label="Last edited">
                <p className="text-[13px] text-muted-foreground">
                  {formatEdited(page.lastEditedTime)}
                </p>
              </Section>

              {preview && (
                <>
                  <Separator />
                  <Section label="Preview">
                    <p className="text-[13px] leading-relaxed text-muted-foreground">{preview}</p>
                  </Section>
                </>
              )}

              {parent && (
                <>
                  <Separator />
                  <Section label="Parent">
                    <ConnectionList
                      items={[{ id: parent.id, title: parent.title }]}
                      onSelect={exploreNode}
                    />
                  </Section>
                </>
              )}

              <Separator />

              <Section label="Children">
                <ConnectionList items={children} onSelect={exploreNode} />
              </Section>

              <Separator />

              <Section label="Relations">
                <ConnectionList items={allRelations} onSelect={exploreNode} />
              </Section>

              <Separator />

              <Section label="Mentions">
                <ConnectionList items={allMentions} onSelect={exploreNode} />
              </Section>
            </div>
          </ScrollArea>

          <Separator />

          <div className="p-7">
            <Button
              variant="outline"
              className="h-11 w-full gap-2 rounded-xl border-border/70 text-sm"
            >
              <ExternalLink className="size-4" />
              Open Page
            </Button>
          </div>
        </motion.aside>
      ) : (
        <motion.aside
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex w-[360px] shrink-0 flex-col items-center justify-center border-l border-border/60 bg-sidebar px-8 text-center"
        >
          <div className="max-w-[240px]">
            <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-muted/40">
              <span className="text-2xl opacity-60">✦</span>
            </div>
            <p className="text-sm font-medium text-foreground/80">Select a page</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Search for a page, or pick a cluster to start exploring.
            </p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
