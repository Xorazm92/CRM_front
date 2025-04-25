import React, { ChangeEvent } from "react";
import "./InputField.css";

interface OptionType {
  value: string | number;
  label: string;
}

interface InputFieldProps {
  label?: string;
  type?: string;
  placeholder?: string;
  name?: string;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
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
    <div className={`input-field ${className}`}>
      {label && <label className="input-label">{label}</label>}
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="input-select"
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input-element"
        />
      )}
    </div>
  );
};

export default InputField;
