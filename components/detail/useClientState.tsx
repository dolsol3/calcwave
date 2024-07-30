// ./components/detail/useClientState.tsx

'use client'

import React, { useEffect, useState } from 'react';
import { Input, Button, Card, CardBody } from "@nextui-org/react";

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
    <div>
      <h1>{calculator.계산기이름}</h1>
      <p>Date: {calculator.작성날짜.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
      <p>Views: {viewCount}</p>
      <p>Number of calculations: {calcCount}</p>
      <Card>
        <CardBody>
          {convertTextToHTML(calculator.계산기설명)}
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <p>{calculator.해시태그?.map((tag: string) => `#${tag}`).join(' ')}</p>
        </CardBody>
      </Card>
      <Input
        type="text"
        label="질문"
        placeholder="계산에 대한 질문을 입력하세요"
        value={question}
        onChange={handleQuestionChange}
      />
      <Button onClick={handleAskAI}>AI에게 물어보기</Button>
      {aiResponse && (
        <Card>
          <CardBody>
            {aiResponse.error && <p>{aiResponse.error}</p>}
            {aiResponse.result && (
              <>
                <p><strong>결과:</strong> {aiResponse.result}</p>
                <p><strong>설명:</strong> {aiResponse.explanation}</p>
              </>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ClientComponent;
