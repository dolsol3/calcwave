// ./functions/src/generateRSS.ts

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import cors from "cors";
import { Request, Response } from "express";
import { getFirestore } from "firebase-admin/firestore";
import { Feed } from "feed";
import { truncateDescription } from "@/utils/description";
import franc from 'franc';
// 주석테스트
// CORS 설정
const corsHandler = cors({ origin: true });
const firestore = getFirestore();

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
