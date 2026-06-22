import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/app-store';

export default function GlobalViewWarning() {
  const graphLevel = useAppStore((s) => s.graphLevel);
  const goHome = useAppStore((s) => s.goHome);
  const exploreNode = useAppStore((s) => s.exploreNode);
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);

  if (graphLevel !== 3) {
    return null;
  }

  return (
    <div className="surface-glass pointer-events-auto absolute left-1/2 top-20 z-20 flex max-w-lg -translate-x-1/2 items-start gap-3 rounded-2xl border-amber-500/25 bg-amber-500/8 px-5 py-4 shadow-sm dark:border-amber-400/20 dark:bg-amber-400/8">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-300" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-amber-950 dark:text-amber-100">
          Experimental — Global View
        </p>
        <p className="mt-1 text-xs leading-relaxed text-amber-900/75 dark:text-amber-100/75">
          Large graphs become difficult to interpret. Use neighborhood or cluster views
          instead.
        </p>
        <div className="mt-3 flex gap-2">
          <Button size="sm" variant="outline" className="h-8 rounded-lg" onClick={goHome}>
            Back home
          </Button>
          {selectedNodeId && (
            <Button
              size="sm"
              className="h-8 rounded-lg"
              onClick={() => exploreNode(selectedNodeId)}
            >
              Focus selection
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
