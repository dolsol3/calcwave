// ./functions/src/increaseCalculationCount.ts

import { onRequest } from "firebase-functions/v2/https";
import * as admin from 'firebase-admin';
import * as logger from "firebase-functions/logger";
import cors from 'cors';
import { Request, Response } from 'express';

const corsHandler = cors({ origin: true });

export const increaseCalculationCount = onRequest(
  { region: "asia-northeast3" },
  async (request: Request, response: Response) => {
    corsHandler(request, response, async () => {
      const { userId, slug } = request.query;

      if (!userId || !slug) {
        response.status(400).json({ error: 'Invalid request parameters' });
        return;
      }

      try {
        const docRef = admin.firestore().collection('detail')
          .where('userId', '==', userId)
          .where('slug', '==', slug);

        const doc = await docRef.get();

        if (doc.empty) {
          response.status(404).json({ error: 'Document not found' });
          return;
        }

        const docId = doc.docs[0].id;
        const currentData = doc.docs[0].data();
        const currentCalcCount = currentData.계산횟수 || 0;

        await admin.firestore().collection('detail').doc(docId).update({
          계산횟수: currentCalcCount + 1
        });

        response.json({ success: true });
      } catch (error) {
        logger.error("Error increasing calculation count:", error);
        response.status(500).json({ error: 'Failed to increase calculation count' });
      }
    });
  }
);
