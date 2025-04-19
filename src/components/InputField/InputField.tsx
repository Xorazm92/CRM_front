import React from "react";

interface Option {
  label: string;
  value: string | number;
}

interface InputFieldProps {
  label?: string;
  type?: string;
  placeholder?: string;
  name?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options?: Option[];
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
    <div className={`mb-4 ${className}`}>
      {label && <label className="block mb-1 text-gray-700 font-medium">{label}</label>}
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
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
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
        />
      )}
    </div>
  );
};

export default InputField;
