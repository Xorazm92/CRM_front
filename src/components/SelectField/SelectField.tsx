import React, { ChangeEvent } from "react";
import "./SelectField.css";
import images from "../../images";

export interface OptionType {
  value: string | number;
  label: string;
}

export interface SelectFieldProps {
  label?: string;
  name?: string;
  options: OptionType[];
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, name, options, value, onChange }) => {
  return (
    <div className="select-input-container">
      {label && <label className="select-input-label">{label}</label>}
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
