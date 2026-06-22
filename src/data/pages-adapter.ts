import type { NotionPage } from "../types/notion";
import { mockNotionPagesComplex } from "./mock-notion-data-complex";
import { mockNotionPages } from "./mock-notion-data";

/** Set to `mockNotionPages` for the small 7-page graph. */
const ACTIVE_DATASET = mockNotionPagesComplex;

export async function fetchPages(): Promise<NotionPage[]> {
  return ACTIVE_DATASET;
}

export { mockNotionPages, mockNotionPagesComplex };
