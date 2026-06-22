/** Shared semantic cluster definitions for explorer cards and color inheritance. */
export const EXPLORER_CLUSTER_ROOTS = [
  { id: 'cluster_vision', label: 'Vision', rootId: 'page_vision', color: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.45)' },
  { id: 'cluster_product', label: 'Product', rootId: 'page_product', color: '#3B82F6', glow: 'rgba(59, 130, 246, 0.45)' },
  { id: 'cluster_marketing', label: 'Marketing', rootId: 'page_marketing', color: '#F97316', glow: 'rgba(249, 115, 22, 0.45)' },
  { id: 'cluster_customers', label: 'Customers', rootId: 'page_customers', color: '#EC4899', glow: 'rgba(236, 72, 153, 0.45)' },
  { id: 'cluster_revenue', label: 'Revenue', rootId: 'page_revenue', color: '#22C55E', glow: 'rgba(34, 197, 94, 0.45)' },
] as const;
