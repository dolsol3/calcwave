// ./functions/src/generateSitemapIndex.ts

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import cors from "cors";
import { getFirestore } from "firebase-admin/firestore";

// CORS 설정
const corsHandler = cors({ origin: true });
const firestore = getFirestore();

export const generateSitemapIndex = onRequest(
  { region: "asia-northeast3" },
  async (request, response) => {
    corsHandler(request, response, async () => {
      try {
        // 글의 총 개수 확인
        const totalDocsSnapshot = await firestore.collection('detail').get();
        const totalDocs = totalDocsSnapshot.size;

        // 40000개당 하나의 sitemap으로 나눔
        const docsPerSitemap = 40000;
        const sitemapCount = Math.ceil(totalDocs / docsPerSitemap);

        const sitemapIndex = `
          <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${Array.from({ length: sitemapCount }, (_, index) => {
              const lastModifiedDate = new Date().toISOString(); // 최신 수정 날짜를 현재 시간으로 설정
              return `
                <sitemap>
                  <loc>${`https://calcwave.com/api/sitemap/${index}`}</loc>
                  <lastmod>${lastModifiedDate}</lastmod>
                </sitemap>
              `;
            }).join('')}
          </sitemapindex>
        `;

        logger.info('Generated sitemap index XML:', sitemapIndex);

        response.setHeader('Content-Type', 'application/xml');
        response.status(200).end(sitemapIndex);
      } catch (error) {
        logger.error("사이트맵 인덱스 생성 중 오류 발생:", error);
        response.status(500).json({ error: '사이트맵 인덱스 생성에 실패하였습니다.' });
      }
    });
  }
);
