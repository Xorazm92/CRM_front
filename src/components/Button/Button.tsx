import React from 'react';
import icons from '../../Pages/Home/icons';
import { useNavigate } from 'react-router-dom';

export interface ButtonProps {
  onClick?: () => void;
  showAdd?: boolean;
  label?: string;
  icon?: string;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, showAdd = true, label = "Qo'shish", icon, children }) => {
  const navigate = useNavigate();
  const handleClickBtn = () => {
    if (location.pathname.includes('students')) {
      navigate('/students/add');
    } else if (location.pathname.includes('parents')) {
      navigate('/add-parents');
    } else if (location.pathname.includes('teacher')) {
      navigate('/teacher/add');
    } else if (location.pathname.includes('group')) {
      navigate('/add-group');
    }
  };
  return (
    <div className="btn-class">
      <div className="table-header-actions">
        {showAdd && (
          <button
            onClick={onClick ? onClick : handleClickBtn}
            className="add-button"
            type="button"
          >
            {icon && <img width={24} src={icon} alt="icon" />}
            <span>{children ? children : label}</span>
          </button>
        )}
        <button className="sharing" type="button">
          <img width={24} src={icons.sharing} alt="sharing" />
        </button>
        <button className="filtering" type="button">
          <img width={24} src={icons.filter} alt="Filter" />
        </button>
      </div>
    </div>
  );
};

export default Button;
