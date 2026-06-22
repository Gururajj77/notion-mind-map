const DARK_MODE_KEY = 'mind-map:dark';

export function getInitialDarkMode(): boolean {
  try {
    const stored = localStorage.getItem(DARK_MODE_KEY);
    if (stored !== null) {
      return stored === 'true';
    }
  } catch {
    // ignore
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function applyDarkMode(enabled: boolean) {
  document.documentElement.classList.toggle('dark', enabled);
  try {
    localStorage.setItem(DARK_MODE_KEY, String(enabled));
  } catch {
    // ignore
  }
}
