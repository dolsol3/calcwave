// ./functions/src/generateSitemap.ts

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import cors from "cors";
import { Request, Response } from "express";
import { getFirestore } from "firebase-admin/firestore";

// 주석테스트
// CORS 설정
const corsHandler = cors({ origin: true });
const firestore = getFirestore();

export const generateSitemap = onRequest(
  { region: "asia-northeast3" },
  async (request: Request, response: Response) => {
    corsHandler(request, response, async () => {
      try {
        const { start, end } = request.query;
        if (!start || !end) {
          response.status(400).json({ error: 'Invalid query parameters' });
          return;
        }

        logger.info(`Generating sitemap for range: ${start} - ${end}`);

        // Firestore에서 데이터 조회
        const snapshot = await firestore.collection('detail')
          .orderBy('작성날짜')
          .limit(parseInt(end as string) - parseInt(start as string))
          .offset(parseInt(start as string))
          .get();
        const details = snapshot.docs.map(doc => doc.data());

        logger.info(`Fetched ${details.length} documents for sitemap`);

        // 사이트맵 데이터를 생성
        const sitemapXml = `
          <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${details.map(detail => `
              <url>
                <loc>${`https://calcwave.com/detail/${detail.userId}/${detail.slug}`}</loc>
                <lastmod>${detail.작성날짜.toDate().toISOString()}</lastmod>
              </url>
            `).join('')}
          </urlset>
        `;

        logger.info('Generated sitemap XML:', sitemapXml);

        response.set('Content-Type', 'application/xml');
        response.status(200).send(sitemapXml);
      } catch (error) {
        logger.error("사이트맵 데이터 생성 중 오류 발생:", error);
        response.status(500).json({ error: '사이트맵 데이터 생성에 실패하였습니다.' });
      }
    });
  }
);
