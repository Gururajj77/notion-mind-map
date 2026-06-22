import type { NotionPage } from '../types/notion';

type PageSeed = {
  id: string;
  title: string;
  parentId?: string;
  tags?: string[];
  relationIds?: string[];
  mentionIds?: string[];
  pageContent?: string;
  createdTime?: string;
  lastEditedTime?: string;
};

function page(seed: PageSeed): NotionPage {
  return {
    tags: [],
    relationIds: [],
    mentionIds: [],
    pageContent: '',
    createdTime: '2024-05-01T10:00:00.000Z',
    lastEditedTime: '2025-06-18T14:00:00.000Z',
    ...seed,
  };
}

/**
 * Small 7-page graph for quick iteration. Same domain shape as the complex dataset.
 * Switch via pages-adapter.ts.
 */
export const mockNotionPages: NotionPage[] = [
  page({
    id: 'page_life',
    title: 'Life',
    tags: ['goal'],
    createdTime: '2024-03-10T09:00:00.000Z',
    lastEditedTime: '2025-06-01T14:22:00.000Z',
  }),
  page({
    id: 'page_career',
    title: 'Career',
    parentId: 'page_life',
    tags: ['career'],
    pageContent: 'Work stuff.',
    createdTime: '2024-03-10T09:15:00.000Z',
    lastEditedTime: '2025-05-18T11:30:00.000Z',
  }),
  page({
    id: 'page_knotcms',
    title: 'KnotCMS',
    parentId: 'page_career',
    tags: ['project'],
    relationIds: ['page_financial'],
    mentionIds: ['page_content'],
    pageContent: `Building Framer CMS automation.

Goals:

- Remove manual sync
- Improve publishing`,
    createdTime: '2025-01-04T16:00:00.000Z',
    lastEditedTime: '2025-06-22T08:45:00.000Z',
  }),
  page({
    id: 'page_ibm',
    title: 'IBM',
    parentId: 'page_career',
    tags: ['career'],
    createdTime: '2024-08-20T10:00:00.000Z',
    lastEditedTime: '2025-04-02T09:00:00.000Z',
  }),
  page({
    id: 'page_content',
    title: 'Content Creation',
    parentId: 'page_life',
    relationIds: ['page_knotcms'],
    pageContent: `Notes on YouTube and writing.

Mentioned KnotCMS in last week's draft.`,
    createdTime: '2024-06-12T12:00:00.000Z',
    lastEditedTime: '2025-06-15T19:10:00.000Z',
  }),
  page({
    id: 'page_financial',
    title: 'Financial Freedom',
    tags: ['goal'],
    pageContent: 'Savings targets\n\n- Emergency fund\n- Index funds',
    createdTime: '2024-01-02T08:00:00.000Z',
    lastEditedTime: '2025-03-28T07:00:00.000Z',
  }),
  page({
    id: 'page_health',
    title: 'Health',
    parentId: 'page_life',
    tags: ['health'],
    createdTime: '2024-03-11T07:30:00.000Z',
    lastEditedTime: '2025-06-10T06:00:00.000Z',
  }),
];
