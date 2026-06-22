import type { NotionPage } from '../types/notion';

/**
 * Raw Notion-like page objects. Sparse by design — no descriptions, types, or summaries.
 */
export const mockNotionPages: NotionPage[] = [
  {
    id: 'page_life',
    title: 'Life',
    icon: '🎯',
    createdTime: '2024-03-10T09:00:00.000Z',
    lastEditedTime: '2025-06-01T14:22:00.000Z',
    tags: ['goal'],
    relationIds: [],
    mentionIds: [],
    pageContent: '',
  },
  {
    id: 'page_career',
    title: 'Career',
    icon: '💼',
    createdTime: '2024-03-10T09:15:00.000Z',
    lastEditedTime: '2025-05-18T11:30:00.000Z',
    parentId: 'page_life',
    tags: ['career'],
    relationIds: [],
    mentionIds: [],
    pageContent: 'Work stuff.',
  },
  {
    id: 'page_knotcms',
    title: 'KnotCMS',
    icon: '🚀',
    createdTime: '2025-01-04T16:00:00.000Z',
    lastEditedTime: '2025-06-22T08:45:00.000Z',
    parentId: 'page_career',
    tags: ['project'],
    relationIds: ['page_financial'],
    mentionIds: ['page_content'],
    pageContent: `Building Framer CMS automation.

Goals:

- Remove manual sync
- Improve publishing`,
  },
  {
    id: 'page_ibm',
    title: 'IBM',
    createdTime: '2024-08-20T10:00:00.000Z',
    lastEditedTime: '2025-04-02T09:00:00.000Z',
    parentId: 'page_career',
    tags: ['career'],
    relationIds: [],
    mentionIds: [],
    pageContent: '',
  },
  {
    id: 'page_content',
    title: 'Content Creation',
    icon: '📚',
    createdTime: '2024-06-12T12:00:00.000Z',
    lastEditedTime: '2025-06-15T19:10:00.000Z',
    parentId: 'page_life',
    tags: [],
    relationIds: ['page_knotcms'],
    mentionIds: [],
    pageContent: `Notes on YouTube and writing.

Mentioned KnotCMS in last week's draft.`,
  },
  {
    id: 'page_financial',
    title: 'Financial Freedom',
    icon: '🎯',
    createdTime: '2024-01-02T08:00:00.000Z',
    lastEditedTime: '2025-03-28T07:00:00.000Z',
    tags: ['goal'],
    relationIds: [],
    mentionIds: [],
    pageContent: 'Savings targets\n\n- Emergency fund\n- Index funds',
  },
  {
    id: 'page_health',
    title: 'Health',
    icon: '❤️',
    createdTime: '2024-03-11T07:30:00.000Z',
    lastEditedTime: '2025-06-10T06:00:00.000Z',
    parentId: 'page_life',
    tags: ['health'],
    relationIds: [],
    mentionIds: [],
    pageContent: '',
  },
];
