import React from "react";
import "./Dropdown.css"; 

function Dropdown({ label, options, value, onChange }) {
  return (
    <div className="dropdown-container">
      <label className="dropdown-label">{label}</label>
      <select className="dropdown-select" value={value} onChange={onChange}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Dropdown;
