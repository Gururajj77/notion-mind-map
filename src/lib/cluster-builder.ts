import type { NotionPage } from '../types/notion';
import type { GraphNode } from '../types/graph';
import { NODE_HEIGHT, NODE_WIDTH } from '../services/dagre-layout';

export interface Cluster {
  id: string;
  label: string;
  nodeIds: string[];
}

const CLUSTER_PADDING = 36;

export function buildClusters(pages: NotionPage[]): Cluster[] {
  const clusters: Cluster[] = [];
  const childrenByParent = new Map<string, NotionPage[]>();

  for (const page of pages) {
    if (!page.parentId) continue;
    const siblings = childrenByParent.get(page.parentId) ?? [];
    siblings.push(page);
    childrenByParent.set(page.parentId, siblings);
  }

  for (const [parentId, children] of childrenByParent) {
    if (children.length < 2) continue;
    const parent = pages.find((p) => p.id === parentId);
    clusters.push({
      id: `cluster-${parentId}`,
      label: parent ? `${parent.title} Cluster` : 'Cluster',
      nodeIds: [parentId, ...children.map((c) => c.id)],
    });
  }

  const roots = pages.filter((p) => p.parentId === null);
  for (const root of roots) {
    const descendants = pages.filter(
      (p) => p.id === root.id || isDescendant(p, root.id, pages),
    );
    if (descendants.length >= 3 && !clusters.some((c) => c.nodeIds.includes(root.id))) {
      clusters.push({
        id: `cluster-root-${root.id}`,
        label: `${root.title} Cluster`,
        nodeIds: descendants.map((d) => d.id),
      });
    }
  }

  return clusters;
}

function isDescendant(page: NotionPage, ancestorId: string, pages: NotionPage[]): boolean {
  let current = page.parentId;
  while (current) {
    if (current === ancestorId) return true;
    current = pages.find((p) => p.id === current)?.parentId;
  }
  return false;
}

export function getClusterCount(pages: NotionPage[]): number {
  return buildClusters(pages).length;
}

export interface ClusterBounds {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function computeClusterBounds(
  clusters: Cluster[],
  nodes: GraphNode[],
): ClusterBounds[] {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return clusters
    .map((cluster) => {
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
        x: minX - CLUSTER_PADDING,
        y: minY - CLUSTER_PADDING,
        width: maxX - minX + CLUSTER_PADDING * 2,
        height: maxY - minY + CLUSTER_PADDING * 2,
      };
    })
    .filter((b): b is ClusterBounds => b != null);
}
