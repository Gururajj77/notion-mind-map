import { getExplorerCluster, capClusterNodes } from '../lib/explorer-clusters';
import type { GraphLevel } from '../types/exploration';
import type { NotionPage } from '../types/notion';
import type { EdgeType, GraphEdge } from '../types/graph';
import {
  getFocusNodeIds,
  getPathNodeIds,
  getPathToRoot,
} from './graph-builder';

const NEIGHBORHOOD_MAX = 10;

function capNeighborhood(centerId: string, pages: NotionPage[]): Set<string> {
  const pageMap = new Map(pages.map((p) => [p.id, p]));
  const center = pageMap.get(centerId);
  if (!center) {
    return new Set();
  }

  const result = new Set<string>([centerId]);
  const full = getFocusNodeIds(centerId, pages);

  if (center.parentId && full.has(center.parentId)) {
    result.add(center.parentId);
  }

  const children = pages.filter((p) => p.parentId === centerId).map((p) => p.id);
  for (const id of children) {
    if (result.size >= NEIGHBORHOOD_MAX) break;
    result.add(id);
  }

  const relationIds = [
    ...center.relationIds,
    ...pages.filter((p) => p.relationIds.includes(centerId)).map((p) => p.id),
  ];
  for (const id of relationIds) {
    if (result.size >= NEIGHBORHOOD_MAX) break;
    if (full.has(id)) result.add(id);
  }

  const mentionIds = [
    ...center.mentionIds,
    ...pages.filter((p) => p.mentionIds.includes(centerId)).map((p) => p.id),
  ];
  for (const id of mentionIds) {
    if (result.size >= NEIGHBORHOOD_MAX) break;
    if (full.has(id)) result.add(id);
  }

  return result;
}

export function getVisibleNodeIds(
  graphLevel: GraphLevel,
  selectedNodeId: string | null,
  expandedClusterId: string | null,
  pathMode: boolean,
  pages: NotionPage[],
): Set<string> | null {
  if (graphLevel === 0) {
    return new Set();
  }

  if (graphLevel === 3) {
    return null;
  }

  if (pathMode && selectedNodeId) {
    return getPathNodeIds(selectedNodeId, pages);
  }

  if (graphLevel === 2 && expandedClusterId) {
    const cluster = getExplorerCluster(expandedClusterId, pages);
    if (cluster) {
      return new Set(capClusterNodes(cluster.nodeIds, cluster.rootId, pages));
    }
  }

  if (graphLevel === 1 && selectedNodeId) {
    return capNeighborhood(selectedNodeId, pages);
  }

  if (selectedNodeId) {
    return capNeighborhood(selectedNodeId, pages);
  }

  return new Set();
}

export function shouldShowEdge(
  edge: GraphEdge,
  graphLevel: GraphLevel,
  visibleNodeIds: Set<string> | null,
  selectedNodeId: string | null,
  hoveredNodeId: string | null,
  pathMode: boolean,
  pathNodeIds: Set<string>,
): boolean {
  if (visibleNodeIds) {
    if (!visibleNodeIds.has(edge.source) || !visibleNodeIds.has(edge.target)) {
      return false;
    }
  }

  const edgeType = edge.data?.edgeType as EdgeType | undefined;

  if (graphLevel === 3) {
    return edgeType === 'parent';
  }

  if (edgeType === 'parent') {
    return true;
  }

  if (edgeType === 'mention') {
    return graphLevel === 1 || graphLevel === 2 || pathMode;
  }

  if (edgeType === 'relation') {
    if (graphLevel !== 1) {
      return false;
    }
    if (pathMode) {
      return pathNodeIds.has(edge.source) && pathNodeIds.has(edge.target);
    }
    const activeId = hoveredNodeId ?? selectedNodeId;
    if (!activeId) {
      return false;
    }
    return edge.source === activeId || edge.target === activeId;
  }

  return true;
}

export function getEdgeOpacity(
  edge: GraphEdge,
  graphLevel: GraphLevel,
  selectedNodeId: string | null,
  hoveredNodeId: string | null,
  pathMode: boolean,
  isPathEdge: boolean,
): number {
  const edgeType = edge.data?.edgeType as EdgeType | undefined;
  const base = (edge.style?.opacity as number | undefined) ?? 1;

  if (isPathEdge && pathMode) {
    return 1;
  }

  if (edgeType === 'parent') {
    return graphLevel === 3 ? 0.35 : 0.12;
  }

  if (edgeType === 'mention') {
    return 0.4;
  }

  if (edgeType === 'relation') {
    const activeId = hoveredNodeId ?? selectedNodeId;
    const touches =
      activeId && (edge.source === activeId || edge.target === activeId);
    return touches ? 0.85 : 0;
  }

  return base;
}

export function getBreadcrumb(pages: NotionPage[], selectedNodeId: string | null) {
  if (!selectedNodeId) {
    return [];
  }
  return getPathToRoot(selectedNodeId, pages);
}
