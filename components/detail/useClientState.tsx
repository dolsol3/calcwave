// ./components/detail/useClientState.tsx

'use client'

import React from 'react';
import { Input, Button, Card, CardBody } from "@nextui-org/react";

const convertTextToHTML = (textArray: string[]): JSX.Element[] => {
  return textArray.map((paragraph: string, index: number) => {
    if (paragraph === "<br>") {
      return <p key={index}><br /></p>;
    }
    return <p key={index}>{paragraph}</p>;
  });
};

interface CalculatorData {
  계산기이름: string;
  계산기설명: string[];
  해시태그: string[];
}

interface ClientComponentProps {
  calculator: CalculatorData;
}

const ClientComponent: React.FC<ClientComponentProps> = ({ calculator }) => {
  const [question, setQuestion] = React.useState<string>('');
  const [aiResponse, setAiResponse] = React.useState<string>('');

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

      const data = await response.json();
      console.log("Response received from server:", data);
      setAiResponse(data.answer);
    } catch (error) {
      console.error("Error asking AI:", error);
      setAiResponse("AI 응답을 가져오는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <h1>{calculator.계산기이름}</h1>
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
            <p>AI 응답: {aiResponse}</p>
          </CardBody>
        </Card>
      )}
      <Button>공유하기</Button>
      <Button>캡처하기</Button>
      <Button>수정하기</Button>
    </div>
  );
};

export default ClientComponent;