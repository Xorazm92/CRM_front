import React, { useState } from "react";
import "./ReportButtons.css";

export interface ReportButtonsProps {
  buttons?: string[];
  onChange?: (active: string) => void;
  defaultActive?: string;
}

const defaultButtons = ["Daromad", "Harajat", "Maosh"];

const ReportButtons: React.FC<ReportButtonsProps> = ({
  buttons = defaultButtons,
  onChange,
  defaultActive = buttons[0],
}) => {
  const [activeButton, setActiveButton] = useState<string>(defaultActive);

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
    if (onChange) onChange(buttonName);
  };

  return (
    <div className="btn-report-groups">
      {buttons.map((btn) => (
        <button
          key={btn}
          className={`btn-report${activeButton === btn ? " active" : ""}`}
          onClick={() => handleButtonClick(btn)}
        >
          {btn}
        </button>
      ))}
    </div>
  );
};

export default ReportButtons;
