// ./functions/src/detail.ts

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import cors from "cors";
import { Request, Response } from "express";
import { getFirestore } from "firebase-admin/firestore";

// 주석테스트
// CORS 설정
const corsHandler = cors({ origin: true });
const firestore = getFirestore();

export const detail = onRequest(
  { region: "asia-northeast3" },
  async (request: Request, response: Response) => {
    corsHandler(request, response, async () => {
      const { userId, slug } = request.query;

      if (!userId || !slug) {
        response.status(400).json({ error: 'Invalid request' });
        return;
      }

      try {
        const decodedSlug = decodeURIComponent(slug as string);
        const q = firestore.collection('detail')
          .where('userId', '==', userId)
          .where('slug', '==', decodedSlug);
        const querySnapshot = await q.get();

        if (querySnapshot.empty) {
          response.status(404).json({ error: 'Document not found' });
        } else {
          const doc = querySnapshot.docs[0];
          response.json(doc.data());
        }
      } catch (error) {
        logger.error("문서 조회 중 오류 발생:", error);
        response.status(500).json({ error: '문서 조회에 실패하였습니다.' });
      }
    });
  }
);
