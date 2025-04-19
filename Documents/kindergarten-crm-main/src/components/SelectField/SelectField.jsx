import React from "react";
import "./SelectField.css";
import images from "../../images";

const SelectField = ({ label, name, options, value, onChange }) => {
  return (
    <div className="select-input-container">
      <label className="select-input-label">{label}</label>
      <div className="select-input-wrapper">
        <select
          className="select-input-field"
          name={name}
          value={value}
          onChange={onChange}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <img src={images.bottom} alt="select arrow" className="select-icon" />
      </div>
    </div>
  );
};

export default SelectField;
