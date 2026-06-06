import { defineType, defineField } from 'sanity';

/** Case study / portfolio entry — migrated from the Framer "Case Studies" collection. */
export default defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: 'thumb', title: 'Thumbnail', type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })] }),
    defineField({ name: 'logo', title: 'Client Logo', type: 'image', fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })] }),
    defineField({ name: 'overview', title: 'Overview', type: 'text', rows: 3 }),
    defineField({ name: 'projectType', title: 'Project Type', type: 'string' }),
    defineField({ name: 'serviceIncluded', title: 'Services Included', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'companyName', title: 'Company Name', type: 'string' }),
    defineField({ name: 'year', title: 'Year', type: 'string' }),
    defineField({ name: 'industry', title: 'Industry', type: 'string' }),
    defineField({ name: 'websiteName', title: 'Website Name', type: 'string' }),
    defineField({ name: 'websiteLink', title: 'Website Link', type: 'url' }),
    defineField({ name: 'content1', title: 'Content — Challenge', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
    defineField({ name: 'content2', title: 'Content — Results', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
    defineField({ name: 'testimonial', title: 'Testimonial', type: 'text', rows: 3 }),
    defineField({ name: 'client', title: 'Client Name', type: 'string' }),
    defineField({ name: 'clientDetails', title: 'Client Title/Details', type: 'string' }),
    defineField({ name: 'clientImage', title: 'Client Photo', type: 'image' }),
    defineField({ name: 'youtubeLink', title: 'YouTube Link', type: 'url' }),
    defineField({ name: 'stat1', title: 'Stat 1 (number)', type: 'string' }),
    defineField({ name: 'stat1Text', title: 'Stat 1 (label)', type: 'string' }),
    defineField({ name: 'stat2', title: 'Stat 2 (number)', type: 'string' }),
    defineField({ name: 'stat2Text', title: 'Stat 2 (label)', type: 'string' }),
  ],
  preview: { select: { title: 'title', subtitle: 'companyName', media: 'thumb' } },
});
