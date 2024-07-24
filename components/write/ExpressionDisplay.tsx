// components/write/ExpressionDisplay.tsx
'use client';
import React, { useEffect} from 'react';
import { useCalculation } from './useCalculationState';

const ExpressionDisplay: React.FC = () => {
  const { currentInput } = useCalculation();  // 현재 입력된 수식을 가져옵니다.
  console.log("ExpressionDisplay currentInput:", currentInput); // Add this line

    // 상태가 변경될 때마다 콘솔에 로그를 출력합니다.
    useEffect(() => {
      console.log("Current input updated in ExpressionDisplay:", currentInput);
    }, [currentInput]);
    
    return (
      <div className="expression-display bg-gray-100 border p-3">
        <div className="expression-content">
        {currentInput.split(" ").map((part, index) => (
          <React.Fragment key={index}>
            {part + ' '}
          </React.Fragment>
        ))}
        </div>
      </div>
    );
  };

export default ExpressionDisplay;
