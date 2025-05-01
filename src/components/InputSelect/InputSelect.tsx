import React, { useState } from "react";
import './InputSelect.css';
import images from "../../images";

export interface InputSelectProps {
  label?: string;
  options: (string | number)[];
  onChange?: (value: string | number) => void;
  defaultValue?: string | number;
}

const InputSelect: React.FC<InputSelectProps> = ({ label, options, onChange, defaultValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | number>(defaultValue ?? "");

  const handleSelectClick = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (option: string | number) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onChange) onChange(option);
  };

  return (
    <div className="custom-select-container">
      <div className="custom-select" onClick={handleSelectClick} tabIndex={0} role="button" aria-haspopup="listbox">
        {selectedOption || label}
        <span className={`arrow${isOpen ? " open" : ""}`}>
          <img width={16} src={images.top} alt="toggle" />
        </span>
      </div>
      {isOpen && (
        <ul className="custom-options" role="listbox">
          {options.map((option, index) => (
            <li
              key={index}
              className="custom-option"
              onClick={() => handleOptionClick(option)}
              role="option"
              aria-selected={selectedOption === option}
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
