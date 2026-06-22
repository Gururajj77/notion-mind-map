import { create } from 'zustand';
import type { NotionPage } from '../types/notion';

interface AppState {
  pages: NotionPage[];
  selectedNodeId: string | null;
  focusMode: boolean;
  searchOpen: boolean;
  centerOnNodeId: string | null;
  darkMode: boolean;
  setPages: (pages: NotionPage[]) => void;
  selectNode: (id: string | null) => void;
  setFocusMode: (enabled: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setDarkMode: (enabled: boolean) => void;
  selectAndCenter: (id: string) => void;
  clearCenter: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  pages: [],
  selectedNodeId: null,
  focusMode: false,
  searchOpen: false,
  centerOnNodeId: null,
  darkMode: false,
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
}));
