import { defineType, defineField } from 'sanity';

/** Author — mirrors the Framer Blog author fields (name, role, about, avatar). */
export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', title: 'Role', type: 'string' }),
    defineField({ name: 'about', title: 'About', type: 'text', rows: 3 }),
    defineField({ name: 'avatar', title: 'Avatar', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url', description: 'Shown in the author box; also feeds Person schema sameAs (E-E-A-T)' }),
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'avatar' } },
});
