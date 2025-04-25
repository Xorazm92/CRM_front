import React, { ChangeEvent } from "react";

interface InputProps {
  label?: string;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({ label, value, onChange, name, placeholder }) => {
  return (
    <div className="input-container">
      {label && <label>{label}</label>}
      <input
        type="text"
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );
};

export default Input;
