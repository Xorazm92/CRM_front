import React from "react";

interface DropdownProps {
  options: { label: string; value: string | number }[];
  value: string | number;
  onChange: (value: string | number) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange }) => (
  <select
    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
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

export default Dropdown;
