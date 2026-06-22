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
import type { GraphNodeData } from '../types/graph';

type PageNodeType = Node<GraphNodeData, 'pageNode'>;

function PageNodeComponent({ data, selected }: NodeProps<PageNodeType>) {
  const [hovered, setHovered] = useState(false);
  const isDimmed = data.dimmed && !selected;

  const shadow = selected
    ? '0 0 0 2px rgba(79, 110, 247, 0.5), 0 16px 40px -10px rgba(15, 23, 42, 0.22)'
    : hovered && !isDimmed
      ? '0 10px 28px -8px rgba(15, 23, 42, 0.16)'
      : '0 2px 10px -2px rgba(15, 23, 42, 0.08)';

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!size-2 !border-2 !border-card !bg-muted-foreground !opacity-0"
      />
      <Tooltip>
        <TooltipTrigger
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
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
              'w-[250px] rounded-2xl border bg-card px-5 py-4',
              selected ? 'border-blue-500/60' : 'border-border/70',
            )}
          >
            <div className="flex items-start gap-3">
              <span className="text-[22px] leading-none" aria-hidden>
                {data.emoji}
              </span>
              <div className="min-w-0 flex-1 space-y-2">
                <div>
                  <p className="truncate text-base font-semibold leading-tight text-card-foreground">
                    {data.label}
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-muted-foreground">
                    {data.description}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="h-5 rounded-md px-2 text-[10px] font-medium"
                >
                  {data.pageType}
                </Badge>
                <div className="flex flex-col gap-0.5 pt-0.5">
                  {data.relationCount > 0 && (
                    <p className="text-[11px] text-muted-foreground/80">
                      🔗 {data.relationCount} relation{data.relationCount === 1 ? '' : 's'}
                    </p>
                  )}
                  {data.mentionCount > 0 && (
                    <p className="text-[11px] text-muted-foreground/80">
                      📝 {data.mentionCount} mention{data.mentionCount === 1 ? '' : 's'}
                    </p>
                  )}
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
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {data.description}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline" className="h-5 text-[10px]">
              {data.pageType}
            </Badge>
            {(data.relationCount > 0 || data.mentionCount > 0) && (
              <span className="text-[10px] text-muted-foreground">
                {data.relationCount > 0 && `🔗 ${data.relationCount}`}
                {data.relationCount > 0 && data.mentionCount > 0 && ' · '}
                {data.mentionCount > 0 && `📝 ${data.mentionCount}`}
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
