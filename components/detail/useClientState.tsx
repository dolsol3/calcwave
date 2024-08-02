// ./components/detail/useClientState.tsx

'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardBody, Input, Button, Chip, Modal, ModalContent, ModalHeader, ModalBody, Spinner, useDisclosure } from "@nextui-org/react";

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
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

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
    onOpen(); // 모달 열기
    setAiResponse(null); // AI 응답 초기화
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
      setAiResponse({ error: "Error getting AI response." });
    }
  };

  const handleCloseModal = () => {
    onOpenChange(); // 모달 닫기
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
      <h1 className="text-3xl font-bold mb-6">{calculator.계산기이름}</h1>
      <Card className="mb-6 card">
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
        <span className="mr-4">Views: {viewCount}</span>
        <span>Calculations: {calcCount}</span>
      </div>

      {/* 여기에 계산기 주요 기능 구현 */}

      <div className="fixed bottom-0 left-0 right-0 bg-[#40E0D0] p-4 flex justify-center items-center shadow-lg z-50"> {/* z-50으로 가장 위에 위치 */}
        <Input
          className="w-2/3 mr-2"
          placeholder="Ask A.I. what to calculate."
          value={question}
          onChange={handleQuestionChange}
        />
        <Button 
          color="primary"
          className="bg-[#2E8B57] text-white hover:bg-[#40E0D0] transition duration-300"
          onClick={handleAskAI}
        >
          Let A.I. calculate
        </Button>
      </div>

      {/* AI 응답을 기다리는 동안 모달 */}
      <Modal isOpen={isOpen} onOpenChange={handleCloseModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Waiting for AI response</ModalHeader>
              <ModalBody>
                {aiResponse ? (
                  <>
                    <p>{aiResponse.result}</p>
                    <p>{aiResponse.explanation}</p>
                    <Button color="primary" onPress={onClose}>
                      Close
                    </Button>
                  </>
                ) : (
                  <div className="flex justify-center items-center">
                    <Spinner />
                    <p className="ml-2">I'm waiting for a reply from AI...</p>
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* 모달이 닫힌 후에만 결과를 보여줌 */}
      {!isOpen && aiResponse && (
        <div className="mt-6"> {/* 기존 콘텐츠와 동일한 형태로 표시 */}
          <Card className="bg-[#F0F8FF]">
            <CardBody>
              <p>{aiResponse.result}</p>
              <p>{aiResponse.explanation}</p>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClientComponent;
