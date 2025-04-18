import React from "react";
import "./Payment.css";
import images from "../../images";

const Payment = ({ isOpen, closeModal, person }) => {
  if (!person) return null;

  const nameParts = person.name.split(" ");
  const lastName = nameParts[0] || "";
  const firstName = nameParts[1] || "";
  const patronymic = nameParts.slice(2).join(" ") || "N/A";

  return (
    <>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>To'lov jadvali</h3>
              <button className="close-btn" onClick={closeModal}>
                <img width={24} src={images.x_icon} alt="close" />
              </button>
            </div>
            <div className="modal-body">
              <p>
                <span>Ism:</span> {firstName}
              </p>
              <p>
                <span>Familiya:</span> {lastName}
              </p>
              <p>
                <span>Sharfi:</span> {patronymic || "N/A"}
              </p>
              <p>
                <span>To'lov:</span> {person.paymentMethod || "Naqd"}
              </p>
              <p>
                <span>Summa:</span> {person.amount || "500 000 so'm"}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Payment;
