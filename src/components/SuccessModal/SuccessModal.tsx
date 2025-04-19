import React from "react";

interface SuccessModalProps {
  message: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ message, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center">
      <span className="text-green-500 text-3xl mb-4">✔</span>
      <p className="mb-4 text-lg text-center">{message}</p>
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={onClose}>
        OK
      </button>
    </div>
  </div>
);

export default SuccessModal;
