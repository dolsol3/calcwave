// ./functions/src/askAI.ts

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import cors from "cors";
import { Request, Response } from "express";
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 환경 변수로부터 API 키 접근
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// CORS 설정
const corsHandler = cors({ origin: true });

export const askAI = onRequest(
  { region: "asia-northeast3" },
  async (request: Request, response: Response) => {
    corsHandler(request, response, async () => {
      const { title, description, question } = request.body;

      if (!title || !description || !question) {
        response.status(400).json({ error: 'Invalid request parameters' });
        return;
      }

      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
          제목: ${title}
          설명: ${description}
          예제: 키가 160cm이고 몸무게가 60kg이면 BMI는 23.4입니다.
          질문: ${question}
        `;

        const result = await model.generateText({
          prompt: prompt,
          max_tokens: 150,
        });

        const answer = result?.data?.text || "답변을 생성할 수 없습니다.";
        response.json({ answer });
      } catch (error) {
        logger.error("AI 질문 처리 중 오류 발생:", error);
        response.status(500).json({ error: 'AI 질문 처리에 실패하였습니다.' });
      }
    });
  }
);
