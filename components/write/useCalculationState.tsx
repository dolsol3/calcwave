// ./components/write/useCalculationState.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CalcElement  } from './types';
import { evaluate } from 'mathjs'; // 여기에 evaluate 함수를 가져옵니다.

interface CalculationContextType {
  elements: CalcElement[];
  customInputs: Record<string, number>;
  currentInput: string;
  addElement: (element: CalcElement) => void;
  updateElement: (id: string, value: string) => void;
  calculate: () => void;
  updateCurrentInput: (input: string) => void;
  saveExpression: () => void;
  calculationResult: number;  
  setCustomInputs: React.Dispatch<React.SetStateAction<Record<string, number>>>;  // 숫자 타입으로 변경
  setElements: React.Dispatch<React.SetStateAction<CalcElement[]>>;
  resetCalculator: () => void; // 초기화 함수 추가
  updatePrefixText: (id: string, text: string) => void;
  updateSuffixText: (id: string, text: string) => void;
  prefixTexts: Record<string, string>;
  suffixTexts: Record<string, string>;
}

export const CalculationContext = createContext<CalculationContextType | undefined>(undefined);

export const useCalculation = (): CalculationContextType => {
  const context = useContext(CalculationContext);
  if (!context) {
    throw new Error('useCalculation must be used within a CalculationProvider');
  }
  return context;
};

export const CalculationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [elements, setElements] = useState<CalcElement[]>([]);
  const [customInputs, setCustomInputs] = useState<Record<string, number>>({});  // 초기화 부분 숫자 타입으로 변경
  const [currentInput, setCurrentInput] = useState<string>("");
  const [calculationResult, setCalculationResult] = useState<number>(0);
  const [prefixTexts, setPrefixTexts] = useState<Record<string, string>>({}); // prefixTexts 상태 추가
  const [suffixTexts, setSuffixTexts] = useState<Record<string, string>>({}); // suffixTexts 상태 추가


  const addElement = (element: CalcElement) => {
    setElements(prev => [...prev, element]);
    console.log(`Added element: ${element.id} with value: ${element.value}`);  // 이 위치로 로그 문을 옮김
  };
  const updateElement = (id: string, value: string) => {
    const numericValue = parseFloat(value) || 0;  // 문자열을 숫자로 변환하고, NaN이면 0을 사용
    setElements(prev => prev.map(el => (el.id === id ? { ...el, value: numericValue.toString() } : el)));
    setCustomInputs(prev => ({ ...prev, [id]: numericValue }));
    console.log(`Element updated: ${id} with value: ${value}`);

  };
  
 const updateCurrentInput = (input: string) => {
    console.log("Updating current input to:", input); // 입력 업데이트 로그
    setCurrentInput(input); // 현재 입력 상태를 업데이트
  };

  const updatePrefixText = (id: string, text: string) => {
    setPrefixTexts(prev => ({ ...prev, [id]: text }));
  };

  const updateSuffixText = (id: string, text: string) => {
    setSuffixTexts(prev => ({ ...prev, [id]: text }));
  };
  
  // useCalculationState.tsx에서 calculate 함수
  const calculate = () => {
    const expression = elements.map(el => el.type === 'input' ? customInputs[el.id]?.toString() || '0' : el.value).join(' ');
      // 디버깅 로그 추가
    console.log(`Evaluating expression: ${expression}`);
    console.log('Elements:', elements);
    console.log('Custom Inputs:', customInputs);

    try {
      const result = evaluate(expression);
      console.log(`Calculation result: ${result}`); // 디버깅용 로그 추가

      setCalculationResult(isNaN(result) ? 0 : result);
    } catch (error) {
      console.error("Calculation error:", error);
      setCalculationResult(0);
    }
  };

    // 상태 초기화 함수
    const resetCalculator = () => {
      setElements([]);
      setCustomInputs({});
      setCurrentInput("");
      setCalculationResult(0);
      setPrefixTexts({});
      setSuffixTexts({});
      console.log("Calculator has been reset.");
    };

    const saveExpression = () => {
      let newElements: CalcElement[] = [];
      let currentNumber = '';
      elements.forEach(el => {
          if (el.type === 'number') {
              currentNumber += el.value; // 숫자를 연속적으로 묶음
          } else {
              if (currentNumber) {
                  newElements.push({ id: `num${newElements.length + 1}`, value: currentNumber, type: 'number' });
                  currentNumber = ''; // 숫자 묶음 초기화
              }
              newElements.push(el); // 'input' 타입은 변경 없이 추가
          }
      });
      if (currentNumber) {
          newElements.push({ id: `num${newElements.length + 1}`, value: currentNumber, type: 'number' });
      }
      setElements(newElements); // 업데이트된 elements로 상태 업데이트
      
      const expressionString = newElements.map(el => el.value).join(' ');
      console.log('Expression saved:', expressionString); // 수식 저장 콘솔 로그 추가
  };

  return (
    <CalculationContext.Provider value={{
      elements,
      customInputs,
      currentInput,
      calculationResult,
      addElement,
      updateElement,
      calculate,
      updateCurrentInput,
      setCustomInputs,
      setElements,
      saveExpression,
      resetCalculator,
      updatePrefixText,
      updateSuffixText,
      prefixTexts,
      suffixTexts
    }}>
      {children}
    </CalculationContext.Provider>
  );
};
