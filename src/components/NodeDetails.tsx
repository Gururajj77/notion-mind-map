import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  getConnectionExplanations,
  getMockTimeline,
} from '@/lib/connection-explanations';
import { getPageMeta } from '@/lib/page-meta';
import { useAppStore } from '@/store/app-store';
import type { NotionPage } from '@/types/notion';

function getPageTitle(pages: NotionPage[], id: string): string {
  return pages.find((p) => p.id === id)?.title ?? 'Unknown';
}

function ConnectionList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className="text-[13px] text-muted-foreground">None</p>;
  }

  return (
    <div className="flex flex-col gap-2.5">
      {items.map((title) => (
        <div
          key={title}
          className="rounded-xl border border-border/50 bg-muted/15 px-4 py-3 text-[13px] text-foreground/85"
        >
          {title}
        </div>
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
  const page = pages.find((p) => p.id === selectedNodeId) ?? null;

  const meta = page ? getPageMeta(page.title) : null;
  const parent = page?.parentId ? getPageTitle(pages, page.parentId) : null;
  const children =
    page == null ? [] : pages.filter((p) => p.parentId === page.id).map((p) => p.title);
  const relations = page?.relations.map((id) => getPageTitle(pages, id)) ?? [];
  const mentionedBy =
    page == null
      ? []
      : pages.filter((p) => p.mentions.includes(page.id)).map((p) => p.title);
  const relatedBy =
    page == null
      ? []
      : pages.filter((p) => p.relations.includes(page.id)).map((p) => p.title);
  const allRelations = [...new Set([...relations, ...relatedBy])];
  const allMentions = [...new Set([...mentionedBy])];
  const connectionCount =
    allRelations.length + allMentions.length + (parent ? 1 : 0) + children.length;
  const explanations = page ? getConnectionExplanations(page, pages) : [];
  const timeline = page ? getMockTimeline(page.title) : null;

  return (
    <AnimatePresence mode="wait">
      {page && meta ? (
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
              <span className="text-[32px] leading-none">{meta.emoji}</span>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold tracking-tight">{page.title}</h2>
                <Badge variant="secondary" className="mt-3 font-normal">
                  {meta.type}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <ScrollArea className="flex-1">
            <div className="space-y-9 px-8 py-9">
              <Section label="Description">
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  {meta.description}
                </p>
              </Section>

              <Separator />

              {parent && (
                <>
                  <Section label="Parent">
                    <ConnectionList items={[parent]} />
                  </Section>
                  <Separator />
                </>
              )}

              <Section label="Children">
                <ConnectionList items={children} />
              </Section>

              <Separator />

              <Section label="Relations">
                <ConnectionList items={allRelations} />
              </Section>

              <Separator />

              <Section label="Mentions">
                <ConnectionList items={allMentions} />
              </Section>

              {explanations.length > 0 && (
                <>
                  <Separator />
                  <Section label="Why connected">
                    <div className="space-y-4">
                      {explanations.map((explanation) => (
                        <motion.div
                          key={explanation.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25 }}
                          className="rounded-2xl border border-border/50 bg-muted/10 px-5 py-4"
                        >
                          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            {explanation.heading}
                          </p>
                          <p className="mt-2 text-[13px] leading-relaxed text-foreground/80">
                            {explanation.text}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </Section>
                </>
              )}

              <Separator />

              <Section label="Connections">
                <Card className="rounded-2xl border-border/60 py-0 shadow-none">
                  <CardContent className="flex items-center justify-between px-5 py-4">
                    <span className="text-[13px] text-muted-foreground">Total linked</span>
                    <span className="text-2xl font-semibold tracking-tight text-foreground/90">
                      {connectionCount}
                    </span>
                  </CardContent>
                </Card>
              </Section>

              {timeline && (
                <>
                  <Separator />
                  <Section label="Timeline">
                    <div className="flex items-start gap-3 rounded-2xl border border-border/50 bg-muted/10 px-5 py-4">
                      <Clock className="mt-0.5 size-4 text-muted-foreground" />
                      <div className="space-y-1.5">
                        <p className="text-[13px] text-foreground/80">
                          Created {timeline.created}
                        </p>
                        <p className="text-[13px] text-muted-foreground">
                          Last edited {timeline.edited}
                        </p>
                      </div>
                    </div>
                  </Section>
                </>
              )}
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
          className="flex w-[360px] shrink-0 flex-col items-center justify-center border-l border-border/60 bg-muted/5 px-8 text-center"
        >
          <div className="max-w-[240px]">
            <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-muted/40">
              <span className="text-2xl opacity-60">✦</span>
            </div>
            <p className="text-sm font-medium text-foreground/80">Select a page</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Explore your ideas on the canvas, or press ⌘K to jump anywhere.
            </p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
