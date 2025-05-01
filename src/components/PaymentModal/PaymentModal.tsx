import React from "react";
import "./PaymentModal.css";
import icons from "../../images/icons";

export interface PaymentModalProps {
  amount?: string | number;
  percentageChange?: string;
  title?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  amount = "12 000 000 so’m",
  percentageChange = "-30%",
  title = "Kirimlar",
}) => {
  return (
    <div className="card-container">
      <div className="card-icon">
        <img width={32} src={icons.income} alt="icon" />
      </div>
      <div className="card-content">
        <h3>{title}</h3>
        <p className="card-amount">{amount}</p>
        <p className="card-subtext">
          <span className="calendar-icon"><img width={16} src={icons.calendar} alt="Calendar" /></span> Kechagi kunga nisbatan
          <span className="percentage-change"> {percentageChange}</span>
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
