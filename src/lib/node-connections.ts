import type { NotionPage } from '../types/notion';
import type { GraphEdge } from '../types/graph';

/** Immediate neighbors via parent, child, relation, or mention links. */
export function getConnectedNodeIds(pageId: string, pages: NotionPage[]): Set<string> {
  const pageMap = new Map(pages.map((p) => [p.id, p]));
  const page = pageMap.get(pageId);
  if (!page) {
    return new Set();
  }

  const ids = new Set<string>();

  if (page.parentId) {
    ids.add(page.parentId);
  }

  for (const child of pages) {
    if (child.parentId === pageId) {
      ids.add(child.id);
    }
  }

  for (const relationId of page.relationIds) {
    ids.add(relationId);
  }

  for (const mentionId of page.mentionIds) {
    ids.add(mentionId);
  }

  for (const other of pages) {
    if (other.relationIds.includes(pageId)) {
      ids.add(other.id);
    }
    if (other.mentionIds.includes(pageId)) {
      ids.add(other.id);
    }
  }

  return ids;
}

export function edgeTouchesNode(
  edge: GraphEdge,
  nodeId: string,
): boolean {
  return edge.source === nodeId || edge.target === nodeId;
}

export function edgeTouchesAnyNode(
  edge: GraphEdge,
  nodeIds: Set<string>,
): boolean {
  return nodeIds.has(edge.source) || nodeIds.has(edge.target);
}
