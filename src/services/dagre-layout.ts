import dagre from 'dagre';
import type { GraphEdge, GraphNode } from '../types/graph';

export const NODE_WIDTH = 250;
export const NODE_HEIGHT = 130;

export function applyDagreLayout(nodes: GraphNode[], edges: GraphEdge[]): GraphNode[] {
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({
    rankdir: 'TB',
    nodesep: 144,
    ranksep: 144,
    marginx: 80,
    marginy: 72,
  });

  for (const node of nodes) {
    graph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }

  const layoutEdges = edges.filter((edge) => edge.data?.edgeType === 'parent');
  for (const edge of layoutEdges) {
    graph.setEdge(edge.source, edge.target);
  }

  dagre.layout(graph);

  const connectedIds = new Set<string>();
  for (const edge of layoutEdges) {
    connectedIds.add(edge.source);
    connectedIds.add(edge.target);
  }

  let orphanOffsetX = 0;
  for (const node of nodes) {
    const dagreNode = graph.node(node.id);
    if (dagreNode?.x != null && connectedIds.has(node.id)) {
      orphanOffsetX = Math.max(orphanOffsetX, dagreNode.x + NODE_WIDTH / 2 + 200);
    }
  }

  let orphanIndex = 0;

  return nodes.map((node) => {
    const dagreNode = graph.node(node.id);

    if (dagreNode?.x != null && connectedIds.has(node.id)) {
      return {
        ...node,
        position: {
          x: dagreNode.x - NODE_WIDTH / 2,
          y: dagreNode.y - NODE_HEIGHT / 2,
        },
      };
    }

    const position = {
      x: orphanOffsetX + orphanIndex * (NODE_WIDTH + 80),
      y: 0,
    };
    orphanIndex += 1;

    return { ...node, position };
  });
}
