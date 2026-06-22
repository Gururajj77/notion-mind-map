export interface RecentEntry {
  id: string;
  openedAt: string;
}

const PINNED_KEY = 'mind-map:pinned';
const RECENT_KEY = 'mind-map:recent';
const MAX_RECENT = 8;

const DEFAULT_PINNED = ['page_health', 'page_ibm', 'page_knotcms'];

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadPinnedIds(): string[] {
  const stored = readJson<string[] | null>(PINNED_KEY, null);
  return stored && stored.length > 0 ? stored : DEFAULT_PINNED;
}

export function savePinnedIds(ids: string[]) {
  writeJson(PINNED_KEY, ids);
}

function migrateRecent(raw: unknown): RecentEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (typeof item === 'string') {
        return { id: item, openedAt: new Date().toISOString() };
      }
      if (item && typeof item === 'object' && 'id' in item) {
        const entry = item as RecentEntry;
        return {
          id: entry.id,
          openedAt: entry.openedAt ?? new Date().toISOString(),
        };
      }
      return null;
    })
    .filter((item): item is RecentEntry => item != null);
}

export function loadRecentEntries(): RecentEntry[] {
  return migrateRecent(readJson<unknown>(RECENT_KEY, []));
}

export function pushRecentEntry(id: string): RecentEntry[] {
  const current = loadRecentEntries().filter((item) => item.id !== id);
  const next: RecentEntry[] = [
    { id, openedAt: new Date().toISOString() },
    ...current,
  ].slice(0, MAX_RECENT);
  writeJson(RECENT_KEY, next);
  return next;
}
