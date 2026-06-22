export interface NotionPage {
  id: string;
  title: string;
  icon?: string;
  cover?: string;
  createdTime: string;
  lastEditedTime: string;
  parentId?: string;
  relationIds: string[];
  mentionIds: string[];
  tags: string[];
  pageContent: string;
}
