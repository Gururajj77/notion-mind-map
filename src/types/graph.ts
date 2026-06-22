import type { Edge, Node } from '@xyflow/react';

export type EdgeType = 'parent' | 'relation' | 'mention';

export interface GraphNodeData {
  label: string;
  pageId: string;
  parentId: string | null;
  relationCount: number;
  mentionCount: number;
  childCount: number;
  emoji: string;
  pageType: string;
  description: string;
  dimmed?: boolean;
  dimOpacity?: number;
  onPath?: boolean;
  [key: string]: unknown;
}

export interface GraphEdgeData {
  edgeType: EdgeType;
  [key: string]: unknown;
}

export type GraphNode = Node<GraphNodeData>;
export type GraphEdge = Edge<GraphEdgeData>;

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
