// ./components/write/useCalculationState.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CalcElement } from './types';
import { evaluate } from 'mathjs';

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
  setCustomInputs: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  setElements: React.Dispatch<React.SetStateAction<CalcElement[]>>;
  resetCalculator: () => void;
  updatePrefixText: (id: string, text: string) => void;
  updateSuffixText: (id: string, text: string) => void;
  prefixTexts: Record<string, string>;
  suffixTexts: Record<string, string>;
  setLeftUnit: React.Dispatch<React.SetStateAction<string>>;
  setRightUnit: React.Dispatch<React.SetStateAction<string>>;
  leftUnit: string; // 추가된 부분
  rightUnit: string; // 추가된 부분
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
  const [customInputs, setCustomInputs] = useState<Record<string, number>>({});
  const [currentInput, setCurrentInput] = useState<string>("");
  const [calculationResult, setCalculationResult] = useState<number>(0);
  const [prefixTexts, setPrefixTexts] = useState<Record<string, string>>({});
  const [suffixTexts, setSuffixTexts] = useState<Record<string, string>>({});
  const [leftUnit, setLeftUnit] = useState<string>('');
  const [rightUnit, setRightUnit] = useState<string>('');

  const addElement = (element: CalcElement) => {
    setElements(prev => [...prev, element]);
    console.log(`Added element: ${element.id} with value: ${element.value}`);
  };

  const updateElement = (id: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setElements(prev => prev.map(el => (el.id === id ? { ...el, value: numericValue.toString() } : el)));
    setCustomInputs(prev => ({ ...prev, [id]: numericValue }));
    console.log(`Element updated: ${id} with value: ${value}`);
  };

  const updateCurrentInput = (input: string) => {
    console.log("Updating current input to:", input);
    setCurrentInput(input);
  };

  const updatePrefixText = (id: string, text: string) => {
    setPrefixTexts(prev => ({ ...prev, [id]: text }));
  };

  const updateSuffixText = (id: string, text: string) => {
    setSuffixTexts(prev => ({ ...prev, [id]: text }));
  };

  const calculate = () => {
    const expression = elements.map(el => el.type === 'input' ? customInputs[el.id]?.toString() || '0' : el.value).join(' ');
    console.log(`Evaluating expression: ${expression}`);
    console.log('Elements:', elements);
    console.log('Custom Inputs:', customInputs);

    try {
      const result = evaluate(expression);
      console.log(`Calculation result: ${result}`);
      setCalculationResult(isNaN(result) ? 0 : result);
    } catch (error) {
      console.error("Calculation error:", error);
      setCalculationResult(0);
    }
  };

  const resetCalculator = () => {
    setElements([]);
    setCustomInputs({});
    setCurrentInput("");
    setCalculationResult(0);
    setPrefixTexts({});
    setSuffixTexts({});
    setLeftUnit('');
    setRightUnit('');
    console.log("Calculator has been reset.");
  };

  const saveExpression = () => {
    let newElements: CalcElement[] = [];
    let currentNumber = '';
    elements.forEach(el => {
      if (el.type === 'number') {
        currentNumber += el.value;
      } else {
        if (currentNumber) {
          newElements.push({ id: `num${newElements.length + 1}`, value: currentNumber, type: 'number' });
          currentNumber = '';
        }
        newElements.push(el);
      }
    });
    if (currentNumber) {
      newElements.push({ id: `num${newElements.length + 1}`, value: currentNumber, type: 'number' });
    }
    setElements(newElements);

    const expressionString = newElements.map(el => el.value).join(' ');
    console.log('Expression saved:', expressionString);
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
      suffixTexts,
      setLeftUnit,
      setRightUnit,
      leftUnit,
      rightUnit
    }}>
      {children}
    </CalculationContext.Provider>
  );
};

