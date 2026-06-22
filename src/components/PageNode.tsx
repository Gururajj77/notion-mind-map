import { memo, useState } from 'react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import type { GraphNodeData } from '../types/graph';

type PageNodeType = Node<GraphNodeData, 'pageNode'>;

function PageNodeComponent({ data, selected }: NodeProps<PageNodeType>) {
  const [hovered, setHovered] = useState(false);
  const setHoveredNodeId = useAppStore((s) => s.setHoveredNodeId);
  const isDimmed = data.dimmed && !selected;
  const hasPreview = data.preview.length > 0;
  const hasTags = data.tags.length > 0;

  const shadow = selected
    ? 'var(--node-shadow-selected)'
    : hovered && !isDimmed
      ? 'var(--node-shadow-hover)'
      : 'var(--node-shadow)';

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!size-2 !border-2 !border-card !bg-muted-foreground !opacity-0"
      />
      <Tooltip>
        <TooltipTrigger
          onMouseEnter={() => {
            setHovered(true);
            setHoveredNodeId(data.pageId);
          }}
          onMouseLeave={() => {
            setHovered(false);
            setHoveredNodeId(null);
          }}
          className="block text-left"
        >
          <motion.div
            initial={false}
            animate={{
              scale: selected ? 1.02 : hovered && !isDimmed ? 1.02 : 1,
              opacity: isDimmed ? data.dimOpacity ?? 0.4 : 1,
              boxShadow: shadow,
            }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'w-[250px] rounded-2xl border bg-card px-5 py-4 transition-shadow',
              selected
                ? 'border-primary ring-2 ring-primary/30'
                : 'border-border/60',
            )}
          >
            <div className="flex items-start gap-3">
              {data.icon ? (
                <span className="text-[22px] leading-none" aria-hidden>
                  {data.icon}
                </span>
              ) : (
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-semibold text-muted-foreground"
                  aria-hidden
                >
                  {data.label.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="min-w-0 flex-1 space-y-2">
                <p className="truncate text-base font-semibold leading-tight text-card-foreground">
                  {data.label}
                </p>

                {hasPreview && (
                  <p className="line-clamp-2 text-[13px] leading-snug text-muted-foreground">
                    {data.preview}
                  </p>
                )}

                {hasTags && (
                  <div className="flex flex-wrap gap-1">
                    {data.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="h-5 rounded-md px-2 text-[10px] font-medium capitalize"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-0.5 pt-0.5 text-[11px] text-muted-foreground/80">
                  {data.linkCount > 0 && (
                    <p>
                      {data.linkCount} link{data.linkCount === 1 ? '' : 's'}
                    </p>
                  )}
                  <p>{data.editedLabel}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={12}
          className="max-w-[260px] rounded-xl border border-border/60 bg-popover px-4 py-3 text-popover-foreground shadow-lg [&>:last-child]:bg-popover [&>:last-child]:fill-popover"
        >
          <p className="text-sm font-semibold text-popover-foreground">{data.label}</p>
          {hasPreview && (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{data.preview}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {data.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="h-5 text-[10px] capitalize">
                {tag}
              </Badge>
            ))}
            {data.linkCount > 0 && (
              <span className="text-[10px] text-muted-foreground">
                {data.linkCount} link{data.linkCount === 1 ? '' : 's'}
              </span>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!size-2 !border-2 !border-card !bg-muted-foreground !opacity-0"
      />
    </>
  );
}

export default memo(PageNodeComponent);
