import React, { useState } from "react";
import "./Select.css";
import images from "../../images/index.js";

const Select = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("UZB");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="select-container">
      <div className="selected-option" onClick={toggleDropdown}>
        {selectedOption}
        <span className={`arrow ${isOpen ? "open" : ""}`}>
          <img width={24} src={images.bottom} alt="" />
        </span>
      </div>
      {isOpen && (
        <div className="dropdown-options">
          <div className="option" onClick={() => selectOption("UZB")}>
            UZB
          </div>
          <div className="option" onClick={() => selectOption("ENG")}>
            ENG
          </div>
          <div className="option" onClick={() => selectOption("RUS")}>
            RUS
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;
