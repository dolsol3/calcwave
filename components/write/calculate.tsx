// ./components/write/calcualte.tsx

'use client';

import { evaluate } from 'mathjs';
import { CalcElement } from './types';

export const evaluateExpression = (input: string): string => {
  if (input.includes('%')) {
    const baseValue = parseFloat(input.replace('%', ''));
    return String(baseValue * 0.01);
  }
  return input;
};

export const calculateExpression = (elements: CalcElement[], customInputs: Record<string, string>): number => {
  let expression = elements.map(el => {
    if (el.type === 'input') {
      // 'input' 타입 요소의 경우 customInputs에서 해당 id의 값을 사용
      return customInputs[el.id] || '0'; // 값이 없는 경우 '0'을 사용
    }
    return el.value; // 그 외 요소는 기존 값 사용
  }).join(' ');

  console.log("Final expression to evaluate:", expression);

  try {
    const result = evaluate(expression);
    console.log("Calculated result:", result);
    return result;
  } catch (error) {
    console.error("Calculation error:", error);
    return NaN;
  }
};
