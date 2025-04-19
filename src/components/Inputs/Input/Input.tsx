import React from "react";

interface InputProps {
  label?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  placeholder?: string;
  type?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  name,
  placeholder,
  type = "text",
  className = "",
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block mb-1 text-gray-700 font-medium">{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>
  );
};

export default Input;
