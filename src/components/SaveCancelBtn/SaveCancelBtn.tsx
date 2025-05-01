import React from "react";
import "./SaveCancelBtn.css";
import images from "../../images";

export interface SaveCancelBtnProps {
  onSave?: () => void;
  onCancel?: () => void;
  saveText?: string;
  cancelText?: string;
  disabled?: boolean;
}

const SaveCancelBtn: React.FC<SaveCancelBtnProps> = ({
  onSave,
  onCancel,
  saveText = "Saqlash",
  cancelText = "Bekor qilish",
  disabled = false,
}) => {
  return (
    <div className="btn-class">
      <div className="table-header-actions">
        <button className="failure" onClick={onCancel} disabled={disabled}>
          <img width={24} src={images.failure} alt="failure" />
          <span>{cancelText}</span>
        </button>
        <button onClick={onSave} className="success" disabled={disabled}>
          <img width={24} src={images.success} alt="success" />
          <span>{saveText}</span>
        </button>
      </div>
    </div>
  );
};

export default SaveCancelBtn;
