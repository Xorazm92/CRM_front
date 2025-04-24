import React from "react";
import "./SaveCancelBtn.css";
import images from "../../images";

function SaveCancelBtn() {

  const handleSaveClick = () => {
    
  };

  return (
    <div className="btn-class">
      <div className="table-header-actions">
        <button className="failure">
          <img width={24} src={images.failure} alt="failure" />
          <span>Bekor qilish</span>
        </button>
        <button onClick={() => handleSaveClick()} className="success">
          <img width={24} src={images.success} alt="success" />
          <span>Saqlash</span>
        </button>
      </div>
    </div>
  );
}

export default SaveCancelBtn;
