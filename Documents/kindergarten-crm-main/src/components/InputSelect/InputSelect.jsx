import React, { useState } from "react";
import './InputSelect.css'; 
import images from "../../images";

const InputSelect = ({ label, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const handleSelectClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="custom-select-container">
      <div className="custom-select" onClick={handleSelectClick}>
        {selectedOption || label}
        <span className={`arrow ${isOpen ? "open" : ""}`}>
          <img width={16} src={images.top} alt="bottom" />
        </span>
      </div>
      {isOpen && (
        <ul className="custom-options">
          {options.map((option, index) => (
            <li
              key={index}
              className="custom-option"
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
