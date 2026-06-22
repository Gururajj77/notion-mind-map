import { ViewportPortal } from '@xyflow/react';
import type { ExplorerClusterBounds } from '@/lib/explorer-clusters';

interface ClusterBackgroundProps {
  clusters: ExplorerClusterBounds[];
}

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) {
    return `rgba(100, 116, 139, ${alpha})`;
  }
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
          className="pointer-events-none absolute rounded-[32px]"
          style={{
            left: cluster.x,
            top: cluster.y,
            width: cluster.width,
            height: cluster.height,
            backgroundColor: hexToRgba(cluster.color, 0.04),
          }}
        >
          <span
            className="absolute left-6 top-5 text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: hexToRgba(cluster.color, 0.35) }}
          >
            {cluster.label}
          </span>
        </div>
      ))}
    </ViewportPortal>
  );
}
