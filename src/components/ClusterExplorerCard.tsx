import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ClusterAccentBar } from '@/components/ClusterColorStrip';
import { getClusterTheme } from '@/lib/cluster-colors';
import type { ExplorerCluster } from '@/lib/explorer-clusters';
import { cn } from '@/lib/utils';

interface ClusterExplorerCardProps {
  cluster: ExplorerCluster;
  onClick: () => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  className?: string;
}

export default function ClusterExplorerCard({
  cluster,
  onClick,
  onHoverStart,
  onHoverEnd,
  className,
}: ClusterExplorerCardProps) {
  const theme = getClusterTheme(cluster.id);
  const color = theme?.color ?? '#94A3B8';

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      <Card
        className={cn(
          'relative cursor-pointer overflow-hidden rounded-xl border-border/60 py-0 shadow-none transition-colors hover:border-border hover:bg-accent/15',
          className,
        )}
        onClick={onClick}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
      >
        <ClusterAccentBar color={color} />
        <CardContent className="flex items-center justify-between py-3.5 pr-4 pl-5">
          <div>
            <p className="text-sm font-medium">{cluster.label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {cluster.nodeIds.length} nodes
            </p>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </CardContent>
      </Card>
    </motion.div>
  );
}
