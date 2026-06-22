export interface PageMeta {
  emoji: string;
  type: string;
  description: string;
}

const PAGE_META: Record<string, PageMeta> = {
  Life: {
    emoji: '🎯',
    type: 'Goal',
    description: 'Top-level life areas and long-term direction.',
  },
  Career: {
    emoji: '💼',
    type: 'Career',
    description: 'Professional growth, roles, and work-related notes.',
  },
  KnotCMS: {
    emoji: '🚀',
    type: 'Project',
    description: 'Building Framer CMS automation.',
  },
  IBM: {
    emoji: '💼',
    type: 'Career',
    description: 'Experience, learnings, and notes from IBM.',
  },
  'Content Creation': {
    emoji: '📚',
    type: 'Knowledge',
    description: 'Ideas, drafts, and publishing workflows.',
  },
  'Financial Freedom': {
    emoji: '🎯',
    type: 'Goal',
    description: 'Long-term financial independence and planning.',
  },
  Health: {
    emoji: '❤️',
    type: 'Health',
    description: 'Fitness, wellness, and personal health tracking.',
  },
};

export function getPageMeta(title: string): PageMeta {
  return (
    PAGE_META[title] ?? {
      emoji: '📄',
      type: 'Page',
      description: 'A connected note in your knowledge graph.',
    }
  );
}
