import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import icons from "../../images/icons";

interface ButtonProps {
  showAdd?: boolean;
  onFilterClick?: () => void;
  onAddClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ showAdd = true, onFilterClick, onAddClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClickBtn = () => {
    if (onAddClick) {
      onAddClick();
      return;
    }
    if (location.pathname.includes("students")) {
      navigate(`/students/add`);
    } else if (location.pathname.includes("teacher")) {
      navigate(`/teachers/add`);
    } else if (location.pathname.includes("group")) {
      navigate(`/groups/add`);
    }
  };

  return (
    <div className="btn-class">
      <div className="table-header-actions">
        {showAdd && (
          <button
            onClick={handleClickBtn}
            className="add-button"
            type="button"
          >
            <img width={24} src={icons.add} alt="add" />
            <span>Qo'shish</span>
          </button>
        )}
        <button className="sharing" type="button">
          <img width={24} src={icons.sharing} alt="sharing" />
        </button>
        <button className="filtering" type="button" onClick={onFilterClick}>
          <img width={24} src={icons.filter} alt="Filter" />
        </button>
      </div>
    </div>
  );
};

export default Button;
