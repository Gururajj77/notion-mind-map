import { NEUTRAL_CLUSTER_COLOR } from '@/lib/cluster-colors';
import { cn } from '@/lib/utils';

interface ClusterColorStripProps {
  color?: string;
  colors?: string[];
  className?: string;
}

/** Segmented strip — inherited cluster + cross-cluster relation colors, no gradients. */
export default function ClusterColorStrip({ color, colors, className }: ClusterColorStripProps) {
  const segments =
    colors && colors.length > 0 ? colors : color ? [color] : [NEUTRAL_CLUSTER_COLOR];

  if (segments.length === 1) {
    return (
      <div
        className={cn('h-1 w-full shrink-0 rounded-t-2xl', className)}
        style={{ backgroundColor: segments[0] }}
        aria-hidden
      />
    );
  }

  return (
    <div
      className={cn('flex h-1 w-full shrink-0 overflow-hidden rounded-t-2xl', className)}
      aria-hidden
    >
      {segments.map((segmentColor, index) => (
        <span
          key={`${segmentColor}-${index}`}
          className="h-full min-w-0 flex-1"
          style={{ backgroundColor: segmentColor }}
        />
      ))}
    </div>
  );
}

interface ClusterAccentBarProps {
  color: string;
  className?: string;
}

export function ClusterAccentBar({ color, className }: ClusterAccentBarProps) {
  return (
    <span
      className={cn('absolute left-0 top-3 bottom-3 w-1 rounded-full', className)}
      style={{ backgroundColor: color }}
      aria-hidden
    />
  );
}
