// app/rss/route.tsx

import { NextResponse } from 'next/server';

export async function GET() {
  const response = await fetch('https://generaterss-hry6fdb6aa-du.a.run.app/generateRSS');
  
  if (!response.ok) {
    return new NextResponse(`Failed to fetch RSS feed: ${response.statusText}`, { status: 500 });
  }

  const rssFeed = await response.text();
  
  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
