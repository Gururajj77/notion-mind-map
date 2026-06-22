import { create } from 'zustand';
import type { NotionPage } from '../types/notion';

export type NodePosition = { x: number; y: number };
export type PositionOverrides = Record<string, NodePosition>;

interface AppState {
  pages: NotionPage[];
  selectedNodeId: string | null;
  focusMode: boolean;
  searchOpen: boolean;
  centerOnNodeId: string | null;
  darkMode: boolean;
  positionOverrides: PositionOverrides;
  positionPast: PositionOverrides[];
  positionFuture: PositionOverrides[];
  setPages: (pages: NotionPage[]) => void;
  selectNode: (id: string | null) => void;
  setFocusMode: (enabled: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setDarkMode: (enabled: boolean) => void;
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
  focusMode: false,
  searchOpen: false,
  centerOnNodeId: null,
  darkMode: false,
  positionOverrides: {},
  positionPast: [],
  positionFuture: [],
  setPages: (pages) => set({ pages }),
  selectNode: (id) => set({ selectedNodeId: id }),
  setFocusMode: (enabled) => set({ focusMode: enabled }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setDarkMode: (enabled) => {
    document.documentElement.classList.toggle('dark', enabled);
    set({ darkMode: enabled });
  },
  selectAndCenter: (id) =>
    set({ selectedNodeId: id, centerOnNodeId: id, searchOpen: false }),
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
