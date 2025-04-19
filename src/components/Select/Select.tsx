import React from "react";

interface SelectProps {
  options: { label: string; value: string | number }[];
  value: string | number;
  onChange: (value: string | number) => void;
  className?: string;
}

const Select: React.FC<SelectProps> = ({ options, value, onChange, className = "" }) => (
  <select
    className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300 ${className}`}
    value={value}
    onChange={e => onChange(e.target.value)}
  >
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

export default Select;
