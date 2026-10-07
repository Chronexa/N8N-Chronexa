import { getAllPosts } from '../../../sanity/client';
import { site } from '../../../lib/site';

export const revalidate = 3600;

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export async function GET() {
  const posts = (await getAllPosts()).slice(0, 50);
  const updated = posts[0]?.publishedAt || posts[0]?._createdAt || new Date().toISOString();
  const items = posts.map((post) => {
    const url = `${site.url}/blog/${post.slug.current}`;
    const published = post.publishedAt || post._createdAt || updated;
    return `
      <item>
        <title>${escapeXml(post.title)}</title>
        <link>${escapeXml(url)}</link>
        <guid isPermaLink="true">${escapeXml(url)}</guid>
        <pubDate>${new Date(published).toUTCString()}</pubDate>
        <description>${escapeXml(post.excerpt || post.metaDescription || '')}</description>
      </item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>${escapeXml(site.name)} Blog</title>
        <link>${escapeXml(`${site.url}/blog`)}</link>
        <description>Practical guides to AI agents and workflow automation for business teams.</description>
        <language>en-us</language>
        <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>${items}
      </channel>
    </rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
