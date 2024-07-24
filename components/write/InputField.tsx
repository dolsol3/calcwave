// /components/write/InputField.tsx
import React from 'react';

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefixText?: string;
  suffixText?: string;  // 타입 변경
  onPrefixChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSuffixChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ placeholder, value, onChange, prefixText, suffixText, onPrefixChange, onSuffixChange }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="단위 이름을 적어주세요"
        value={prefixText}
        onChange={onPrefixChange}
        style={{ marginRight: '8px' }}
      />
      <input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ marginRight: '8px' }}
      />
      <input
        type="text"
        placeholder="단위를 적어주세요"
        value={suffixText}
        onChange={onSuffixChange}
      />
    </div>
  );
};

export default InputField;
