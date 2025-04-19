import React from "react";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  return (
    <div className="mb-2">
      <label className="text-base text-[#16213E] flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="accent-blue-600 w-4 h-4"
        />
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
