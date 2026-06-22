import { memo, useState } from 'react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import ClusterColorStrip from '@/components/ClusterColorStrip';
import { NEUTRAL_CLUSTER_COLOR } from '@/lib/cluster-colors';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import type { GraphNodeData } from '../types/graph';

type PageNodeType = Node<GraphNodeData, 'pageNode'>;

function PageNodeComponent({ data, selected }: NodeProps<PageNodeType>) {
  const [hovered, setHovered] = useState(false);
  const setHoveredNodeId = useAppStore((s) => s.setHoveredNodeId);
  const isDimmed = data.dimmed && !selected;
  const stripColors =
    data.clusterColors && data.clusterColors.length > 0
      ? data.clusterColors
      : data.primaryClusterColor
        ? [data.primaryClusterColor]
        : [NEUTRAL_CLUSTER_COLOR];
  const isActive = selected || hovered;

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!size-2 !border-2 !border-card !bg-muted-foreground !opacity-0"
      />
      <div
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
            opacity: isDimmed ? data.dimOpacity ?? 0.55 : 1,
            boxShadow: selected
              ? 'var(--node-shadow-selected)'
              : hovered && !isDimmed
                ? 'var(--node-shadow-hover)'
                : 'var(--node-shadow)',
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className={cn(
            'w-[250px] overflow-hidden rounded-2xl border bg-card',
            selected
              ? 'border-primary/50 ring-1 ring-primary/40'
              : isActive
                ? 'border-border/80'
                : 'border-border/60',
          )}
        >
          <ClusterColorStrip colors={stripColors} />

          <div className="space-y-2 px-5 py-4">
            <p className="truncate text-base font-semibold leading-tight text-card-foreground">
              {data.label}
            </p>

            {data.preview.length > 0 && (
              <p className="line-clamp-2 text-[13px] leading-snug text-muted-foreground">
                {data.preview}
              </p>
            )}

            <p className="text-[11px] text-muted-foreground/80">{data.editedLabel}</p>
          </div>
        </motion.div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!size-2 !border-2 !border-card !bg-muted-foreground !opacity-0"
      />
    </>
  );
}

export default memo(PageNodeComponent);
