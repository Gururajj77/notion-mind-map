import { extractPreview } from './extract-preview';
import { formatRelativeEdit } from './format-time';
import type { NotionPage } from '../types/notion';

export function getPageIcon(page: NotionPage): string | undefined {
  return page.icon;
}

export function getPageInitial(page: NotionPage): string {
  const trimmed = page.title.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : '?';
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
