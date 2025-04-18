import React from "react";
import "./InputField.css";

const InputField = ({
  label,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  options = [],
  className = "",
}) => {
  return (
    <div className={`input-field ${className}`}>
      {label && <label className="input-label">{label}</label>}

      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="input-select"
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input-element"
        />
      )}
    </div>
  );
};

export default InputField;
