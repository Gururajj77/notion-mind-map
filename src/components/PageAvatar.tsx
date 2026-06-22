import { cn } from '@/lib/utils';
import { getPageIcon, getPageInitial } from '@/lib/page-display';
import type { NotionPage } from '@/types/notion';

interface PageAvatarProps {
  page: NotionPage;
  className?: string;
  initialClassName?: string;
}

export default function PageAvatar({ page, className, initialClassName }: PageAvatarProps) {
  const icon = getPageIcon(page);

  if (icon) {
    return <span className={cn('leading-none', className)}>{icon}</span>;
  }

  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-md bg-muted font-medium text-muted-foreground',
        className,
        initialClassName,
      )}
    >
      {getPageInitial(page)}
    </span>
  );
}
