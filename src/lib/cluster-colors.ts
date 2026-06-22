import { EXPLORER_CLUSTER_ROOTS } from './cluster-config';
import { buildExplorerClusters } from './explorer-clusters';
import type { NotionPage } from '../types/notion';

export interface ClusterTheme {
  id: string;
  label: string;
  rootId: string;
  color: string;
  glow: string;
}

export const CLUSTER_THEMES: ClusterTheme[] = EXPLORER_CLUSTER_ROOTS.map(
  ({ id, label, rootId, color, glow }) => ({ id, label, rootId, color, glow }),
);

export const NEUTRAL_CLUSTER_COLOR = '#64748B';

export interface PageClusterColors {
  clusterId: string | null;
  clusterLabel: string | null;
  primary: string;
  /** Up to 3 strip segments: inherited primary + cross-cluster relation colors */
  colors: string[];
  extraCount: number;
}

const rootToTheme = new Map(CLUSTER_THEMES.map((t) => [t.rootId, t]));
const idToTheme = new Map(CLUSTER_THEMES.map((t) => [t.id, t]));

export function getClusterTheme(clusterId: string): ClusterTheme | undefined {
  return idToTheme.get(clusterId);
}

export function getClusterThemeByRoot(rootId: string): ClusterTheme | undefined {
  return rootToTheme.get(rootId);
}

function findHierarchyCluster(
  pageId: string,
  pageMap: Map<string, NotionPage>,
): ClusterTheme | null {
  let current = pageMap.get(pageId);
  const visited = new Set<string>();

  while (current && !visited.has(current.id)) {
    visited.add(current.id);
    const theme = rootToTheme.get(current.id);
    if (theme) return theme;
    current = current.parentId ? pageMap.get(current.parentId) : undefined;
  }

  return null;
}

function collectRelationClusterColors(
  page: NotionPage,
  pageMap: Map<string, NotionPage>,
  primaryClusterId: string | null,
): string[] {
  const relatedIds = new Set<string>([
    ...page.relationIds,
    ...[...pageMap.values()]
      .filter((p) => p.relationIds.includes(page.id))
      .map((p) => p.id),
  ]);

  const colors: string[] = [];
  for (const relatedId of relatedIds) {
    const theme = findHierarchyCluster(relatedId, pageMap);
    if (!theme || theme.id === primaryClusterId) continue;
    if (!colors.includes(theme.color)) {
      colors.push(theme.color);
    }
  }
  return colors;
}

export function buildPageClusterColorMap(
  pages: NotionPage[],
): Map<string, PageClusterColors> {
  const pageMap = new Map(pages.map((p) => [p.id, p]));
  const map = new Map<string, PageClusterColors>();

  for (const page of pages) {
    const hierarchy = findHierarchyCluster(page.id, pageMap);
    const primary = hierarchy?.color ?? NEUTRAL_CLUSTER_COLOR;
    const secondary = collectRelationClusterColors(
      page,
      pageMap,
      hierarchy?.id ?? null,
    );

    const allColors = [primary, ...secondary.filter((c) => c !== primary)];
    const unique = [...new Set(allColors)];
    const extraCount = Math.max(0, unique.length - 3);
    const colors = unique.slice(0, 3);

    map.set(page.id, {
      clusterId: hierarchy?.id ?? null,
      clusterLabel: hierarchy?.label ?? null,
      primary,
      colors,
      extraCount,
    });
  }

  return map;
}

export function getClusterDescendantIds(
  clusterId: string,
  pages: NotionPage[],
): Set<string> {
  const cluster = buildExplorerClusters(pages).find((c) => c.id === clusterId);
  return new Set(cluster?.nodeIds ?? []);
}
