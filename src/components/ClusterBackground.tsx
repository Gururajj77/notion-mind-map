import { ViewportPortal } from '@xyflow/react';
import type { ClusterBounds } from '@/lib/cluster-builder';

interface ClusterBackgroundProps {
  clusters: ClusterBounds[];
}

export default function ClusterBackground({ clusters }: ClusterBackgroundProps) {
  if (clusters.length === 0) {
    return null;
  }

  return (
    <ViewportPortal>
      {clusters.map((cluster) => (
        <div
          key={cluster.id}
          className="pointer-events-none absolute rounded-3xl border border-border/25 bg-muted/15 dark:border-border/20 dark:bg-muted/8"
          style={{
            left: cluster.x,
            top: cluster.y,
            width: cluster.width,
            height: cluster.height,
          }}
        >
          <span className="absolute left-5 top-4 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/50">
            {cluster.label}
          </span>
        </div>
      ))}
    </ViewportPortal>
  );
}
