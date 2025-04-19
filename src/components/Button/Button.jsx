import React from "react";
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
    <div className="">
      <div className="flex justify-between gap-2">
        {showAdd && (
          <button
            onClick={handleClickBtn}
            className="w-[132px] h-9 rounded border border-gray-200 bg-transparent flex gap-2 items-center px-5 py-1.5 justify-between cursor-pointer shadow-md"
            type="button"
          >
            <img width={24} src={images.add_icon} alt="add" />
            <span className="font-medium text-base text-primary-600">Qo'shish</span>
          </button>
        )}
        <button className="w-9 h-9 rounded border border-gray-200 p-1.5 gap-2 bg-transparent flex items-center justify-center cursor-pointer" type="button">
          <img width={24} src={images.sharing} alt="sharing" />
        </button>
        <button className="w-9 h-9 rounded border border-gray-200 p-1.5 gap-2 bg-transparent flex items-center justify-center cursor-pointer relative" onClick={onFilterClick} type="button">
          <img width={24} src={images.filter} alt="Filter" />
        </button>
      </div>
    </div>
  );
}

export default Button;
