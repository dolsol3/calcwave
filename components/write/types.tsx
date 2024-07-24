// components/write/types.tsx
export interface CalcElement {
  id: string;
  type: 'number' | 'input' | 'output' | 'operator' | 'parenthesis' | 'expression' | 'condition'; // 'expression' 추가
  value: string;
  inputLabel?: string;  // Optional, as it seems not all elements will have a label.

}

export interface ButtonInfo {
  id: string;
  label: string;
  value: string;
  type: 'number' | 'operator' | 'input' | 'parenthesis' | 'output' | 'condition';
  special?: boolean;
}
