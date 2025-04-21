import React from "react";
import './Checkbox.css';

const Checkbox = ({ label, checked, onChange }) => {
  return (
    <div className="checkbox-container">
      <label>
        <input type="checkbox" checked={checked} onChange={onChange} />
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
