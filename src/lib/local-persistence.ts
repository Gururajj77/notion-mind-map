const PINNED_KEY = 'mind-map:pinned';
const RECENT_KEY = 'mind-map:recent';
const MAX_RECENT = 8;

const DEFAULT_PINNED = ['page_knotcms', 'page_financial', 'page_ibm', 'page_health'];

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

export function loadRecentIds(): string[] {
  return readJson<string[]>(RECENT_KEY, []);
}

export function pushRecentId(id: string): string[] {
  const current = loadRecentIds().filter((item) => item !== id);
  const next = [id, ...current].slice(0, MAX_RECENT);
  writeJson(RECENT_KEY, next);
  return next;
}
