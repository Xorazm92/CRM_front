import React from "react";
import "./Header.css";
import "../../images/index.js";
import images from "../../images/index.js";

const Header = () => {
  return (
    <header className="top-header">
      <div className="search-bar">
        <img
          className="search-icon"
          src={images.search_icon}
          alt="Search Icon"
          width={24}
          style={{ cursor: "pointer" }}
        />
        <input type="text" placeholder="Qidiruv tizimi..." />
      </div>
      <div className="user-info">
        <div className="notification-icons">
          <div className="icon-wrapper">
            <img
              className="notification-icon"
              src={images.notification}
              alt="notification icon"
              width={24}
            />
            <span className="notification-badge"></span>
          </div>
          <div className="icon-wrapper">
            <img
              className="user-status-icon"
              src={images.user}
              alt="user"
              width={24}
            />
          </div>
        </div>
        <div className="user-details">
          <span className="user-name">Ruslan Mirzaev</span>
          <span className="user-role">Foydalanuvchi</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
