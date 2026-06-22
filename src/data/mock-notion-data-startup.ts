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
    createdTime: '2024-09-01T10:00:00.000Z',
    lastEditedTime: '2025-06-20T12:00:00.000Z',
    ...seed,
  };
}

/**
 * Startup / product development graph — KnotCMS-focused.
 * Five root clusters: Vision, Customers, Marketing, Product, Revenue.
 */
export const mockNotionPagesStartup: NotionPage[] = [
  // ── Vision ────────────────────────────────────────────────────────
  page({
    id: 'page_vision',
    title: 'Vision',
    tags: ['cluster', 'vision'],
    pageContent: 'Why the product exists and where it is headed.',
  }),
  page({
    id: 'page_independence',
    title: 'Independence',
    parentId: 'page_vision',
    tags: ['vision', 'goal'],
    relationIds: ['page_knotcms'],
    pageContent: 'Leave employment. Own the upside. KnotCMS is the vehicle.',
  }),
  page({
    id: 'page_product_dev',
    title: 'Product Development',
    parentId: 'page_vision',
    tags: ['vision', 'product'],
    pageContent: 'Ship useful software consistently. Learn from users every week.',
  }),
  page({
    id: 'page_build_public',
    title: 'Build in Public',
    parentId: 'page_vision',
    tags: ['vision', 'marketing'],
    relationIds: ['page_content_creation'],
    pageContent: 'Share progress openly. Turns development into distribution.',
  }),
  page({
    id: 'page_sustainable_income',
    title: 'Sustainable Income',
    parentId: 'page_vision',
    tags: ['vision', 'revenue'],
    relationIds: ['page_revenue'],
    pageContent: 'Recurring revenue that covers living costs without burning out.',
  }),

  // ── Product ───────────────────────────────────────────────────────
  page({
    id: 'page_product',
    title: 'Product',
    tags: ['cluster', 'product'],
    pageContent: 'What we build and ship.',
  }),
  page({
    id: 'page_knotcms',
    title: 'KnotCMS',
    parentId: 'page_product',
    tags: ['product', 'project'],
    relationIds: ['page_content_creation'],
    pageContent: `Framer CMS automation — sync content, publish faster, reduce manual work.

Core bet: designers and agencies need CMS without the pain.`,
    lastEditedTime: '2025-06-22T08:45:00.000Z',
  }),
  page({
    id: 'page_pricing',
    title: 'Pricing',
    parentId: 'page_product',
    tags: ['product', 'revenue'],
    relationIds: ['page_revenue'],
    pageContent: 'Free tier for discovery. Pro for teams. AppSumo for acquisition bursts.',
  }),
  page({
    id: 'page_auto_publish',
    title: 'Auto Publish',
    parentId: 'page_product',
    tags: ['product', 'feature'],
    pageContent: 'Scheduled and webhook-driven publishing to Framer sites.',
  }),
  page({
    id: 'page_existing_cms',
    title: 'Existing CMS Support',
    parentId: 'page_product',
    tags: ['product', 'feature'],
    pageContent: 'Import from Webflow, Notion, Airtable. Agencies need migration paths.',
  }),

  // ── Marketing ─────────────────────────────────────────────────────
  page({
    id: 'page_marketing',
    title: 'Marketing',
    tags: ['cluster', 'marketing'],
    pageContent: 'Channels that create awareness and demand.',
  }),
  page({
    id: 'page_youtube',
    title: 'YouTube',
    parentId: 'page_marketing',
    tags: ['marketing', 'channel'],
    relationIds: ['page_distribution'],
    pageContent: 'Tutorials, build logs, Framer tips. Long-form trust building.',
  }),
  page({
    id: 'page_instagram',
    title: 'Instagram',
    parentId: 'page_marketing',
    tags: ['marketing', 'channel'],
    pageContent: 'Short demos and before/after site transformations.',
  }),
  page({
    id: 'page_framer_community',
    title: 'Framer Community',
    parentId: 'page_marketing',
    tags: ['marketing', 'channel'],
    pageContent: 'Templates, forum posts, community support presence.',
  }),
  page({
    id: 'page_product_hunt',
    title: 'Product Hunt',
    parentId: 'page_marketing',
    tags: ['marketing', 'channel'],
    pageContent: 'Launch spikes. Good for social proof and early adopters.',
  }),
  page({
    id: 'page_reddit',
    title: 'Reddit',
    parentId: 'page_marketing',
    tags: ['marketing', 'channel'],
    pageContent: 'r/framer, r/webdev — answer questions, share honestly.',
  }),
  page({
    id: 'page_peerlist',
    title: 'Peerlist',
    parentId: 'page_marketing',
    tags: ['marketing', 'channel'],
    pageContent: 'Maker community updates and milestone posts.',
  }),
  page({
    id: 'page_content_creation',
    title: 'Content Creation',
    parentId: 'page_marketing',
    tags: ['marketing', 'strategy'],
    relationIds: ['page_knotcms', 'page_youtube', 'page_build_public'],
    pageContent: 'The engine behind distribution. Every piece should tie back to the product.',
  }),
  page({
    id: 'page_distribution',
    title: 'Distribution',
    parentId: 'page_marketing',
    tags: ['marketing', 'strategy'],
    relationIds: ['page_revenue'],
    pageContent: 'Getting the right message in front of the right people — repeatedly.',
  }),

  // ── Customers ─────────────────────────────────────────────────────
  page({
    id: 'page_customers',
    title: 'Customers',
    tags: ['cluster', 'customers'],
    pageContent: 'Who pays, who adopts, who advocates.',
  }),
  page({
    id: 'page_framer_designers',
    title: 'Framer Designers',
    parentId: 'page_customers',
    tags: ['customers', 'segment'],
    pageContent: 'Solo designers shipping client sites. Need CMS without backend complexity.',
  }),
  page({
    id: 'page_agencies',
    title: 'Agencies',
    parentId: 'page_customers',
    tags: ['customers', 'segment'],
    relationIds: ['page_existing_cms'],
    pageContent: 'Multi-client workflows. Migration and white-label matter.',
  }),
  page({
    id: 'page_bloggers',
    title: 'Bloggers',
    parentId: 'page_customers',
    tags: ['customers', 'segment'],
    pageContent: 'Content-heavy sites on Framer. Publishing cadence is the pain.',
  }),
  page({
    id: 'page_template_creators',
    title: 'Template Creators',
    parentId: 'page_customers',
    tags: ['customers', 'segment'],
    relationIds: ['page_distribution'],
    pageContent: 'Sell templates with live CMS demos. Distribution partners.',
  }),

  // ── Revenue ───────────────────────────────────────────────────────
  page({
    id: 'page_revenue',
    title: 'Revenue',
    tags: ['cluster', 'revenue'],
    pageContent: 'How money flows in and scales.',
  }),
  page({
    id: 'page_free_plan',
    title: 'Free Plan',
    parentId: 'page_revenue',
    tags: ['revenue', 'pricing'],
    pageContent: 'Limited sites and publishes. Conversion funnel entry.',
  }),
  page({
    id: 'page_pro_plan',
    title: 'Pro Plan',
    parentId: 'page_revenue',
    tags: ['revenue', 'pricing'],
    pageContent: 'Unlimited sites, priority support, team seats.',
  }),
  page({
    id: 'page_appsumo',
    title: 'AppSumo',
    parentId: 'page_revenue',
    tags: ['revenue', 'channel'],
    relationIds: ['page_customer_acquisition'],
    pageContent: 'Lifetime deals for cash injection and user base growth.',
  }),
  page({
    id: 'page_affiliate',
    title: 'Affiliate Program',
    parentId: 'page_revenue',
    tags: ['revenue', 'channel'],
    pageContent: 'Template creators and YouTubers earn on referrals.',
  }),
  page({
    id: 'page_customer_acquisition',
    title: 'Customer Acquisition',
    parentId: 'page_revenue',
    tags: ['revenue', 'strategy'],
    pageContent: 'Paid and organic paths to new signups. AppSumo is the burst lever.',
  }),
];
