import { getExplorerCluster, capClusterNodes } from '../lib/explorer-clusters';
import { edgeTouchesAnyNode, edgeTouchesNode } from '../lib/node-connections';
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

function isFocusMode(graphLevel: GraphLevel, pathMode: boolean): boolean {
  return (graphLevel === 1 || graphLevel === 2) && !pathMode;
}

function getActiveNodeId(
  selectedNodeId: string | null,
  hoveredNodeId: string | null,
): string | null {
  return hoveredNodeId ?? selectedNodeId;
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
  const activeId = getActiveNodeId(selectedNodeId, hoveredNodeId);
  const focus = isFocusMode(graphLevel, pathMode);

  if (edgeType === 'parent') {
    return true;
  }

  if (edgeType === 'relation') {
    if (focus) {
      return true;
    }
    if (pathMode && edgeTouchesAnyNode(edge, pathNodeIds)) {
      return true;
    }
    if (activeId && edgeTouchesNode(edge, activeId)) {
      return true;
    }
    return graphLevel === 3;
  }

  if (edgeType === 'mention') {
    if (focus) {
      return true;
    }
    if (activeId && edgeTouchesNode(edge, activeId)) {
      return true;
    }
    return false;
  }

  return false;
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
  const activeId = getActiveNodeId(selectedNodeId, hoveredNodeId);
  const focus = isFocusMode(graphLevel, pathMode);
  const isSelected = Boolean(selectedNodeId && !hoveredNodeId);
  const touchesActive = Boolean(activeId && edgeTouchesNode(edge, activeId));

  if (edgeType === 'parent') {
    if (isPathEdge && pathMode) {
      return 0.45;
    }
    return 0.12;
  }

  if (edgeType === 'relation') {
    if (focus) {
      return 0.4;
    }
    if (touchesActive) {
      return isSelected ? 0.65 : 0.5;
    }
    if (graphLevel === 3) {
      return 0.18;
    }
    return 0;
  }

  if (edgeType === 'mention') {
    if (focus) {
      return 0.28;
    }
    if (touchesActive) {
      return isSelected ? 0.38 : 0.28;
    }
    return 0;
  }

  return 0;
}

export function getBreadcrumb(pages: NotionPage[], selectedNodeId: string | null) {
  if (!selectedNodeId) {
    return [];
  }
  return getPathToRoot(selectedNodeId, pages);
}
