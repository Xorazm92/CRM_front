import React, { useState } from "react";
import "./ReportButtons.css";

function ReportButtons() {
  // Step 1: Create state to track the active button
  const [activeButton, setActiveButton] = useState("Daromad");

  // Step 2: Handle button click and set the active button
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName); // Update state with the clicked button name
  };

  return (
    <div className="btn-report-groups">
      <button
        className={`btn-report ${activeButton === "Daromad" ? "active" : ""}`}
        onClick={() => handleButtonClick("Daromad")}
      >
        Daromad
      </button>
      <button
        className={`btn-report ${activeButton === "Harajat" ? "active" : ""}`}
        onClick={() => handleButtonClick("Harajat")}
      >
        Harajat
      </button>
      <button
        className={`btn-report ${activeButton === "Maosh" ? "active" : ""}`}
        onClick={() => handleButtonClick("Maosh")}
      >
        Maosh
      </button>
    </div>
  );
}

export default ReportButtons;
