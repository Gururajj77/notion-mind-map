import { extractPreview } from './extract-preview';
import { formatRelativeEdit } from './format-time';
import type { NotionPage } from '../types/notion';

export const DEFAULT_PAGE_ICON = '📄';

export function getPageIcon(page: NotionPage): string {
  return page.icon ?? DEFAULT_PAGE_ICON;
}

export function getPagePreview(page: NotionPage): string {
  return extractPreview(page.pageContent);
}

export function getLinkCount(page: NotionPage): number {
  return page.relationIds.length + page.mentionIds.length;
}

export function getEditedLabel(page: NotionPage): string {
  return formatRelativeEdit(page.lastEditedTime);
}
