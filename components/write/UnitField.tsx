// /components/write/UnitField.tsx

import React from 'react';
import { Input } from "@nextui-org/react";

interface UnitFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onFormatChange?: (format: string) => void; 

}

const UnitField: React.FC<UnitFieldProps> = ({ label, placeholder, value, onChange }) => {
  return (
    <div className="flex flex-wrap gap-4">
      <Input
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default UnitField;
