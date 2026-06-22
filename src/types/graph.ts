import type { Edge, Node } from '@xyflow/react';

export type EdgeType = 'parent' | 'relation' | 'mention';

export interface GraphNodeData {
  label: string;
  pageId: string;
  parentId?: string;
  icon?: string;
  preview: string;
  tags: string[];
  relationCount: number;
  mentionCount: number;
  linkCount: number;
  editedLabel: string;
  dimmed?: boolean;
  dimOpacity?: number;
  onPath?: boolean;
  [key: string]: unknown;
}

export interface GraphEdgeData {
  edgeType: EdgeType;
  [key: string]: unknown;
}

export type GraphNode = Node<GraphNodeData, 'pageNode'>;
export type GraphEdge = Edge<GraphEdgeData>;

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
