import { EXPLORER_CLUSTER_ROOTS } from './cluster-config';
import { getClusterTheme } from './cluster-colors';
import type { NotionPage } from '../types/notion';
import type { GraphNode } from '../types/graph';
import { NODE_HEIGHT, NODE_WIDTH } from '../services/dagre-layout';

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
  const roots = EXPLORER_CLUSTER_ROOTS;

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

const CLUSTER_MAX = 20;

/** Breadth-first cap so cluster view stays readable (15–20 nodes). */
export function capClusterNodes(
  nodeIds: string[],
  rootId: string,
  pages: NotionPage[],
): string[] {
  if (nodeIds.length <= CLUSTER_MAX) {
    return nodeIds;
  }

  const allowed = new Set(nodeIds);
  const result: string[] = [];
  const queue = [rootId];
  const visited = new Set<string>();

  while (queue.length > 0 && result.length < CLUSTER_MAX) {
    const id = queue.shift()!;
    if (visited.has(id) || !allowed.has(id)) continue;
    visited.add(id);
    result.push(id);

    for (const page of pages) {
      if (page.parentId === id && allowed.has(page.id) && !visited.has(page.id)) {
        queue.push(page.id);
      }
    }
  }

  return result;
}

const REGION_PADDING = 56;

export interface ExplorerClusterBounds {
  id: string;
  label: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Soft Heptabase-style regions behind semantic clusters. */
export function computeExplorerClusterBounds(
  pages: NotionPage[],
  nodes: GraphNode[],
): ExplorerClusterBounds[] {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return buildExplorerClusters(pages)
    .map((cluster) => {
      const theme = getClusterTheme(cluster.id);
      const clusterNodes = cluster.nodeIds
        .map((id) => nodeMap.get(id))
        .filter((n): n is GraphNode => n != null);

      if (clusterNodes.length === 0) return null;

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      for (const node of clusterNodes) {
        minX = Math.min(minX, node.position.x);
        minY = Math.min(minY, node.position.y);
        maxX = Math.max(maxX, node.position.x + NODE_WIDTH);
        maxY = Math.max(maxY, node.position.y + NODE_HEIGHT);
      }

      return {
        id: cluster.id,
        label: cluster.label,
        color: theme?.color ?? '#64748B',
        x: minX - REGION_PADDING,
        y: minY - REGION_PADDING,
        width: maxX - minX + REGION_PADDING * 2,
        height: maxY - minY + REGION_PADDING * 2,
      };
    })
    .filter((b): b is ExplorerClusterBounds => b != null);
}
