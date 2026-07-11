import type { SchemaTypeDefinition } from 'sanity';
import post from './post';
import author from './author';
import caseStudy from './caseStudy';
import htmlTable from './htmlTable';

export const schemaTypes: SchemaTypeDefinition[] = [post, author, caseStudy, htmlTable];
