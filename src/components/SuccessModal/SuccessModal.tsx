import React from "react";
import "./SuccessModal.css";

export interface SuccessModalProps {
  message?: string;
  strongText?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  message = "Tizimidagi jadvalni to'ldirish muvaffaqiyatli bajarildi.",
  strongText = "Ajoyib natija!",
}) => {
  return (
    <div className="success-modal">
      <div className="success-content">
        <div className="success-icon">
          {/* SVG Success icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon"
          >
            <path d="M9 11l3 3L22 4"></path>
            <path d="M22 4L12 14l-3-3-7 7"></path>
          </svg>
        </div>
        <div className="success-message">
          <strong>{strongText}</strong> {message}
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
