// ./components/detail/useClientState.tsx

'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardBody, Input, Button, Chip } from "@nextui-org/react";

const convertTextToHTML = (textArray: string[]): JSX.Element[] => {
  return textArray.map((paragraph: string, index: number) => {
    if (paragraph === "<br>") {
      return <p key={index}><br /></p>; // 빈 줄을 <br> 태그로 표시
    }
    return <p key={index}>{paragraph}</p>;
  });
};

interface CalculatorData {
  계산기이름: string;
  계산기설명: string[];
  해시태그: string[];
  작성날짜: Date;
  방문자수: number;
  계산횟수: number;
}

interface ClientComponentProps {
  calculator: CalculatorData;
  userId: string;
  slug: string;
}

const ClientComponent: React.FC<ClientComponentProps> = ({ calculator, userId, slug }) => {
  const [question, setQuestion] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [viewCount, setViewCount] = useState<number>(calculator.방문자수);
  const [calcCount, setCalcCount] = useState<number>(calculator.계산횟수);

  useEffect(() => {
    // Increase view count
    fetch(`https://increaseviewcount-hry6fdb6aa-du.a.run.app?userId=${userId}&slug=${slug}`, {
      method: 'POST',
    })
    .then(() => {
      setViewCount(prevCount => prevCount + 1);
    })
    .catch(error => console.error('Error increasing view count:', error));
  }, [userId, slug]);

  const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };

  const handleAskAI = async () => {
    console.log("Question submitted:", question);
    try {
      const response = await fetch('https://askai-hry6fdb6aa-du.a.run.app/askAI', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: calculator.계산기이름,
          description: calculator.계산기설명.join('\n'),
          question,
        }),
      });

      console.log("Request sent to server");

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const responseJson = await response.json();
      console.log("Response received from server:", responseJson);

      setAiResponse(responseJson);

      // Increase calculation count
      fetch(`https://increasecalculationcount-hry6fdb6aa-du.a.run.app?userId=${userId}&slug=${slug}`, {
        method: 'POST',
      })
      .then(() => {
        setCalcCount(prevCount => prevCount + 1);
      })
      .catch(error => console.error('Error increasing calculation count:', error));

    } catch (error) {
      console.error("Error asking AI:", error);
      setAiResponse({ error: "AI 응답을 가져오는 중 오류가 발생했습니다." });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
      <h1 className="text-3xl font-bold text-[#2E8B57] mb-6">{calculator.계산기이름}</h1>
      <Card className="mb-6">
        <CardBody>
          {convertTextToHTML(calculator.계산기설명)}
        </CardBody>
      </Card>
      <div className="flex flex-wrap gap-2 mb-4">
        {calculator.해시태그.map((tag, index) => (
          <Chip key={index} className="bg-[#87CEEB] bg-opacity-20 text-[#2E8B57]">
            {tag}
          </Chip>
        ))}
      </div>
      <div className="text-sm text-gray-600 mb-6">
        <span className="mr-4">조회수: {viewCount}</span>
        <span>계산 횟수: {calcCount}</span>
      </div>

      {/* 여기에 계산기 주요 기능 구현 */}

      <div className="fixed bottom-0 left-0 right-0 bg-[#40E0D0] p-4 flex justify-center items-center shadow-lg">
        <Input
          className="w-2/3 mr-2"
          placeholder="AI에게 질문하세요"
          value={question}
          onChange={handleQuestionChange}
        />
        <Button 
          color="primary"
          className="bg-[#2E8B57]"
          onClick={handleAskAI}
        >
          질문하기
        </Button>
      </div>

      {aiResponse && (
        <Card className="mt-6 bg-[#F0F8FF]">
          <CardBody>
            <p>{aiResponse.result}</p>
            <p>{aiResponse.explanation}</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ClientComponent;