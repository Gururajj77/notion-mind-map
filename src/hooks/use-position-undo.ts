import { useEffect } from 'react';
import { useAppStore } from '@/store/app-store';

export function usePositionUndoShortcuts() {
  const searchOpen = useAppStore((s) => s.searchOpen);
  const undoPosition = useAppStore((s) => s.undoPosition);
  const redoPosition = useAppStore((s) => s.redoPosition);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (searchOpen) {
        return;
      }

      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      const modifier = event.metaKey || event.ctrlKey;
      if (!modifier) {
        return;
      }

      if (event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undoPosition();
        return;
      }

      if ((event.key === 'z' && event.shiftKey) || event.key === 'y') {
        event.preventDefault();
        redoPosition();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [searchOpen, undoPosition, redoPosition]);
}
