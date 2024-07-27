// ./components/detail/useClientState.tsx

'use client'

import React from 'react';
import { Input, Button, ButtonGroup, Card, CardBody } from "@nextui-org/react";
import { evaluate } from 'mathjs';

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
  계산기설명: string[]; // 배열 형태로 변경
  해시태그: string[];
  사용자입력변수: Array<{ 입력변수아이디: string, 변수단위이름: string, 변수단위: string }>;
  계산수식: string;
  계산결과: { 결과이름: string, 단위: string };
  입력요소: Array<{ id: string, value: string, type: string }>;
}

interface ClientComponentProps {
  calculator: CalculatorData;
  initialInputs: Record<string, number>;
}

const ClientComponent: React.FC<ClientComponentProps> = ({ calculator, initialInputs }) => {
  const [inputs, setInputs] = React.useState<Record<string, number>>(initialInputs);
  const [result, setResult] = React.useState<number>(0);
  const [resultName, setResultName] = React.useState<string>(calculator.계산결과.결과이름);
  const [unit, setUnit] = React.useState<string>(calculator.계산결과.단위);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const value = parseFloat(event.target.value);
    setInputs((prevInputs) => ({
      ...prevInputs,
      [key]: isNaN(value) ? 0 : value,
    }));
  };

  const handleCalculate = () => {
    if (calculator && calculator.입력요소 && calculator.계산수식) {
      let expression = calculator.계산수식;

      for (const variable of calculator.사용자입력변수) {
        const value = inputs[variable.입력변수아이디] || 0;
        expression = expression.replace(new RegExp(variable.입력변수아이디, 'g'), value.toString());
      }

      try {
        const calculatedResult = evaluate(expression);
        setResult(calculatedResult);
      } catch (error) {
        console.error("Error calculating result:", error);
        setResult(0);
      }
    }
  };

  const handleReset = () => {
    setInputs(initialInputs);
    setResult(0);
    setResultName(calculator.계산결과.결과이름);
    setUnit(calculator.계산결과.단위);
  };

  return (
    <div>
      <h1>{calculator.계산기이름}</h1>
      {calculator.사용자입력변수.map((variable: any) => (
        <Input
          key={variable.입력변수아이디}
          id={variable.입력변수아이디}
          type="number"
          label={variable.변수단위이름}
          placeholder="0.00"
          labelPlacement="outside"
          value={inputs[variable.입력변수아이디]?.toString() || '0'}
          onChange={(event) => handleInputChange(event, variable.입력변수아이디)}
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">{variable.변수단위}</span>
            </div>
          }
        />
      ))}
      <ButtonGroup>
        <Button onClick={handleReset}>초기화</Button>
        <Button onClick={handleCalculate}>계산하기</Button>
      </ButtonGroup>
      <p>계산결과</p>
      <Card>
        <CardBody>
          <p>{resultName} {result !== null ? `${result}` : "0"} {unit}</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          {convertTextToHTML(calculator.계산기설명)} {/* 줄 바꿈 처리된 HTML 출력 */}
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <p>{calculator.해시태그?.map((tag: string) => `#${tag}`).join(' ')}</p>
        </CardBody>
      </Card>
      <ButtonGroup>
        <Button>공유하기</Button>
        <Button>캡처하기</Button>
        <Button>수정하기</Button>
      </ButtonGroup>
    </div>
  );
};

export default ClientComponent;
