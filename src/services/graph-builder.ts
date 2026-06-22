import { MarkerType } from '@xyflow/react';
import { getClusterCount } from '../lib/cluster-builder';
import { buildPageClusterColorMap } from '../lib/cluster-colors';
import {
  getEditedLabel,
  getLinkCount,
  getPageIcon,
  getPagePreview,
} from '../lib/page-display';
import type { NotionPage } from '../types/notion';
import type { EdgeType, Graph, GraphEdge, GraphNode } from '../types/graph';
import { applyDagreLayout } from './dagre-layout';

function createEdge(
  source: string,
  target: string,
  edgeType: EdgeType,
  index: number,
): GraphEdge {
  if (edgeType === 'parent') {
    return {
      id: `${edgeType}-${source}-${target}-${index}`,
      source,
      target,
      type: 'smoothstep',
      data: { edgeType },
      style: {
        stroke: 'var(--edge-parent)',
        strokeWidth: 1,
        opacity: 0.12,
      },
      markerEnd: undefined,
      markerStart: undefined,
    };
  }

  if (edgeType === 'relation') {
    return {
      id: `${edgeType}-${source}-${target}-${index}`,
      source,
      target,
      type: 'default',
      data: { edgeType },
      style: {
        stroke: 'var(--edge-relation)',
        strokeWidth: 1.5,
        opacity: 0.35,
      },
      animated: false,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'var(--edge-relation)',
        width: 14,
        height: 14,
      },
      markerStart: {
        type: MarkerType.ArrowClosed,
        color: 'var(--edge-relation)',
        width: 14,
        height: 14,
      },
    };
  }

  return {
    id: `${edgeType}-${source}-${target}-${index}`,
    source,
    target,
    type: 'default',
    data: { edgeType },
    style: {
      stroke: 'var(--edge-mention)',
      strokeWidth: 1.5,
      strokeDasharray: '4 6',
      opacity: 0.4,
    },
    animated: false,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: 'var(--edge-mention)',
      width: 12,
      height: 12,
    },
    markerStart: {
      type: MarkerType.ArrowClosed,
      color: 'var(--edge-mention)',
      width: 12,
      height: 12,
    },
  };
}

function addUniqueEdge(
  edges: GraphEdge[],
  seen: Set<string>,
  source: string,
  target: string,
  edgeType: EdgeType,
) {
  const key = `${edgeType}:${source}:${target}`;
  const reverseKey = `${edgeType}:${target}:${source}`;

  if (seen.has(key) || (edgeType !== 'parent' && seen.has(reverseKey))) {
    return;
  }

  seen.add(key);
  edges.push(createEdge(source, target, edgeType, edges.length));
}

export function buildGraphNodes(pages: NotionPage[]): GraphNode[] {
  const clusterColors = buildPageClusterColorMap(pages);

  return pages.map((page) => {
    const cluster = clusterColors.get(page.id);

    return {
      id: page.id,
      position: { x: 0, y: 0 },
      data: {
        label: page.title,
        pageId: page.id,
        parentId: page.parentId,
        icon: getPageIcon(page),
        preview: getPagePreview(page),
        tags: page.tags,
        relationCount: page.relationIds.length,
        mentionCount: page.mentionIds.length,
        linkCount: getLinkCount(page),
        editedLabel: getEditedLabel(page),
        primaryClusterColor: cluster?.primary,
        clusterColors: cluster?.colors ?? [cluster?.primary ?? ''],
        clusterColorExtra: cluster?.extraCount ?? 0,
        clusterId: cluster?.clusterId ?? null,
      },
      type: 'pageNode',
    };
  });
}

export function buildGraphEdges(pages: NotionPage[]): GraphEdge[] {
  const pageIds = new Set(pages.map((p) => p.id));
  const edges: GraphEdge[] = [];
  const seen = new Set<string>();

  for (const page of pages) {
    if (page.parentId && pageIds.has(page.parentId)) {
      addUniqueEdge(edges, seen, page.parentId, page.id, 'parent');
    }

    for (const relationId of page.relationIds) {
      if (pageIds.has(relationId)) {
        addUniqueEdge(edges, seen, page.id, relationId, 'relation');
      }
    }

    for (const mentionId of page.mentionIds) {
      if (pageIds.has(mentionId)) {
        addUniqueEdge(edges, seen, page.id, mentionId, 'mention');
      }
    }
  }

  return edges;
}

export function buildGraph(pages: NotionPage[]): Graph {
  const nodes = buildGraphNodes(pages);
  const edges = buildGraphEdges(pages);
  const layoutedNodes = applyDagreLayout(nodes, edges);

  return { nodes: layoutedNodes, edges };
}

export function getPathToRoot(selectedId: string, pages: NotionPage[]): NotionPage[] {
  const pageMap = new Map(pages.map((p) => [p.id, p]));
  const path: NotionPage[] = [];
  let current = pageMap.get(selectedId);

  while (current) {
    path.unshift(current);
    current = current.parentId ? pageMap.get(current.parentId) : undefined;
  }

  return path;
}

export function getPathNodeIds(selectedId: string, pages: NotionPage[]): Set<string> {
  return new Set(getPathToRoot(selectedId, pages).map((p) => p.id));
}

export function getPathEdgePairs(
  selectedId: string,
  pages: NotionPage[],
): Array<{ source: string; target: string }> {
  const path = getPathToRoot(selectedId, pages);
  const pairs: Array<{ source: string; target: string }> = [];

  for (let i = 0; i < path.length - 1; i++) {
    pairs.push({ source: path[i].id, target: path[i + 1].id });
  }

  return pairs;
}

export function getFocusNodeIds(selectedId: string, pages: NotionPage[]): Set<string> {
  const pageMap = new Map(pages.map((p) => [p.id, p]));
  const selected = pageMap.get(selectedId);
  if (!selected) {
    return new Set();
  }

  const ids = new Set<string>([selectedId]);

  if (selected.parentId) {
    ids.add(selected.parentId);
  }

  for (const page of pages) {
    if (page.parentId === selectedId) {
      ids.add(page.id);
    }
  }

  for (const relationId of selected.relationIds) {
    ids.add(relationId);
  }

  for (const mentionId of selected.mentionIds) {
    ids.add(mentionId);
  }

  for (const page of pages) {
    if (page.relationIds.includes(selectedId)) {
      ids.add(page.id);
    }
    if (page.mentionIds.includes(selectedId)) {
      ids.add(page.id);
    }
  }

  return ids;
}

export function getGraphStats(pages: NotionPage[]) {
  let relationships = 0;
  let mentions = 0;

  for (const page of pages) {
    relationships += page.relationIds.length;
    mentions += page.mentionIds.length;
  }

  return {
    pages: pages.length,
    relationships,
    mentions,
    clusters: getClusterCount(pages),
  };
}

export function filterGraph(graph: Graph, visibleNodeIds: Set<string>): Graph {
  return {
    nodes: graph.nodes.filter((node) => visibleNodeIds.has(node.id)),
    edges: graph.edges.filter(
      (edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target),
    ),
  };
}
