import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '@/store/app-store';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command';
import PageAvatar from '@/components/PageAvatar';
import type { NotionPage } from '@/types/notion';

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
      <mark className="rounded-sm bg-primary/15 px-0.5 text-foreground dark:bg-primary/25">
        {match}
      </mark>
      {after}
    </span>
  );
}

function matchesQuery(page: NotionPage, query: string): boolean {
  const haystack = [page.title, ...page.tags, page.pageContent.slice(0, 200)]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

export default function SearchCommand() {
  const pages = useAppStore((s) => s.pages);
  const searchOpen = useAppStore((s) => s.searchOpen);
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const exploreNode = useAppStore((s) => s.exploreNode);
  const [query, setQuery] = useState('');

  const filteredPages = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return pages;
    }
    return pages.filter((page) => matchesQuery(page, normalized));
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

  const handleSelect = (pageId: string) => {
    exploreNode(pageId);
  };

  return (
    <CommandDialog
      open={searchOpen}
      onOpenChange={setSearchOpen}
      title="Search pages"
      description="Jump to any page in your workspace"
      className="max-w-lg"
    >
      <Command shouldFilter={false}>
        <CommandInput
          placeholder="Search pages..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No pages found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {filteredPages.map((page) => (
              <CommandItem
                key={page.id}
                value={page.id}
                keywords={[page.title, ...page.tags]}
                onSelect={() => handleSelect(page.id)}
                className="gap-3 rounded-lg py-3"
              >
                <PageAvatar page={page} initialClassName="size-8 text-sm" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium">
                    {highlightMatch(page.title, query)}
                  </span>
                  {page.tags.length > 0 && (
                    <span className="text-xs capitalize text-muted-foreground">
                      {page.tags.join(', ')}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
        <div className="border-t px-4 py-2.5">
          <CommandShortcut className="text-[11px] text-muted-foreground">
            ↑↓ navigate · ↵ open neighborhood · esc close
          </CommandShortcut>
        </div>
      </Command>
    </CommandDialog>
  );
}
