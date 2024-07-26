// ./app/robots.tsx

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/write',
    },
    sitemap: 'https://calcwave.com/sitemap-index.xml',
  };
}
