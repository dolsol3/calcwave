// components/write/CalculatorPad.tsx
import React from 'react';
import { useCalculation } from './useCalculationState';
import Button from './Button';
import { ButtonInfo } from './types';  // ButtonInfo 인터페이스 정의



const CalculatorPad: React.FC = () => {
  const { currentInput, updateCurrentInput, customInputs, setCustomInputs, elements, setElements, prefixTexts, suffixTexts, updatePrefixText, updateSuffixText, updateElement } = useCalculation();
  const buttons: ButtonInfo[] = [
    { id: 'seven', label: '7', value: '7', type: 'number' },
    { id: 'eight', label: '8', value: '8', type: 'number' },
    { id: 'nine', label: '9', value: '9', type: 'number' },
    { id: 'slash', label: '/', value: '/', type: 'operator' },
    { id: 'four', label: '4', value: '4', type: 'number' },
    { id: 'five', label: '5', value: '5', type: 'number' },
    { id: 'six', label: '6', value: '6', type: 'number' },
    { id: 'asterisk', label: '*', value: '*', type: 'operator' },
    { id: 'one', label: '1', value: '1', type: 'number' },
    { id: 'two', label: '2', value: '2', type: 'number' },
    { id: 'three', label: '3', value: '3', type: 'number' },
    { id: 'minus', label: '-', value: '-', type: 'operator' },
    { id: 'zero', label: '0', value: '0', type: 'number' },
    { id: 'point', label: '.', value: '.', type: 'number' },
    { id: 'percent', label: '%', value: '%', type: 'operator' },
    { id: 'plus', label: '+', value: '+', type: 'operator' },
    { id: 'openparenthesis', label: '(', value: '(', type: 'parenthesis' },
    { id: 'closeparenthesis', label: ')', value: ')', type: 'parenthesis' },
    { id: 'input', label: 'Input', value: '0', type: 'input', special: true },
    { id: 'question', label: '?', value: '?', type: 'operator' },
    { id: 'colon', label: ':', value: ':', type: 'operator' },
    { id: 'greater', label: '>', value: '>', type: 'operator' },
    { id: 'less', label: '<', value: '<', type: 'operator' },
    { id: 'equal', label: '=', value: '==', type: 'operator' },
  ];

  const handleButtonClick = (button: ButtonInfo) => {
    if (button.special && button.type === 'input') {
        const newInputId = `사용자입력변수${Object.keys(customInputs).length + 1}`;
        const newInputValue = 0;  // 기본값은 0으로 설정

        setCustomInputs(prev => ({ ...prev, [newInputId]: newInputValue }));
        setElements(prevElements => [
          ...prevElements,
          { id: newInputId, value: newInputId, type: 'input' } // value를 newInputId로 설정
      ]);
        const newCurrentInput = `${currentInput}${newInputId}`;
        updateCurrentInput(newCurrentInput); // 함수 인자로 함수 대신 문자열을 직접 전달

    } else {
      // Handle all other button types
      const newValue = `${button.value}`;
      setElements(prevElements => [
        ...prevElements,
        { id: button.id, value: newValue, type: button.type }
      ]);
      let updatedInput = currentInput + (button.type === 'operator' ? ` ${button.value} ` : button.value);
      updateCurrentInput(updatedInput);
    }
    console.log('Elements:', elements); // 디버깅용 로그 추가
    console.log('Custom Inputs:', customInputs); // 디버깅용 로그 추가
  };

  return (

    <div className="button-grid grid grid-cols-4 gap-2 p-2">
      {buttons.map((button, index) => (
        <Button key={index} onClick={() => handleButtonClick(button)}>
          {button.label}
        </Button>
      ))}
    </div>

  );
};

export default CalculatorPad;
