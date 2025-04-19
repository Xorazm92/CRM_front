import React, { useState } from "react";
import "./Sidebar.css";
import "../../images/index.js";
import images from "../../images/index.js";
import { Link } from "react-router-dom";

function Sidebar() {
  const [activeItem, setActiveItem] = useState("Asosiy");

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
  };

  return (
    <aside className="sidebar">
      <div className="logo">
        <img src={images.logo} alt="Logo" />
      </div>
      <nav className="menu">
        <ul>
          <Link
            to="/"
            className={`menu-item ${activeItem === "Asosiy" ? "active" : ""}`}
          >
            <img src={images.menu_icon} alt="Menu" />
            <span>Asosiy</span>
          </Link>
          <Link
            to="/students"
            className={`menu-item ${
              activeItem === "O’quvchilar" ? "active" : ""
            }`}
            onClick={() => handleItemClick("O’quvchilar")}
          >
            <img src={images.doubleuser} alt="O'quvchilar" />
            <span>O’quvchilar</span>
          </Link>
          <Link
            to="/teacher"
            className={`menu-item ${
              activeItem === "O’qituvchilar" ? "active" : ""
            }`}
            onClick={() => handleItemClick("O’qituvchilar")}
          >
            <img src={images.usersThree} alt="O'qituvchilar" />
            <span>O’qituvchilar</span>
          </Link>
          <Link
            to="/group"
            className={`menu-item ${activeItem === "Guruhlar" ? "active" : ""}`}
            onClick={() => handleItemClick("Guruhlar")}
          >
            <img src={images.group} alt="Groups" />
            <span>Guruhlar</span>
          </Link>
          <Link
            to="/parents"
            className={`menu-item ${
              activeItem === "Ota-Onalar" ? "active" : ""
            }`}
            onClick={() => handleItemClick("Ota-Onalar")}
          >
            <img src={images.parents} alt="Parents" />
            <span>Ota-Onalar</span>
          </Link>
          <Link
            to="/report"
            className={`menu-item ${
              activeItem === "Hisobotlar" ? "active" : ""
            }`}
          >
            <img src={images.cashs} alt="Report" />
            <span>Hisobotlar</span>
          </Link>
        </ul>
      </nav>
      <div className="footer-menu">
        <ul>
          <Link
            to="setting"
            className={`menu-item ${activeItem === "Setting" ? "active" : ""}`}
          >
            <img src={images.setting} alt="Settings" />
            <span>Sozlamalar</span>
          </Link>
          <Link
            to="/logout"
            className={`menu-item ${activeItem === "Logout" ? "active" : ""}`}
            onClick={() => handleItemClick("Logout")}
          >
            <img src={images.logout} alt="Log Out" />
            <span>Chiqish</span>
          </Link>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
