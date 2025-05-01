import React, { useState } from "react";
import "./Select.css";
import images from "../../images/index.js";

export interface SelectProps {
  options?: string[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

const defaultOptions = ["UZB", "ENG", "RUS"];

const Select: React.FC<SelectProps> = ({
  options = defaultOptions,
  defaultValue = options[0],
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>(defaultValue);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onChange) onChange(option);
  };

  return (
    <div className="select-container">
      <div className="selected-option" onClick={toggleDropdown} tabIndex={0} role="button" aria-haspopup="listbox">
        {selectedOption}
        <span className={`arrow${isOpen ? " open" : ""}`}>
          <img width={24} src={images.bottom} alt="" />
        </span>
      </div>
      {isOpen && (
        <div className="dropdown-options" role="listbox">
          {options.map((option) => (
            <div
              className="option"
              key={option}
              onClick={() => selectOption(option)}
              role="option"
              aria-selected={selectedOption === option}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
