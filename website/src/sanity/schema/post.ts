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
      title: 'Category',
      type: 'string',
      options: { list: ['Blog', 'News', 'Resources'], layout: 'radio' },
      initialValue: 'Blog',
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
    select: { title: 'title', subtitle: 'category', media: 'hero' },
  },
});
