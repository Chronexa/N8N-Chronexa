import { defineType, defineField } from 'sanity';

/**
 * A data table inside a blog post body, stored as sanitized HTML.
 * PortableText has no native table block; we keep the table markup verbatim
 * (clean <table>/<thead>/<tbody>/<tr>/<th>/<td> only) and render it with
 * dangerouslySetInnerHTML inside a styled, horizontally-scrollable wrapper.
 */
export default defineType({
  name: 'htmlTable',
  title: 'Table',
  type: 'object',
  fields: [
    defineField({ name: 'html', title: 'Table HTML', type: 'text', validation: (r) => r.required() }),
  ],
  preview: {
    select: { html: 'html' },
    prepare({ html }: { html?: string }) {
      const cells = (html?.match(/<t[dh][\s>]/g) || []).length;
      return { title: `Table (${cells} cells)` };
    },
  },
});
