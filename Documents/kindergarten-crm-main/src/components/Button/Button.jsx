import React from "react";
import "./Button.css";
import images from "../../images";
import { useNavigate } from "react-router-dom";

function Button({ onFilterClick, showAdd = true }) {
  const navigate = useNavigate();
  const handleClickBtn = () => {
    if (location.pathname.includes("students")) {
      navigate(`/add-student`);
    } else if (location.pathname.includes("parents")) {
      navigate(`/add-parents`);
    } else if (location.pathname.includes("teacher")) {
      navigate(`/add-teacher`);
    } else if (location.pathname.includes("group")) {
      navigate(`/add-group`);
    }
  };
  return (
    <div className="btn-class">
      <div className="table-header-actions">
        {showAdd && (
          <button
            onClick={handleClickBtn}
            className="add-button"
            type="primary"
          >
            <img width={24} src={images.add_icon} alt="add" />
            <span>Qo'shish</span>
          </button>
        )}
        <button className="sharing">
          <img width={24} src={images.sharing} alt="sharing" />
        </button>
        <button className="filtering" onClick={onFilterClick}>
          <img width={24} src={images.filter} alt="Filter" />
        </button>
      </div>
    </div>
  );
}

export default Button;
