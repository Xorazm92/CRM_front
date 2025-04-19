import React from "react";

interface SelectFieldProps {
  label: string;
  options: { label: string; value: string | number }[];
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, options, value, onChange, className = "" }) => (
  <div className={`mb-4 ${className}`}>
    <label className="block mb-1 text-gray-700 font-medium">{label}</label>
    <select
      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
      value={value}
      onChange={onChange}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default SelectField;
