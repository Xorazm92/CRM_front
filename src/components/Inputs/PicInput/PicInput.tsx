import React from "react";

interface PicInputProps {
  label?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  className?: string;
}

const PicInput: React.FC<PicInputProps> = ({ label, onChange, name, className = "" }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block mb-1 text-gray-700 font-medium">{label}</label>}
      <input
        type="file"
        name={name}
        onChange={onChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
    </div>
  );
};

export default PicInput;
