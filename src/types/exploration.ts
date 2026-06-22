export type GraphLevel = 0 | 1 | 2 | 3;

export const GRAPH_LEVEL_LABELS: Record<GraphLevel, string> = {
  0: 'Dashboard',
  1: 'Neighborhood',
  2: 'Cluster',
  3: 'Full Graph',
};
