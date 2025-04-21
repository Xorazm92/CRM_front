import React from "react";
import "./SuccessModal.css"; // Assuming you will create this CSS file

const SuccessModal = () => {
  return (
    <div className="success-modal">
      <div className="success-content">
        <div className="success-icon">
          {/* You can use an SVG or a FontAwesome icon here */}
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
          <strong>Ajoyib natija!</strong> Tizimidagi jadvalni to'ldirish
          muvaffaqiyatli bajarildi.
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
