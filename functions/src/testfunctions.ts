// ./functions/src/testfunctions.ts

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import cors from "cors";
import { Request, Response } from "express";

// CORS 설정
const corsHandler = cors({ origin: true });

export const testFunction = onRequest(
  { region: "asia-northeast3" },
  async (request: Request, response: Response) => {
    corsHandler(request, response, async () => {
      try {
        response.json({ message: "Test function is working correctly!" });
      } catch (error) {
        logger.error("Test function error:", error);
        response.status(500).json({ error: 'Test function failed' });
      }
    });
  }
);
