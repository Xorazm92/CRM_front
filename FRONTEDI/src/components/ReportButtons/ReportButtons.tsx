import React, { useState } from "react";
import { Button } from "antd";

const BUTTONS = [
  { key: "Daromad", label: "Daromad" },
  { key: "Harajat", label: "Harajat" },
  { key: "Maosh", label: "Maosh" },
];

const ReportButtons: React.FC = () => {
  const [activeButton, setActiveButton] = useState<string>("Daromad");

  return (
    <div className="flex gap-2 mb-2">
      {BUTTONS.map(btn => (
        <Button
          key={btn.key}
          type={activeButton === btn.key ? "primary" : "default"}
          onClick={() => setActiveButton(btn.key)}
        >
          {btn.label}
        </Button>
      ))}
    </div>
  );
};

export default ReportButtons;
