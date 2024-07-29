// ./functions/src/index.tsx

// Firebase Admin SDK 초기화
import * as admin from 'firebase-admin';

// Firebase 초기화
if (!admin.apps.length) {
    admin.initializeApp();
  }
  
export { login } from "./login";
export { publish } from "./publish";
export { detail } from "./detail";
export { generateSitemap } from "./generateSitemap";
export { generateSitemapIndex } from "./generateSitemapIndex";
export { generateRSS } from "./generateRSS";
export { askAI } from "./askAI";
export { testFunction } from "./testfunctions";
