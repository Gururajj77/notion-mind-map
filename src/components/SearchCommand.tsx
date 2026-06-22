import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '@/store/app-store';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command';
import { getPageMeta } from '@/lib/page-meta';

function highlightMatch(text: string, query: string) {
  if (!query.trim()) {
    return <span>{text}</span>;
  }

  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) {
    return <span>{text}</span>;
  }

  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);

  return (
    <span>
      {before}
      <mark className="rounded-sm bg-blue-100 px-0.5 text-foreground">{match}</mark>
      {after}
    </span>
  );
}

export default function SearchCommand() {
  const pages = useAppStore((s) => s.pages);
  const searchOpen = useAppStore((s) => s.searchOpen);
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const selectAndCenter = useAppStore((s) => s.selectAndCenter);
  const [query, setQuery] = useState('');

  const filteredPages = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return pages;
    }
    return pages.filter((page) => page.title.toLowerCase().includes(normalized));
  }, [pages, query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setSearchOpen(!searchOpen);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [searchOpen, setSearchOpen]);

  useEffect(() => {
    if (!searchOpen) {
      setQuery('');
    }
  }, [searchOpen]);

  return (
    <CommandDialog
      open={searchOpen}
      onOpenChange={setSearchOpen}
      title="Search pages"
      description="Jump to any page in your mind map"
      className="max-w-lg"
    >
      <CommandInput
        placeholder="Search pages..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No pages found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {filteredPages.map((page) => {
            const meta = getPageMeta(page.title);
            return (
              <CommandItem
                key={page.id}
                value={page.title}
                onSelect={() => selectAndCenter(page.id)}
                className="gap-3 rounded-lg py-3"
              >
                <span className="text-lg leading-none">{meta.emoji}</span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium">
                    {highlightMatch(page.title, query)}
                  </span>
                  <span className="text-xs text-muted-foreground">{meta.type}</span>
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
      <div className="border-t px-4 py-2.5">
        <CommandShortcut className="text-[11px] text-muted-foreground">
          ↑↓ navigate · ↵ jump to page · esc close
        </CommandShortcut>
      </div>
    </CommandDialog>
  );
}
