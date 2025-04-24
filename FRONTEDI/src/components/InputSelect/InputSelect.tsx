import React from "react";
import { Select } from "antd";

interface InputSelectProps {
  label: string;
  value?: string;
  options: string[];
  onChange?: (value: string) => void;
}

const InputSelect: React.FC<InputSelectProps> = ({ label, value, options, onChange }) => {
  return (
    <div className="mb-2">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <Select
        className="w-full"
        value={value}
        placeholder={label}
        onChange={onChange}
        options={options.map(option => ({ value: option, label: option }))}
        allowClear
      />
    </div>
  );
};

export default InputSelect;
