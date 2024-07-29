// ./functions/src/index.tsx

// Firebase Admin SDK 초기화
import * as admin from 'firebase-admin';

admin.initializeApp(); // 서비스 계정 키 파일이 필요한 경우 옵션 추가

export { login } from "./login";
export { publish } from "./publish";
export { detail } from "./detail";
export { generateSitemap } from "./generateSitemap";
export { generateSitemapIndex } from "./generateSitemapIndex";
export { generateRSS } from "./generateRSS";
export { askAI } from "./askAI";
export { testFunction } from "./testfunctions";
