// ./functions/src/publish.ts

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import cors from "cors";
import { Request, Response } from "express";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const corsHandler = cors({ origin: true });
const firestore = getFirestore();
const auth = getAuth();

function generateSlug(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(
      /[^a-zA-Z0-9\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7AF\u0E00-\u0E7F\u0900-\u097F\u0600-\u06FF\u0750-\u077F\u00C0-\u017F\u0400-\u04FF\u0370-\u03FF\u1F00-\u1FFF\u3040-\u30FF\u4E00-\u9FFF\s-]/g,
      ''
    )
    .replace(/\s+/g, '-')
    .toLowerCase();
}

export const publish = onRequest(
  { region: "asia-northeast3" },
  async (request: Request, response: Response) => {
    corsHandler(request, response, async () => {
      const {
        title,
        description,
        hashtag,
        userName,
        userPicture,
      } = request.body;

      const authToken = request.headers.authorization?.split('Bearer ')[1];

      if (!authToken) {
        response.status(401).json({ error: 'Unauthorized' });
        return;
      }

      try {
        const decodedToken = await auth.verifyIdToken(authToken);
        const uid = decodedToken.uid;
        const email = decodedToken.email;

        if (!email) {
          response.status(400).json({ error: 'Email not found in token' });
          return;
        }

        const userId = email.split('@')[0];

        let slug = generateSlug(title);
        let slugExists = (await firestore.collection('detail').where('slug', '==', slug).get()).size > 0;

        let count = 1;
        while (slugExists) {
          slug = `${slug}-${count}`;
          slugExists = (await firestore.collection('detail').where('slug', '==', slug).get()).size > 0;
          count++;
        }

        const formattedDescription = description.split('\n').map((paragraph: string) => paragraph || "<br>");

        const docData = {
          계산기설명: formattedDescription,
          계산기이름: title,
          해시태그: hashtag ? hashtag.split(',').map((tag: string) => tag.trim()) : [],
          작성날짜: Timestamp.now(),
          작성자uid: uid,
          작성자이름: userName,
          userId: userId,
          프로필사진: userPicture,
          slug: slug,
          이메일: email,
          찜: 0,
          계산횟수: 0,
          방문자수: 0,
        };

        const docRef = await firestore.collection('detail').add(docData);
        response.json({ success: true, id: docRef.id, slug: docData.slug, userId: docData.userId });
      } catch (error) {
        logger.error("문서 발행 중 오류 발생:", error);
        response.status(500).json({ error: '문서 발행에 실패하였습니다.' });
      }
    });
  }
);