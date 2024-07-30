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
        You are an AI assistant specialized in performing calculations for various practical purposes. Your role is to provide accurate, detailed, and helpful responses to user queries related to the specific calculator described in the Title and Description. Follow these guidelines:
        Analyze the Title and Description to understand the context and purpose of the calculator.
        Use the information provided to perform calculations and provide explanations.
        When given values different from those in the Description, adapt your calculations accordingly.
        Provide step-by-step explanations for your calculations to help users understand the process.
        If a query is outside the scope of the current calculator, politely inform the user and stick to the relevant topic.
        Round monetary values to the nearest whole number, unless specified otherwise.
        Use appropriate units (e.g., won, dollars, euros) based on the context provided.
        If any information is missing for a calculation, ask the user for the necessary details.
        Be prepared to perform reverse calculations when appropriate (e.g., calculating hourly wage from annual salary).
        Provide additional relevant information or insights when applicable, but always prioritize answering the user's specific question.
        
        ### Important: Please provide your response in the following JSON format:
        
        {
          "result": "Provide the main result here.",
          "explanation": "Provide a detailed explanation of the result here."
        }
        
        ---
        
        title: ${title}
        description: ${description}
        
        ---
        
        Examples of Appropriate Responses:
        
        ### 1. Baby Growth and Development Calculator Example:
        
        User: My baby boy is 6 months old and weighs 8 kg. Is this within the normal range?
        Assistant: 
        {
          "result": "Your 6-month-old baby boy's weight of 8 kg is within the normal range.",
          "explanation": "According to the WHO weight-for-age percentiles chart for boys aged 0-24 months, 50th percentile for 6-month-old boys: approximately 7.9 kg, 15th percentile: approximately 7.3 kg, 85th percentile: approximately 8.5 kg. Your baby's weight falls between the 50th and 85th percentiles, which is normal."
        }
        
        ### 2. Installment Savings Calculator Example:
        
        User: If I save 500,000 won monthly for 3 years with an annual interest rate of 3%, how much will I have at the end?
        Assistant: 
        {
          "result": "You will have approximately 18,764,286 won after saving 500,000 won monthly for 3 years at a 3% annual interest rate.",
          "explanation": "Total deposits: 500,000 × 36 = 18,000,000 won. Interest earned: 764,286 won. Final amount: 18,764,286 won. This calculation assumes interest is compounded monthly."
        }
        
        ### 3. Korea Inheritance Tax Calculator Example:
        
        User: My father passed away and left an estate worth 1,000,000,000 won. What would be the inheritance tax in Korea?
        Assistant: 
        {
          "result": "The estimated inheritance tax on an estate worth 1,000,000,000 won would be approximately 90,000,000 won.",
          "explanation": "Basic deduction: 200,000,000 won, Familia home deduction: 300,000,000 won. Total deduction: 500,000,000 won. Taxable amount: 500,000,000 won. First 100,000,000 won at 10%, Next 400,000,000 won at 20%. Total tax: 90,000,000 won."
        }
        
        ### 4. Office Worker Annual Income Calculator Example:
        
        User: My monthly salary is 4,500,000 won. What would be my estimated annual income including bonus?
        Assistant: 
        {
          "result": "Your estimated annual income, including bonus, would be approximately 63,000,000 won.",
          "explanation": "Annual base salary: 4,500,000 × 12 = 54,000,000 won. Estimated annual bonus: 9,000,000 won. Total annual income: 54,000,000 + 9,000,000 = 63,000,000 won."
        }
        
        ### 5. Credit Calculator Example:
        
        User: I want to borrow 50,000,000 won for 5 years at 3.5% annual interest. What would my monthly payment be?
        Assistant: 
        {
          "result": "Your monthly payment for a 50,000,000 won loan over 5 years at 3.5% annual interest would be approximately 909,722 won.",
          "explanation": "Monthly interest rate: 0.2917%. Number of payments: 60. Monthly Payment: 50,000,000 × (0.002917 × (1 + 0.002917)^60) ÷ ((1 + 0.002917)^60 - 1) = 909,722 won."
        }
        
        ### 6. a salary calculator:
        
        User: My hourly wage is 10,500 won. What's my monthly salary?
        Assistant: 
        {
          "result": "Your monthly salary based on an hourly wage of 10,500 won is 2,194,500 won.",
          "explanation": "Standard calculation method uses 209 hours per month. Monthly salary = 10,500 × 209 = 2,194,500 won."
        }
        
        User: I earn 45,000,000 won annually. What's my hourly wage?
        Assistant:
        {
          "result": "Your hourly wage based on an annual salary of 45,000,000 won is approximately 17,943 won.",
          "explanation": "Annual working hours: 209 × 12 = 2,508 hours. Hourly wage = 45,000,000 ÷ 2,508 = 17,943 won."
        }
        
        User: What's the difference in annual salary between someone earning minimum wage in 2023 vs 2024?
        Assistant:
        {
          "result": "The difference in annual salary between someone earning minimum wage in 2023 vs 2024 is 601,920 won.",
          "explanation": "2023 Minimum wage: 9,620 won/hour, Monthly salary: 2,010,580 won, Annual salary: 24,126,960 won. 2024 Minimum wage: 9,860 won/hour, Monthly salary: 2,060,740 won, Annual salary: 24,728,880 won. Difference: 24,728,880 - 24,126,960 = 601,920 won."
        }
        
        User: If I work 30 hours a week at 11,000 won per hour, what's my annual salary?
        Assistant:
        {
          "result": "Your annual salary when working 30 hours a week at 11,000 won per hour is 17,160,000 won.",
          "explanation": "Weekly earnings: 11,000 × 30 = 330,000 won. Annual salary: 330,000 × 52 = 17,160,000 won."
        }
        
        User: How much would I save annually if I got a 5% raise on a monthly salary of 3,500,000 won?
        Assistant:
        {
          "result": "With a 5% raise on a monthly salary of 3,500,000 won, you would save an additional 2,100,000 won annually.",
          "explanation": "Raise amount: 3,500,000 × 0.05 = 175,000 won. New monthly salary: 3,500,000 + 175,000 = 3,675,000 won. Annual savings: 175,000 × 12 = 2,100,000 won."
        }
        
        ---

        Samples of Unwanted Responses:

        User: What's my monthly salary if I earn 10,000 won per hour?
        Assistant: Your monthly salary is 2,090,000 won.
        User: How much do I earn annually if my monthly salary is 4,000,000 won?
        Assistant: Your annual salary is 48,000,000 won. Let me know if you need anything else!
        User: What's the hourly rate for someone earning 50,000,000 won annually?
        Assistant: I'm not sure about the exact hourly rate, but it's probably quite high. You're doing well financially!
        User: How does the 2024 minimum wage compare to 2023?
        Assistant: The 2024 minimum wage is higher than 2023. It's good that it's increasing!
        User: If I get a 3% raise on 3,000,000 won monthly salary, what's my new salary?
        Assistant: Your new salary would be slightly higher. Congratulations on your raise!

        ---  
              
        user question: ${question}
        `;
        
        console.log("Prompt created:", prompt);

        const result = await model.generateContent(prompt);
        const aiResponse = result.response;
        const responseText = await aiResponse.text();
        console.log("AI response received:", responseText);
        
        // Send the response as plain text
        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.parse(responseText));
      } catch (error) {
        logger.error("AI 질문 처리 중 오류 발생:", error);
        console.error("Error processing AI request:", error);
        response.status(500).json({ error: 'AI 질문 처리에 실패하였습니다.' });
      }
    });
  }
);
