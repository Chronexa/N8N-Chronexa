import { defineType, defineField } from 'sanity';

/**
 * Blog `post` — mirrors the migrated Framer Blog collection and is the shape the
 * n8n pipeline publishes into. Field names match scripts/import-blogs.mjs.
 */
export default defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category (legacy)',
      description:
        'DEPRECATED — superseded by industry/topic/format below. Kept only so nothing breaks mid-migration; will be removed.',
      type: 'string',
      options: { list: ['Blog', 'News', 'Resources'], layout: 'radio' },
      initialValue: 'Blog',
      readOnly: true,
      hidden: true,
    }),
    /**
     * Blog taxonomy — three orthogonal axes that drive the /blog index filters and
     * the /blog/industries/* + /blog/topics/* hub pages. Slugs here MUST match the
     * keys in src/lib/blog-taxonomy.ts; that file is the source of truth for labels
     * and for which buckets get an indexable hub page.
     */
    defineField({
      name: 'industry',
      title: 'Industry (who it is for)',
      description: 'The audience this post is written for. Drives /blog/industries/*.',
      type: 'string',
      options: {
        list: [
          { title: 'CPA & Accounting Firms', value: 'cpa-firms' },
          { title: 'Law Firms & Legal', value: 'law-firms' },
          { title: 'RIAs & Wealth Management', value: 'rias-wealth-management' },
          { title: 'Private Equity, VC & M&A', value: 'private-equity-vc' },
          { title: 'Insurance & Healthcare', value: 'insurance-healthcare' },
          { title: 'Sales & Revenue Teams', value: 'sales-revenue' },
          { title: 'Startups & Founders', value: 'startups' },
          { title: 'Cross-Industry & Business Teams', value: 'cross-industry' },
        ],
      },
      initialValue: 'cross-industry',
    }),
    defineField({
      name: 'topic',
      title: 'Topic (what it is about)',
      description: 'The subject matter. Drives /blog/topics/*.',
      type: 'string',
      options: {
        list: [
          { title: 'Document Intelligence & Data Extraction', value: 'document-intelligence' },
          { title: 'Compliance, Security & Data Sovereignty', value: 'compliance-security' },
          { title: 'AI Agents & Agentic Workflows', value: 'ai-agents' },
          { title: 'n8n & Automation Platforms', value: 'automation-platforms' },
          { title: 'Build vs Buy & Vendor Selection', value: 'build-vs-buy' },
          { title: 'Cost, Pricing & ROI', value: 'cost-pricing-roi' },
        ],
      },
    }),
    defineField({
      name: 'format',
      title: 'Format',
      description: 'The shape of the piece. A filter only — no hub page.',
      type: 'string',
      options: {
        list: [
          { title: 'Guide', value: 'guide' },
          { title: 'Comparison', value: 'comparison' },
          { title: 'Case study', value: 'case-study' },
          { title: 'Explainer', value: 'explainer' },
        ],
      },
      initialValue: 'guide',
    }),
    defineField({
      name: 'region',
      title: 'Region',
      description: 'Set ONLY for geo-specific posts (DIFC/ADGM, SEC/FINRA/IRS). Leave empty for global.',
      type: 'string',
      options: {
        list: [
          { title: 'UAE & the Gulf', value: 'uae-gulf' },
          { title: 'United States', value: 'united-states' },
        ],
      },
    }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({
      name: 'hero',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({ name: 'excerpt', title: 'Short Description', type: 'text', rows: 3 }),
    defineField({
      name: 'keyTakeaways',
      title: 'Key Takeaways',
      description: '3-5 one-sentence takeaways shown in a box at the top of the article (also what AI engines cite)',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (r) => r.max(5),
    }),
    defineField({ name: 'readingTime', title: 'Reading Time (min)', type: 'number' }),
    defineField({ name: 'publishedAt', title: 'Date', type: 'datetime' }),
    defineField({
      name: 'updatedAt',
      title: 'Updated (content revision)',
      description: 'Set ONLY when the content meaningfully changes — drives "Updated on" and schema dateModified',
      type: 'datetime',
    }),
    defineField({ name: 'body', title: 'Content', type: 'array', of: [{ type: 'block' }, { type: 'image' }, { type: 'htmlTable' }] }),
    defineField({ name: 'author', title: 'Author', type: 'reference', to: [{ type: 'author' }] }),
    defineField({ name: 'metaTitle', title: 'Meta Title (SEO)', type: 'string' }),
    defineField({ name: 'metaDescription', title: 'Meta Description (SEO)', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'title', industry: 'industry', topic: 'topic', media: 'hero' },
    prepare({ title, industry, topic, media }) {
      return { title, subtitle: [industry, topic].filter(Boolean).join(' · ') || 'unclassified', media };
    },
  },
});
