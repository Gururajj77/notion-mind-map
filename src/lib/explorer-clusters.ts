import type { NotionPage } from '../types/notion';

export interface ExplorerCluster {
  id: string;
  label: string;
  rootId: string;
  nodeIds: string[];
}

function collectDescendants(rootId: string, pages: NotionPage[]): string[] {
  const ids = new Set<string>([rootId]);
  let added = true;

  while (added) {
    added = false;
    for (const page of pages) {
      if (page.parentId && ids.has(page.parentId) && !ids.has(page.id)) {
        ids.add(page.id);
        added = true;
      }
    }
  }

  return [...ids];
}

function cluster(
  id: string,
  label: string,
  rootId: string,
  pages: NotionPage[],
): ExplorerCluster {
  return {
    id,
    label,
    rootId,
    nodeIds: collectDescendants(rootId, pages),
  };
}

/**
 * Semantic cluster cards for the home explorer (not canvas backgrounds).
 */
export function buildExplorerClusters(pages: NotionPage[]): ExplorerCluster[] {
  const pageIds = new Set(pages.map((p) => p.id));
  const roots = [
    { id: 'cluster_career', label: 'Career', rootId: 'page_career' },
    { id: 'cluster_creator', label: 'Creator', rootId: 'page_content' },
    { id: 'cluster_health', label: 'Health', rootId: 'page_health' },
    { id: 'cluster_learning', label: 'Learning', rootId: 'page_learning' },
    { id: 'cluster_financial', label: 'Relationships', rootId: 'page_financial' },
    { id: 'cluster_home', label: 'Home', rootId: 'page_home' },
  ];

  return roots
    .filter((r) => pageIds.has(r.rootId))
    .map((r) => cluster(r.id, r.label, r.rootId, pages))
    .filter((c) => c.nodeIds.length >= 2)
    .sort((a, b) => b.nodeIds.length - a.nodeIds.length);
}

export function getExplorerCluster(
  clusterId: string,
  pages: NotionPage[],
): ExplorerCluster | null {
  return buildExplorerClusters(pages).find((c) => c.id === clusterId) ?? null;
}
