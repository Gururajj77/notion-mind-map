import type { NotionPage } from "../types/notion";
import { mockNotionPagesStartup } from "./mock-notion-data-startup";
import { mockNotionPagesComplex } from "./mock-notion-data-complex";
import { mockNotionPages } from "./mock-notion-data";

/** Active dataset for the mind map. */
const ACTIVE_DATASET = mockNotionPagesStartup;

export async function fetchPages(): Promise<NotionPage[]> {
  return ACTIVE_DATASET;
}

export { mockNotionPages, mockNotionPagesComplex, mockNotionPagesStartup };
