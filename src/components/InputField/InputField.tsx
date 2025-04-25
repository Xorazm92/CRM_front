import React from "react";
import { Input, Select } from "antd";

export interface OptionType {
  label: string;
  value: string | number;
}

interface InputFieldProps {
  label?: string;
  type?: string;
  placeholder?: string;
  name?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | any) => void;
  options?: OptionType[];
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  options = [],
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="font-medium text-gray-700 mb-1">{label}</label>}
      {type === "select" ? (
        <Select
          value={value}
          onChange={onChange}
          className="w-full"
          options={options}
          placeholder={placeholder}
        />
      ) : (
        <Input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default InputField;
