import { motion } from 'framer-motion';

interface GraphStatsProps {
  nodes: number;
  relationships: number;
  clusters: number;
}

export default function GraphStats({ nodes, relationships, clusters }: GraphStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className="pointer-events-none absolute bottom-5 right-5 z-10 surface-glass rounded-2xl px-5 py-4"
    >
      <div className="flex flex-col gap-1.5">
        <p className="text-[11px] text-muted-foreground">
          <span className="font-medium text-foreground/60">{nodes}</span> Nodes
        </p>
        <p className="text-[11px] text-muted-foreground">
          <span className="font-medium text-foreground/60">{relationships}</span>{' '}
          Relationships
        </p>
        <p className="text-[11px] text-muted-foreground">
          <span className="font-medium text-foreground/60">{clusters}</span> Clusters
        </p>
      </div>
    </motion.div>
  );
}
