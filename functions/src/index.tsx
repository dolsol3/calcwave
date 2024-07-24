// ./functions/src/index.tsx

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import cors from "cors";
import { Request, Response } from "express";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// CORS 설정
const corsHandler = cors({ origin: true });

// Firebase Admin 자동 초기화
initializeApp();

const firestore = getFirestore();
const auth = getAuth();

// 슬러그 생성 함수
function generateSlug(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();
}

// 로그인 함수
export const login = onRequest(
  { region: "asia-northeast3" },
  async (request: Request, response: Response) => {
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

// 글 발행 함수
export const publish = onRequest(
  { region: "asia-northeast3" },
  async (request: Request, response: Response) => {
    corsHandler(request, response, async () => {
      const {
        title,
        description,
        hashtag,
        elements,
        leftUnit,
        rightUnit,
        prefixTexts,
        suffixTexts,
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

        const userId = email.split('@')[0]; // 이메일 주소의 앞부분 추출

        // 슬러그 생성 및 중복 확인
        let slug = generateSlug(title);
        let slugExists = (await firestore.collection('detail').where('slug', '==', slug).get()).size > 0;

        let count = 1;
        while (slugExists) {
          slug = `${slug}-${count}`;
          slugExists = (await firestore.collection('detail').where('slug', '==', slug).get()).size > 0;
          count++;
        }

        const inputVariables = elements.filter((el: any) => el.type === 'input').map((element: any) => ({
          입력변수아이디: element.id,
          변수단위이름: prefixTexts[element.id] || '',
          변수단위: suffixTexts[element.id] || '',
        }));

        const docData = {
          계산결과: {
            결과이름: leftUnit,
            단위: rightUnit,
          },
          계산기설명: description,
          계산기이름: title,
          해시태그: hashtag ? hashtag.split(',').map((tag: string) => tag.trim()) : [],
          계산수식: elements.map((el: any) => el.value).join(' '),
          계산횟수: '0',
          방문자수: '0',
          사용자입력변수: inputVariables,
          입력요소: elements,
          작성날짜: Timestamp.now(),
          작성자uid: uid,
          작성자이름: userName,
          userId: userId, // 이메일 주소의 앞부분 저장
          찜: '0',
          프로필사진: userPicture,
          slug: slug, // 슬러그 추가
        };

        const docRef = await firestore.collection('detail').add(docData);

        response.json({ success: true, id: docRef.id, slug: docData.slug });
      } catch (error) {
        logger.error("문서 발행 중 오류 발생:", error);
        response.status(500).json({ error: '문서 발행에 실패하였습니다.' });
      }
    });
  }
);

// 디테일 조회 함수
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
