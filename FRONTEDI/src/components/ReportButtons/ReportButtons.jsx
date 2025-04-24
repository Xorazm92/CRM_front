import React, { useState } from 'react';
import './ReportButtons.css';

const BUTTONS = ['Daromad', 'Harajat', 'Maosh'];

const ReportButtons = () => {
  const [activeButton, setActiveButton] = useState('Daromad');

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  return (
    <div className="btn-report-groups">
      {BUTTONS.map(btn => (
        <button
          key={btn}
          className={`btn-report ${activeButton === btn ? 'active' : ''}`}
          onClick={() => handleButtonClick(btn)}
          type="button"
        >
          {btn}
        </button>
      ))}
    </div>
  );
};

export default ReportButtons;
