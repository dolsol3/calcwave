// ./functions/src/login.ts

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import cors from "cors";
import { Request } from "express";
import { getFirestore } from "firebase-admin/firestore";

// CORS 설정
const corsHandler = cors({ origin: true });
const firestore = getFirestore();

export const login = onRequest(
  { region: "asia-northeast3" },
  async (request: Request, response: any) => {
    corsHandler(request, response, async () => {
      const { uid, email, displayName, photoURL, userId } = request.body;

      try {
        const userDocRef = firestore.doc(`users/${uid}`);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
          // 문서가 이미 존재하는 경우 업데이트
          await userDocRef.update({ userId: userId });
        } else {
          // 문서가 존재하지 않는 경우 새로 생성
          await userDocRef.set({
            uid,
            email,
            displayName,
            photoURL,
            userId,
          });
        }

        response.json({ success: true });
      } catch (error) {
        logger.error("사용자 정보 저장 중 오류 발생:", error);
        response.status(500).json({ error: '사용자 정보 저장에 실패하였습니다.' });
      }
    });
  }
);
