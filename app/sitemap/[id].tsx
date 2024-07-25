// app/sitemap/[id].tsx

import { MetadataRoute } from 'next';

export async function generateSitemaps() {
  const totalEntries = await fetch('https://generatesitemap-hry6fdb6aa-du.a.run.app/generateSitemap?count=true').then(res => res.json());
  const sitemapCount = Math.ceil(totalEntries / 40000);

  return Array.from({ length: sitemapCount }, (_, id) => ({ id }));
}

export default async function sitemap({
  params: { id },
}: {
  params: { id: number };
}): Promise<MetadataRoute.Sitemap> {
  const start = id * 40000;
  const end = start + 40000;

  const response = await fetch(`https://generatesitemap-hry6fdb6aa-du.a.run.app/generateSitemap?start=${start}&end=${end}`);
  if (!response.ok) {
    throw new Error('Failed to fetch sitemap data');
  }
  const sitemaps = await response.json();

  return sitemaps.map((sitemap: { url: string; lastModified: string }) => ({
    url: sitemap.url,
    lastModified: sitemap.lastModified,
    changeFrequency: 'daily',
    priority: 0.7,
  }));
}
