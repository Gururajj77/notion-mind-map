import { ChevronRight } from 'lucide-react';
import { getBreadcrumb } from '@/services/visibility';
import { useAppStore } from '@/store/app-store';

export default function BreadcrumbNav() {
  const pages = useAppStore((s) => s.pages);
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);
  const graphLevel = useAppStore((s) => s.graphLevel);
  const exploreNode = useAppStore((s) => s.exploreNode);
  const goHome = useAppStore((s) => s.goHome);

  if (graphLevel === 0 || !selectedNodeId) {
    return null;
  }

  const crumbs = getBreadcrumb(pages, selectedNodeId);

  return (
    <nav className="surface-glass pointer-events-auto absolute left-1/2 top-5 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full px-4 py-2 text-sm shadow-sm">
      <button
        type="button"
        onClick={goHome}
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        Home
      </button>
      {crumbs.map((page) => (
        <span key={page.id} className="flex items-center gap-1">
          <ChevronRight className="size-3.5 text-muted-foreground/50" />
          <button
            type="button"
            onClick={() => exploreNode(page.id)}
            className={
              page.id === selectedNodeId
                ? 'font-medium text-foreground'
                : 'text-muted-foreground transition-colors hover:text-foreground'
            }
          >
            {page.title}
          </button>
        </span>
      ))}
    </nav>
  );
}
