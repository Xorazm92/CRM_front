import React from "react";
import "./PaymentModal.css";
import images from "../../images/index.js";

const PaymentModal = () => {
  return (
    <div className="card-container">
      <div className="card-icon">
        <img width={32} src={images.income} alt="icon" />
      </div>
      <div className="card-content">
        <h3>Kirimlar</h3>
        <p className="card-amount">12 000 000 so’m</p>
        <p className="card-subtext">
          <span className="calendar-icon"><img width={16} src={images.calendar} alt="Calendar" /></span> Kechagi kunga nisbatan
          <span className="percentage-change"> -30%</span>
        </p>
      </div>
      <div className="card-circles">
        <span className="circle circle1"></span>
        <span className="circle circle2"></span>
        <span className="circle circle3"></span>
        <span className="circle circle4"></span>
        <span className="circle circle5"></span>
      </div>
    </div>
  );
};

export default PaymentModal;
