import type { NotionPage } from '../types/notion';

export interface ConnectionExplanation {
  id: string;
  kind: 'relation' | 'mention' | 'mentioned-by';
  targetTitle: string;
  heading: string;
  text: string;
}

const RELATION_EXPLANATIONS: Record<string, Record<string, string>> = {
  KnotCMS: {
    'Financial Freedom':
      'Building KnotCMS is a direct path toward financial independence through product ownership.',
    'Content Creation':
      'Content creation supports distribution, learning in public, and audience building for the product.',
  },
  'Content Creation': {
    KnotCMS:
      'Content creation supports distribution and learning — KnotCMS is the product being shared.',
  },
};

const MENTION_EXPLANATIONS: Record<string, Record<string, string>> = {
  KnotCMS: {
    'Content Creation':
      'KnotCMS is frequently discussed inside content notes as the project being documented.',
  },
};

const MENTIONED_BY_EXPLANATIONS: Record<string, Record<string, string>> = {
  KnotCMS: {
    'Content Creation':
      'Content notes reference KnotCMS when writing about building and shipping in public.',
  },
};

export function getConnectionExplanations(
  page: NotionPage,
  pages: NotionPage[],
): ConnectionExplanation[] {
  const explanations: ConnectionExplanation[] = [];

  for (const relationId of page.relations) {
    const target = pages.find((p) => p.id === relationId);
    if (!target) continue;

    explanations.push({
      id: `relation-${relationId}`,
      kind: 'relation',
      targetTitle: target.title,
      heading: `Relation to ${target.title}`,
      text:
        RELATION_EXPLANATIONS[page.title]?.[target.title] ??
        `${page.title} is meaningfully linked to ${target.title} — these ideas inform each other.`,
    });
  }

  for (const mentionId of page.mentions) {
    const target = pages.find((p) => p.id === mentionId);
    if (!target) continue;

    explanations.push({
      id: `mention-${mentionId}`,
      kind: 'mention',
      targetTitle: target.title,
      heading: `Mention connection`,
      text:
        MENTION_EXPLANATIONS[page.title]?.[target.title] ??
        `${page.title} references ${target.title} in its notes and thinking.`,
    });
  }

  for (const other of pages) {
    if (!other.mentions.includes(page.id)) continue;

    explanations.push({
      id: `mentioned-by-${other.id}`,
      kind: 'mentioned-by',
      targetTitle: other.title,
      heading: `Mentioned in ${other.title}`,
      text:
        MENTIONED_BY_EXPLANATIONS[page.title]?.[other.title] ??
        `${other.title} frequently discusses ${page.title} in its notes.`,
    });
  }

  return explanations;
}

export function getMockTimeline(pageTitle: string) {
  const timelines: Record<string, { created: string; edited: string }> = {
    KnotCMS: { created: '2 days ago', edited: 'yesterday' },
    Career: { created: '3 weeks ago', edited: '3 days ago' },
    Life: { created: '2 months ago', edited: 'last week' },
  };

  return (
    timelines[pageTitle] ?? {
      created: '1 week ago',
      edited: '2 days ago',
    }
  );
}
