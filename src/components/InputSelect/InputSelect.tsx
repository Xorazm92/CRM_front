import React, { useState } from "react";
import images from "../../images/index.js";

interface InputSelectProps {
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options: string[];
  className?: string;
}

const InputSelect: React.FC<InputSelectProps> = ({ label, value = "", onChange, options, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value);

  const handleSelectClick = () => setIsOpen(!isOpen);
  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onChange) {
      // Simulate a change event for parent compatibility
      const event = {
        target: { value: option }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div
        className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded cursor-pointer bg-white hover:border-blue-400"
        onClick={handleSelectClick}
      >
        <span>{selectedOption || label}</span>
        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
          <img width={16} src={images.top} alt="bottom" />
        </span>
      </div>
      {isOpen && (
        <ul className="absolute left-0 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg z-10">
          {options.map((option, idx) => (
            <li
              key={idx}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InputSelect;
