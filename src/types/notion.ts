export interface NotionPage {
  id: string;
  title: string;
  parentId: string | null;
  relations: string[];
  mentions: string[];
}
