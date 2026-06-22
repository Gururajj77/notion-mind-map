import type { NotionPage } from '../types/notion';

type PageSeed = {
  id: string;
  title: string;
  parentId?: string;
  icon?: string;
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
 * ~70 pages, 5 roots, 4 hierarchy levels, cross-links, sparse + messy content.
 * Switch via pages-adapter.ts.
 */
export const mockNotionPagesComplex: NotionPage[] = [
  // ── Roots ──────────────────────────────────────────────────────────
  page({ id: 'page_life', title: 'Life', icon: '🎯', tags: ['goal'], lastEditedTime: '2025-06-01T14:22:00.000Z' }),
  page({
    id: 'page_financial',
    title: 'Financial Freedom',
    icon: '🎯',
    tags: ['goal'],
    pageContent: 'Savings targets\n\n- Emergency fund\n- Index funds',
    createdTime: '2024-01-02T08:00:00.000Z',
  }),
  page({ id: 'page_learning', title: 'Learning', icon: '📚', tags: ['goal'], pageContent: 'Things I want to learn properly.' }),
  page({ id: 'page_home', title: 'Home', icon: '🏠', pageContent: '' }),
  page({ id: 'page_archive', title: 'Archive', icon: '🗄️', tags: ['archive'], pageContent: 'Old notes. Probably delete.' }),

  // ── Life → Career ──────────────────────────────────────────────────
  page({
    id: 'page_career',
    title: 'Career',
    icon: '💼',
    parentId: 'page_life',
    tags: ['career'],
    pageContent: 'Work stuff.',
    lastEditedTime: '2025-05-18T11:30:00.000Z',
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
    id: 'page_ibm_notes',
    title: 'IBM — Exit Notes',
    parentId: 'page_ibm',
    pageContent: 'Lessons from enterprise role.\n\n- Too many meetings\n- Good infra exposure',
  }),
  page({
    id: 'page_resume',
    title: 'Resume',
    parentId: 'page_career',
    tags: ['career'],
    relationIds: ['page_knotcms', 'page_framerschool'],
    pageContent: '2025 version draft.',
  }),
  page({
    id: 'page_interviews',
    title: 'Interview Prep',
    parentId: 'page_career',
    mentionIds: ['page_system_design'],
    pageContent: 'System design + behavioral.',
  }),
  page({
    id: 'page_networking',
    title: 'Networking',
    parentId: 'page_career',
    relationIds: ['page_content'],
    pageContent: '',
  }),

  // ── Life → Career → Projects ─────────────────────────────────────
  page({
    id: 'page_knotcms',
    title: 'KnotCMS',
    icon: '🚀',
    parentId: 'page_career',
    tags: ['project'],
    relationIds: ['page_financial', 'page_framerschool', 'page_plugin'],
    mentionIds: ['page_content', 'page_youtube'],
    pageContent: `Building Framer CMS automation.

Goals:

- Remove manual sync
- Improve publishing`,
    createdTime: '2025-01-04T16:00:00.000Z',
    lastEditedTime: '2025-06-22T08:45:00.000Z',
  }),
  page({
    id: 'page_knotcms_roadmap',
    title: 'KnotCMS Roadmap',
    parentId: 'page_knotcms',
    tags: ['project'],
    relationIds: ['page_knotcms_bugs'],
    pageContent: 'Q3 priorities.\n\n- Collections sync\n- Webhooks',
  }),
  page({
    id: 'page_knotcms_bugs',
    title: 'KnotCMS Bugs',
    parentId: 'page_knotcms',
    mentionIds: ['page_plugin'],
    pageContent: '- Sync fails on large assets\n- Draft mode edge case',
  }),
  page({
    id: 'page_knotcms_docs',
    title: 'KnotCMS Docs',
    parentId: 'page_knotcms',
    tags: ['project'],
    relationIds: ['page_blog_draft_knotcms'],
    pageContent: 'Docs site outline.',
  }),
  page({
    id: 'page_plugin',
    title: 'KnotCMS Plugin',
    parentId: 'page_knotcms',
    tags: ['project'],
    relationIds: ['page_knotcms', 'page_typescript'],
    pageContent: 'Framer plugin architecture notes.',
    lastEditedTime: '2025-06-21T16:00:00.000Z',
  }),
  page({
    id: 'page_knotcms_customers',
    title: 'KnotCMS Customers',
    parentId: 'page_knotcms',
    pageContent: 'Beta users list.\n\n- Agency A\n- Freelancer B',
  }),

  page({
    id: 'page_framerschool',
    title: 'Framer School',
    icon: '🎓',
    parentId: 'page_career',
    tags: ['project'],
    relationIds: ['page_knotcms', 'page_content'],
    mentionIds: ['page_youtube'],
    pageContent: 'Course platform for Framer builders.',
  }),
  page({
    id: 'page_framerschool_curriculum',
    title: 'Framer School Curriculum',
    parentId: 'page_framerschool',
    pageContent: 'Module 1: Components\nModule 2: CMS',
  }),
  page({
    id: 'page_framerschool_landing',
    title: 'Framer School Landing',
    parentId: 'page_framerschool',
    tags: ['project'],
    relationIds: ['page_website_redesign'],
  }),
  page({
    id: 'page_consulting',
    title: 'Consulting',
    parentId: 'page_career',
    tags: ['career'],
    pageContent: 'One-off client work.',
  }),

  // ── Life → Content ─────────────────────────────────────────────────
  page({
    id: 'page_content',
    title: 'Content Creation',
    icon: '📚',
    parentId: 'page_life',
    relationIds: ['page_knotcms', 'page_framerschool'],
    pageContent: `Notes on YouTube and writing.

Mentioned KnotCMS in last week's draft.`,
    lastEditedTime: '2025-06-15T19:10:00.000Z',
  }),
  page({
    id: 'page_youtube',
    title: 'YouTube',
    parentId: 'page_content',
    tags: ['content'],
    mentionIds: ['page_knotcms', 'page_framerschool'],
    pageContent: 'Video ideas backlog.',
  }),
  page({
    id: 'page_youtube_knotcms',
    title: 'YouTube — KnotCMS Demo',
    parentId: 'page_youtube',
    relationIds: ['page_knotcms'],
    pageContent: 'Script draft for sync demo.',
  }),
  page({
    id: 'page_newsletter',
    title: 'Newsletter',
    parentId: 'page_content',
    tags: ['content'],
    pageContent: 'Bi-weekly. Last issue performed ok.',
  }),
  page({
    id: 'page_twitter',
    title: 'Twitter / X',
    parentId: 'page_content',
    pageContent: '',
  }),
  page({
    id: 'page_blog',
    title: 'Blog',
    parentId: 'page_content',
    tags: ['content'],
    relationIds: ['page_blog_draft_knotcms'],
  }),
  page({
    id: 'page_blog_draft_knotcms',
    title: 'Blog Draft — Why Framer CMS',
    parentId: 'page_blog',
    mentionIds: ['page_knotcms_docs'],
    pageContent: 'Framer CMS is underrated for marketing sites.',
  }),

  // ── Life → Health ──────────────────────────────────────────────────
  page({
    id: 'page_health',
    title: 'Health',
    icon: '❤️',
    parentId: 'page_life',
    tags: ['health'],
    lastEditedTime: '2025-06-10T06:00:00.000Z',
  }),
  page({ id: 'page_sleep', title: 'Sleep', parentId: 'page_health', tags: ['health'], pageContent: 'Target: 7h30.' }),
  page({ id: 'page_exercise', title: 'Exercise', parentId: 'page_health', tags: ['health'], relationIds: ['page_running'] }),
  page({ id: 'page_running', title: 'Running', parentId: 'page_exercise', pageContent: 'C25K week 3.' }),
  page({ id: 'page_nutrition', title: 'Nutrition', parentId: 'page_health', pageContent: '' }),
  page({
    id: 'page_mental',
    title: 'Mental Health',
    parentId: 'page_health',
    tags: ['health'],
    mentionIds: ['page_journal'],
    pageContent: 'Therapy notes — private summary only.',
  }),

  // ── Life → Relationships / Home ops ──────────────────────────────
  page({
    id: 'page_relationships',
    title: 'Relationships',
    parentId: 'page_life',
    pageContent: 'Family + friends.',
  }),
  page({
    id: 'page_journal',
    title: 'Journal',
    parentId: 'page_life',
    mentionIds: ['page_mental'],
    pageContent: '2025-06-20\n\nFelt scattered. Graph idea helped.',
    lastEditedTime: '2025-06-20T22:00:00.000Z',
  }),

  // ── Home subtree ───────────────────────────────────────────────────
  page({ id: 'page_home_admin', title: 'Home Admin', parentId: 'page_home', pageContent: 'Bills, lease, insurance.' }),
  page({ id: 'page_home_renovation', title: 'Renovation', parentId: 'page_home', tags: ['home'], relationIds: ['page_budget'] }),
  page({ id: 'page_website_redesign', title: 'Personal Website', parentId: 'page_home', tags: ['project'], mentionIds: ['page_framerschool_landing'] }),

  // ── Financial subtree ──────────────────────────────────────────────
  page({ id: 'page_budget', title: 'Budget 2025', parentId: 'page_financial', tags: ['finance'], relationIds: ['page_knotcms'] }),
  page({ id: 'page_investments', title: 'Investments', parentId: 'page_financial', tags: ['finance'], pageContent: 'VTI, VXUS allocation.' }),
  page({ id: 'page_taxes', title: 'Taxes 2024', parentId: 'page_financial', pageContent: 'Filed. Owed a bit.' }),
  page({ id: 'page_runway', title: 'Runway Calc', parentId: 'page_financial', relationIds: ['page_knotcms', 'page_budget'], pageContent: '18 months at current burn.' }),

  // ── Learning subtree ───────────────────────────────────────────────
  page({ id: 'page_books', title: 'Books', parentId: 'page_learning', tags: ['learning'], pageContent: 'Reading list.' }),
  page({
    id: 'page_book_thinking',
    title: 'Thinking Fast and Slow',
    parentId: 'page_books',
    pageContent: 'Notes ch 1-3.',
  }),
  page({ id: 'page_courses', title: 'Courses', parentId: 'page_learning', tags: ['learning'] }),
  page({
    id: 'page_rust',
    title: 'Rust',
    parentId: 'page_learning',
    tags: ['learning'],
    relationIds: ['page_side_cli'],
    pageContent: 'Ownership is still confusing.',
  }),
  page({
    id: 'page_typescript',
    title: 'TypeScript',
    parentId: 'page_learning',
    tags: ['learning'],
    mentionIds: ['page_plugin'],
    pageContent: 'Advanced types for plugin SDK.',
  }),
  page({
    id: 'page_system_design',
    title: 'System Design',
    parentId: 'page_learning',
    relationIds: ['page_interviews', 'page_knotcms'],
    pageContent: 'Caching, queues, rate limits.',
  }),

  // ── Side projects (under Learning, messy) ────────────────────────
  page({ id: 'page_side_projects', title: 'Side Projects', parentId: 'page_learning', tags: ['project'] }),
  page({
    id: 'page_side_cli',
    title: 'CLI Tool',
    parentId: 'page_side_projects',
    relationIds: ['page_rust'],
    pageContent: 'Rename files in bulk. Never shipped.',
  }),
  page({
    id: 'page_side_ai',
    title: 'AI Experiments',
    parentId: 'page_side_projects',
    mentionIds: ['page_knotcms'],
    pageContent: 'Tried auto-tagging notes. Meh results.',
  }),
  page({ id: 'page_side_game', title: 'Tiny Game Jam', parentId: 'page_side_projects', pageContent: '' }),

  // ── Archive (stale links) ─────────────────────────────────────────
  page({ id: 'page_old_startup', title: 'Old Startup Idea', parentId: 'page_archive', tags: ['archive'], pageContent: '2019 idea. Dead.' }),
  page({
    id: 'page_old_blog',
    title: 'Old Blog Posts',
    parentId: 'page_archive',
    mentionIds: ['page_blog'],
    pageContent: 'Imported from Medium.',
  }),
  page({ id: 'page_college', title: 'College Notes', parentId: 'page_archive', pageContent: '' }),
  page({ id: 'page_internship_2018', title: 'Internship 2018', parentId: 'page_archive', tags: ['career'] }),

  // ── Orphan / floating pages (no parent — realistic mess) ───────────
  page({
    id: 'page_random_idea',
    title: 'Random Idea — Mind Map',
    icon: '💡',
    tags: ['project'],
    relationIds: ['page_knotcms', 'page_journal'],
    mentionIds: ['page_content'],
    pageContent: 'What if Notion pages were a graph?\n\nPrototype this.',
    lastEditedTime: '2025-06-23T09:00:00.000Z',
  }),
  page({
    id: 'page_meeting_notes',
    title: 'Meeting Notes (untitled)',
    pageContent: 'Call with Alex\n\n- pricing\n- timeline',
    lastEditedTime: '2025-06-19T11:00:00.000Z',
  }),
  page({
    id: 'page_shopping',
    title: 'Shopping List',
    icon: '🛒',
    pageContent: '- coffee\n- batteries',
  }),
  page({
    id: 'page_travel_japan',
    title: 'Japan Trip',
    icon: '✈️',
    tags: ['personal'],
    relationIds: ['page_budget'],
    pageContent: 'Kyoto + Tokyo. October?',
  }),
  page({
    id: 'page_contract_template',
    title: 'Contract Template',
    parentId: 'page_consulting',
    mentionIds: ['page_consulting'],
    pageContent: 'SOW template v2.',
  }),
  page({
    id: 'page_competitors',
    title: 'Competitors',
    parentId: 'page_knotcms',
    relationIds: ['page_framerschool'],
    pageContent: 'List of CMS tools in Framer ecosystem.',
  }),
  page({
    id: 'page_legal',
    title: 'Legal',
    parentId: 'page_knotcms',
    pageContent: 'Terms, privacy — need lawyer review.',
  }),
  page({
    id: 'page_analytics',
    title: 'Analytics Dashboard',
    parentId: 'page_knotcms',
    tags: ['project'],
    relationIds: ['page_knotcms_customers'],
  }),
  page({
    id: 'page_onboarding',
    title: 'User Onboarding',
    parentId: 'page_knotcms',
    mentionIds: ['page_knotcms_docs'],
    pageContent: 'First-run checklist for new workspaces.',
  }),
  page({
    id: 'page_podcast_idea',
    title: 'Podcast Idea',
    parentId: 'page_content',
    relationIds: ['page_youtube'],
    pageContent: '',
  }),
  page({
    id: 'page_design_inspiration',
    title: 'Design Inspiration',
    parentId: 'page_content',
    mentionIds: ['page_framerschool', 'page_website_redesign'],
    pageContent: 'Save screenshots here.',
  }),
  page({
    id: 'page_freelance_lead',
    title: 'Freelance Lead — Acme',
    parentId: 'page_consulting',
    relationIds: ['page_contract_template'],
    pageContent: 'Needs Framer site + CMS.',
    lastEditedTime: '2025-06-22T18:00:00.000Z',
  }),
  page({
    id: 'page_goals_2025',
    title: 'Goals 2025',
    parentId: 'page_life',
    tags: ['goal'],
    relationIds: ['page_financial', 'page_knotcms', 'page_health'],
    pageContent: 'Annual review.\n\n1. Ship KnotCMS\n2. Run half marathon\n3. Save 6mo runway',
  }),
  page({
    id: 'page_weekly_review',
    title: 'Weekly Review',
    parentId: 'page_journal',
    mentionIds: ['page_goals_2025', 'page_knotcms'],
    pageContent: 'Template for Sundays.',
    lastEditedTime: '2025-06-22T20:00:00.000Z',
  }),
  page({
    id: 'page_tool_stack',
    title: 'Tool Stack',
    relationIds: ['page_knotcms', 'page_notion_export'],
    pageContent: 'Notion, Framer, Vercel, Cloudflare.',
  }),
  page({
    id: 'page_notion_export',
    title: 'Notion Export Notes',
    icon: '📄',
    relationIds: ['page_random_idea'],
    mentionIds: ['page_knotcms'],
    pageContent: 'API limits and block types to handle.',
    lastEditedTime: '2025-06-23T10:30:00.000Z',
  }),
];
