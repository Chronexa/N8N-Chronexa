import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './src/sanity/schema';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'up57bpxm';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export default defineConfig({
  name: 'chronexa',
  title: 'Chronexa CMS',
  projectId,
  dataset,
  basePath: '/studio',
  schema: { types: schemaTypes },
  plugins: [structureTool(), visionTool()],
});
