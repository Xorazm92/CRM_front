import React from "react";
import images from "../../images/index.js";

const Header: React.FC = () => {
  return (
    <header className="fixed flex justify-between items-center px-5 py-2.5 bg-white border-b border-gray-200 w-[calc(100%-237px)] ml-[237px] top-0 left-0 h-24 z-[999]">
      <div className="flex items-center bg-gray-100 px-3 py-2 rounded border border-gray-200 gap-2 shadow-md w-[214px]">
        <img
          className="text-primary-400 cursor-pointer"
          src={images.search_icon}
          alt="Search Icon"
          width={24}
        />
        <input
          type="text"
          placeholder="Qidiruv tizimi..."
          className="border-none outline-none bg-transparent text-gray-800 placeholder:text-gray-300 font-medium text-base flex-1"
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center border-2 border-gray-200 w-9 h-9 rounded-full justify-center relative">
            <img
              className="text-slate-600 cursor-pointer"
              src={images.notification}
              alt="notification icon"
              width={24}
            />
            <span className="absolute top-1 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-bold"></span>
          </div>
          <div className="flex items-center border-2 border-gray-200 w-9 h-9 rounded-full justify-center">
            <img
              className="text-green-500 cursor-pointer"
              src={images.user}
              alt="user"
              width={24}
            />
          </div>
        </div>
        <div className="flex flex-col items-start leading-tight">
          <span className="text-sm font-semibold text-[#1b3b54]">Ruslan Mirzaev</span>
          <span className="text-xs text-gray-400">Foydalanuvchi</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
