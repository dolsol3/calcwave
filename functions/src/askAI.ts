// ./functions/src/askAI.ts

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import cors from "cors";
import { Request, Response } from "express";
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");

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
        console.log("Received input parameters:", { title, description, question });
        const model = genAI.getGenerativeModel({ 
          model: "gemini-1.5-flash",
          safetySetting: [
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_UNSPECIFIED, threshold: HarmBlockThreshold.BLOCK_NONE },
          ],
          generationConfig: { responseMimeType: "application/json" }
        });
        console.log("Model created successfully");

        const prompt = `
          제목: ${title}
          설명: ${description}
          예제: 키가 160cm이고 몸무게가 60kg이면 BMI는 23.4입니다.
          질문: ${question}
        `;
        console.log("Prompt created:", prompt);

        const result = await model.generateContent(prompt);
        const aiResponse = result.response;
        const responseText = await aiResponse.text(); // 수정된 부분
        console.log("AI response received:", responseText);
        response.json({ answer: responseText });
      } catch (error) {
        logger.error("AI 질문 처리 중 오류 발생:", error);
        console.error("Error processing AI request:", error);
        response.status(500).json({ error: 'AI 질문 처리에 실패하였습니다.' });
      }
    });
  }
);
