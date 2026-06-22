import type { NotionPage } from '../types/notion';
import { mockNotionPages } from './mock-notion-data';

export async function fetchPages(): Promise<NotionPage[]> {
  return mockNotionPages;
}
