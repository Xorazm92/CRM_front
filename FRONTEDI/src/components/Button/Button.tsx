import React from 'react';
import icons from '../../Pages/Home/icons';
import { useNavigate } from 'react-router-dom';

export interface ButtonProps {
  onFilterClick?: () => void;
  showAdd?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onFilterClick, showAdd = true }) => {
  const navigate = useNavigate();
  const handleClickBtn = () => {
    if (location.pathname.includes('students')) {
      navigate('/add-student');
    } else if (location.pathname.includes('parents')) {
      navigate('/add-parents');
    } else if (location.pathname.includes('teacher')) {
      navigate('/add-teacher');
    } else if (location.pathname.includes('group')) {
      navigate('/add-group');
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
            <img width={24} src={icons.add_icon} alt="add" />
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
