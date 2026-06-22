import { create } from 'zustand';
import type { NotionPage } from '../types/notion';
import type { GraphLevel } from '../types/exploration';
import {
  loadPinnedIds,
  loadRecentEntries,
  pushRecentEntry,
  savePinnedIds,
  type RecentEntry,
} from '../lib/local-persistence';
import { applyDarkMode, getInitialDarkMode } from '../lib/theme';

export type NodePosition = { x: number; y: number };
export type PositionOverrides = Record<string, NodePosition>;

interface AppState {
  pages: NotionPage[];
  selectedNodeId: string | null;
  graphLevel: GraphLevel;
  expandedClusterId: string | null;
  pathMode: boolean;
  searchOpen: boolean;
  centerOnNodeId: string | null;
  darkMode: boolean;
  hoveredNodeId: string | null;
  pinnedNodeIds: string[];
  recentEntries: RecentEntry[];
  positionOverrides: PositionOverrides;
  positionPast: PositionOverrides[];
  positionFuture: PositionOverrides[];
  setPages: (pages: NotionPage[]) => void;
  selectNode: (id: string | null) => void;
  exploreNode: (id: string) => void;
  goHome: () => void;
  expandCluster: (clusterId: string, rootId: string) => void;
  setGraphLevel: (level: GraphLevel) => void;
  setPathMode: (enabled: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setDarkMode: (enabled: boolean) => void;
  setHoveredNodeId: (id: string | null) => void;
  togglePin: (id: string) => void;
  selectAndCenter: (id: string) => void;
  clearCenter: () => void;
  commitPositionDrag: (nodeId: string, position: NodePosition) => void;
  undoPosition: () => void;
  redoPosition: () => void;
  canUndoPosition: () => boolean;
  canRedoPosition: () => boolean;
}

export const useAppStore = create<AppState>((set, get) => ({
  pages: [],
  selectedNodeId: null,
  graphLevel: 0,
  expandedClusterId: null,
  pathMode: false,
  searchOpen: false,
  centerOnNodeId: null,
  darkMode: getInitialDarkMode(),
  hoveredNodeId: null,
  pinnedNodeIds: loadPinnedIds(),
  recentEntries: loadRecentEntries(),
  positionOverrides: {},
  positionPast: [],
  positionFuture: [],
  setPages: (pages) => set({ pages }),
  selectNode: (id) => {
    if (id) {
      const recent = pushRecentEntry(id);
      set({ selectedNodeId: id, recentEntries: recent });
      return;
    }
    set({ selectedNodeId: null });
  },
  exploreNode: (id) => {
    const recent = pushRecentEntry(id);
    set({
      selectedNodeId: id,
      graphLevel: 1,
      expandedClusterId: null,
      pathMode: false,
      centerOnNodeId: id,
      recentEntries: recent,
      searchOpen: false,
    });
  },
  goHome: () =>
    set({
      selectedNodeId: null,
      graphLevel: 0,
      expandedClusterId: null,
      pathMode: false,
      centerOnNodeId: null,
      hoveredNodeId: null,
    }),
  expandCluster: (clusterId, rootId) => {
    const recent = pushRecentEntry(rootId);
    set({
      graphLevel: 2,
      expandedClusterId: clusterId,
      selectedNodeId: rootId,
      pathMode: false,
      centerOnNodeId: null,
      recentEntries: recent,
      searchOpen: false,
    });
  },
  setGraphLevel: (level) => {
    if (level === 0) {
      get().goHome();
      return;
    }
    if (level === 3) {
      set({ graphLevel: 3, pathMode: false, expandedClusterId: null });
      return;
    }
    set({ graphLevel: level });
  },
  setPathMode: (enabled) =>
    set({
      pathMode: enabled,
      graphLevel: enabled && get().selectedNodeId ? 1 : get().graphLevel,
      expandedClusterId: enabled ? null : get().expandedClusterId,
    }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setDarkMode: (enabled) => {
    applyDarkMode(enabled);
    set({ darkMode: enabled });
  },
  setHoveredNodeId: (id) => set({ hoveredNodeId: id }),
  togglePin: (id) => {
    const current = get().pinnedNodeIds;
    const next = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];
    savePinnedIds(next);
    set({ pinnedNodeIds: next });
  },
  selectAndCenter: (id) => get().exploreNode(id),
  clearCenter: () => set({ centerOnNodeId: null }),
  commitPositionDrag: (nodeId, position) => {
    set((state) => {
      const current = state.positionOverrides[nodeId];
      if (current?.x === position.x && current?.y === position.y) {
        return state;
      }

      return {
        positionPast: [...state.positionPast, { ...state.positionOverrides }],
        positionFuture: [],
        positionOverrides: {
          ...state.positionOverrides,
          [nodeId]: position,
        },
      };
    });
  },
  undoPosition: () => {
    set((state) => {
      if (state.positionPast.length === 0) {
        return state;
      }

      const previous = state.positionPast[state.positionPast.length - 1];
      return {
        positionPast: state.positionPast.slice(0, -1),
        positionFuture: [state.positionOverrides, ...state.positionFuture],
        positionOverrides: previous,
      };
    });
  },
  redoPosition: () => {
    set((state) => {
      if (state.positionFuture.length === 0) {
        return state;
      }

      const next = state.positionFuture[0];
      return {
        positionFuture: state.positionFuture.slice(1),
        positionPast: [...state.positionPast, state.positionOverrides],
        positionOverrides: next,
      };
    });
  },
  canUndoPosition: () => get().positionPast.length > 0,
  canRedoPosition: () => get().positionFuture.length > 0,
}));
