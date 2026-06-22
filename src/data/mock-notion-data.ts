import type { NotionPage } from '../types/notion';

export const mockNotionPages: NotionPage[] = [
  {
    id: '1',
    title: 'Life',
    parentId: null,
    relations: [],
    mentions: [],
  },
  {
    id: '2',
    title: 'Career',
    parentId: '1',
    relations: [],
    mentions: [],
  },
  {
    id: '3',
    title: 'KnotCMS',
    parentId: '2',
    relations: ['6'],
    mentions: ['5'],
  },
  {
    id: '4',
    title: 'IBM',
    parentId: '2',
    relations: [],
    mentions: [],
  },
  {
    id: '5',
    title: 'Content Creation',
    parentId: '1',
    relations: ['3'],
    mentions: [],
  },
  {
    id: '6',
    title: 'Financial Freedom',
    parentId: null,
    relations: [],
    mentions: [],
  },
  {
    id: '7',
    title: 'Health',
    parentId: '1',
    relations: [],
    mentions: [],
  },
];
