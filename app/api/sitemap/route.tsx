// app/api/sitemap/route.tsx

import { NextResponse } from 'next/server';

export async function GET() {
  const response = await fetch('https://generateSitemapIndex-hry6fdb6aa-du.a.run.app/generateSitemapIndex');

  if (!response.ok) {
    console.error(`Failed to fetch sitemap index: ${response.statusText}`);
    return new NextResponse(`Failed to fetch sitemap index: ${response.statusText}`, { status: 500 });
  }

  const sitemapIndex = await response.text();
  console.log('Sitemap Index:', sitemapIndex);

  return new NextResponse(sitemapIndex, { headers: { 'Content-Type': 'application/xml' } });
}
