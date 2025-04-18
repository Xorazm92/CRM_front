import React from "react";

const Input = ({ label, value, onChange, name, placeholder }) => {
  return (
    <div className="input-container">
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );
};

export default Input;
