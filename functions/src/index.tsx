// ./functions/src/index.tsx

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import cors from "cors";
import { Request, Response } from "express";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { Feed } from "feed";
import { truncateDescription } from "@/utils/description"; // 유틸리티 함수 불러오기
import franc from 'franc';

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
    .replace(/[\u0300-\u036f]/g, '') // 발음 구별 기호 제거
    .replace(
      /[^a-zA-Z0-9\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7AF\u0E00-\u0E7F\u0900-\u097F\u0600-\u06FF\u0750-\u077F\u00C0-\u017F\u0400-\u04FF\u0370-\u03FF\u1F00-\u1FFF\u3040-\u30FF\u4E00-\u9FFF\s-]/g,
      ''
    ) // 허용된 문자 외 제거
    .replace(/\s+/g, '-') // 공백을 하이픈으로 변환
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

// 사이트맵 데이터 생성 함수
export const generateSitemap = onRequest(
  { region: "asia-northeast3" },
  async (request, response) => {
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

// 사이트맵 인덱스 생성 함수
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

// 문서의 언어를 감지하하기 위한 RSS에서 확인 가능한 언어 코드
// ISO 639-3 to ISO 639-1 language code mapping
const languageMap: { [key: string]: string } = {
  'afr': 'af', 'sqi': 'sq', 'amh': 'am', 'ara': 'ar', 'hye': 'hy',
  'aze': 'az', 'eus': 'eu', 'bel': 'be', 'ben': 'bn', 'bos': 'bs',
  'bul': 'bg', 'cat': 'ca', 'ceb': 'ceb', 'zho': 'zh', 'hrv': 'hr',
  'ces': 'cs', 'dan': 'da', 'nld': 'nl', 'eng': 'en', 'est': 'et',
  'fin': 'fi', 'fra': 'fr', 'glg': 'gl', 'kat': 'ka', 'deu': 'de',
  'ell': 'el', 'guj': 'gu', 'hau': 'ha', 'heb': 'he', 'hin': 'hi',
  'hun': 'hu', 'isl': 'is', 'ibo': 'ig', 'ind': 'id', 'gle': 'ga',
  'ita': 'it', 'jpn': 'ja', 'jav': 'jv', 'knc': 'kr', 'kan': 'kn',
  'kaz': 'kk', 'khm': 'km', 'kor': 'ko', 'kur': 'ku', 'lao': 'lo',
  'lav': 'lv', 'lit': 'lt', 'ltz': 'lb', 'mkd': 'mk', 'mlg': 'mg',
  'msa': 'ms', 'mal': 'ml', 'mlt': 'mt', 'mri': 'mi', 'mar': 'mr',
  'mon': 'mn', 'nep': 'ne', 'nor': 'no', 'ory': 'or', 'fas': 'fa',
  'pol': 'pl', 'por': 'pt', 'pan': 'pa', 'ron': 'ro', 'rus': 'ru',
  'srp': 'sr', 'sna': 'sn', 'slk': 'sk', 'slv': 'sl', 'som': 'so',
  'spa': 'es', 'sun': 'su', 'swa': 'sw', 'swe': 'sv', 'tgl': 'tl',
  'tam': 'ta', 'tel': 'te', 'tha': 'th', 'tur': 'tr', 'ukr': 'uk',
  'urd': 'ur', 'uzb': 'uz', 'vie': 'vi', 'cym': 'cy', 'yor': 'yo',
  'zul': 'zu'
};

function detectLanguage(text: string): string {
  const langCode = (franc as any).detect(text, { whitelist: Object.keys(languageMap) });
  return languageMap[langCode] || 'en'; // 매핑되지 않은 언어는 기본적으로 영어로 설정
}

// RSS 피드 생성 함수
export const generateRSS = onRequest(
  { region: "asia-northeast3" },
  async (request: Request, response: Response) => {
    corsHandler(request, response, async () => {
      try {
        const snapshot = await firestore.collection('detail').orderBy('작성날짜', 'desc').limit(10).get();
        const details = snapshot.docs.map(doc => doc.data());

        const feed = new Feed({
          title: "CalcWave RSS Feed",
          description: "Latest calculators and tools from CalcWave",
          id: "https://calcwave.com/",
          link: "https://calcwave.com/",
          language: "en", // 기본 언어를 영어로 설정
          image: "https://calcwave.com/favicon.ico",
          favicon: "https://calcwave.com/favicon.ico",
          updated: new Date(),
          generator: "Next.js and RSS Module",
          copyright: "All rights reserved 2024, CalcWave",
          ttl: 60,
          feedLinks: {
            json: "https://calcwave.com/json",
            atom: "https://calcwave.com/atom"
          },
          author: {
            name: "CalcWave Admin",
            email: "dolsol4@gmail.com",
            link: "https://calcwave.com"
          }
        });

        details.forEach(detail => {
          const shortDescription = truncateDescription(detail.계산기설명);
          const itemLanguage = detectLanguage(detail.계산기설명); // 각 아이템의 언어 감지
          feed.addItem({
            title: detail.계산기이름,
            id: `https://calcwave.com/detail/${detail.userId}/${detail.slug}`,
            link: `https://calcwave.com/detail/${detail.userId}/${detail.slug}`,
            description: shortDescription,
            content: detail.계산기설명,
            author: [
              {
                name: detail.작성자이름,
                email: detail.이메일,
                link: `https://calcwave.com/user/${detail.userId}`
              }
            ],
            date: detail.작성날짜.toDate(),
            extensions: [
              { name: "language", objects: [{ language: itemLanguage }] }
            ]
          });
        });

        const rss = feed.rss2();
        console.log('Generated RSS:', rss);

        response.setHeader('Content-Type', 'application/xml');
        response.status(200).send(rss);
      } catch (error) {
        logger.error("RSS 피드 생성 중 오류 발생:", error);
        response.status(500).json({ error: 'RSS 피드 생성에 실패하였습니다.' });
      }
    });
  }
);