// app/api/sitemap/[id]/route.tsx

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface Params {
  id: string;
}

export async function GET(request: NextRequest, { params }: { params: Params }) {
  const { id } = params;
  const response = await fetch(`https://generatesitemap-hry6fdb6aa-du.a.run.app/generateSitemap?start=${parseInt(id) * 40000}&end=${parseInt(id) * 40000 + 40000}`);

  if (!response.ok) {
    console.error(`Failed to fetch sitemap: ${response.statusText}`);
    return new NextResponse(`Failed to fetch sitemap: ${response.statusText}`, { status: 500 });
  }

  const sitemap = await response.text();
  console.log('Sitemap:', sitemap);

  return new NextResponse(sitemap, { headers: { 'Content-Type': 'application/xml' } });
}
