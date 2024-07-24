// app/detail/[userId]/[slug]/page.tsx

'use client'
import React, { useEffect, useState } from "react";
import { Input, Button, ButtonGroup, Card, CardBody } from "@nextui-org/react";
import { evaluate } from 'mathjs';

interface DetailPageProps {
  params: {
    userId: string;
    slug: string;
  };
}

const DetailPage: React.FC<DetailPageProps> = ({ params }) => {
  const { userId, slug } = params;

  const [calculator, setCalculator] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [result, setResult] = useState<number>(0);
  const [resultName, setResultName] = useState<string>("");
  const [unit, setUnit] = useState<string>("");

  useEffect(() => {
    const fetchCalculator = async () => {
      try {
        const response = await fetch(`https://detail-hry6fdb6aa-du.a.run.app?userId=${userId}&slug=${encodeURIComponent(slug)}`);
        const data = await response.json();
        if (response.ok) {
          setCalculator(data);
          const initialInputs: Record<string, number> = {};
          data.사용자입력변수.forEach((variable: any) => {
            initialInputs[variable.입력변수아이디] = 0;
          });
          setInputs(initialInputs);
          setResultName(data.계산결과.결과이름);
          setUnit(data.계산결과.단위);
        } else {
          console.error("Error fetching calculator:", data.error);
        }
      } catch (error) {
        console.error("Error fetching calculator:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalculator();
  }, [userId, slug]);

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
    if (calculator) {
      const initialInputs: Record<string, number> = {};
      calculator.사용자입력변수.forEach((variable: any) => {
        initialInputs[variable.입력변수아이디] = 0;
      });
      setInputs(initialInputs);
      setResult(0);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!calculator) {
    return <div>Document not found</div>;
  }

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
          <p>{calculator.계산기설명}</p>
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

export default DetailPage;
