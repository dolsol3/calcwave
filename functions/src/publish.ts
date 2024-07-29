// ./functions/src/publish.ts

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import cors from "cors";
import { Request, Response } from "express";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// CORS 설정
const corsHandler = cors({ origin: true });
const firestore = getFirestore();
const auth = getAuth();

function generateSlug(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // 발음 구별 기호 제거
    .replace(
      /[^a-zA-Z0-9\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7AF\u0E00-\u0E7F\u0900-\u097F\u0600-\u06FF\u0750-\u077F\u00C0-\u017F\u0400-\u04FF\u0370-\u03FF\u1F00-\u1FFF\u3040-\u30FF\u4E00-\u9FFF\s-]/g,
      ''
    ) // 허용된 문자 외 제거
    .replace(/\s+/g, '-') // 공백을 하이픈으로 변환
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
          초기값: element.id.startsWith('사용자입력변수') ? '0' : element.value || '0', //  input의 value는 0으로 고정 저장
        }));

        // 계산 수식에서 id가 input인 변수는 ID로 저장
        const expressionWithVariables = elements.map((el: any) => {
          if (el.type === 'input') {
            return el.id; // 입력 변수의 ID를 사용
          }
          return el.value;
        }).join(' ');

        // 줄바꿈을 <br>로 변환하여 description 저장
        const formattedDescription = description.split('\n').map((paragraph: string) => paragraph || "<br>");

        const docData = {
          계산결과: {
            결과이름: leftUnit,
            단위: rightUnit,
          },
          계산기설명: formattedDescription,
          계산기이름: title,
          해시태그: hashtag ? hashtag.split(',').map((tag: string) => tag.trim()) : [],
          계산수식: expressionWithVariables,
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
          이메일: email,
        };

        const docRef = await firestore.collection('detail').add(docData);
        response.json({ success: true, id: docRef.id, slug: docData.slug, userId: docData.userId }); // userId 포함
      } catch (error) {
        logger.error("문서 발행 중 오류 발생:", error);
        response.status(500).json({ error: '문서 발행에 실패하였습니다.' });
      }
    });
  }
);
