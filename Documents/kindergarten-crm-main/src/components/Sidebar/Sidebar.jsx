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
            onClick={() => handleItemClick("Asosiy")}
          >
            <img src={images.menu_icon} alt="Menu" />
            <span>Asosiy</span>
          </Link>
          <Link
            to="/students"
            className={`menu-item ${activeItem === "O’quvchilar" ? "active" : ""}`}
            onClick={() => handleItemClick("O’quvchilar")}
          >
            <img src={images.doubleuser} alt="O'quvchilar" />
            <span>O’quvchilar</span>
          </Link>
          {/* <Link
            to="/teachers"
            className={`menu-item ${activeItem === "Teachers" ? "active" : ""}`}
            onClick={() => handleItemClick("Teachers")}
          >
            <span>O'qituvchilar</span>
          </Link> */}
          <Link
            to="/teacher"
            className={`menu-item ${activeItem === "O’qituvchilar" ? "active" : ""}`}
            onClick={() => handleItemClick("O’qituvchilar")}
          >
            <img src={images.usersThree} alt="O'qituvchilar" />
            <span>O’qituvchilar</span>
          </Link>
          <Link
            to="/courses"
            className={`menu-item ${activeItem === "Kurslar" ? "active" : ""}`}
            onClick={() => handleItemClick("Kurslar")}
          >
            <img src={images.add_icon} alt="Kurslar" />
            <span>Kurslar</span>
          </Link>
          <Link
            to="/groups"
            className={`menu-item ${activeItem === "Guruhlar" ? "active" : ""}`}
            onClick={() => handleItemClick("Guruhlar")}
          >
            <img src={images.group} alt="Groups" />
            <span>Guruhlar</span>
          </Link>
          <Link
            to="/lessons"
            className={`menu-item ${activeItem === "Lessons" ? "active" : ""}`}
            onClick={() => handleItemClick("Lessons")}
          >
            <img src={images.lesson} alt="Darslar" style={{width:22, height:22}} />
            <span>Darslar</span>
          </Link>
          <Link
            to="/attendance"
            className={`menu-item ${activeItem === "Attendance" ? "active" : ""}`}
            onClick={() => handleItemClick("Attendance")}
          >
            <img src={images.calendar} alt="Davomat" />
            <span>Davomat</span>
          </Link>
          <Link
            to="/assignments"
            className={`menu-item ${activeItem === "Assignments" ? "active" : ""}`}
            onClick={() => handleItemClick("Assignments")}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{marginRight:10}} xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="16" rx="3" fill={activeItem === "Assignments" ? "#1976d2" : "#f5f5f5"} stroke="#1976d2" strokeWidth="1.5"/>
              <rect x="7" y="8" width="10" height="2" rx="1" fill="#1976d2" opacity=".8"/>
              <rect x="7" y="12" width="7" height="2" rx="1" fill="#1976d2" opacity=".6"/>
              <rect x="7" y="16" width="5" height="2" rx="1" fill="#1976d2" opacity=".4"/>
              <g>
                <circle cx="18" cy="18" r="2.2" fill="#fff" stroke="#1976d2" strokeWidth="1.3"/>
                <path d="M18 17V19M17 18H19" stroke="#1976d2" strokeWidth="1.2" strokeLinecap="round"/>
              </g>
            </svg>
            <span>Vazifalar</span>
          </Link>
          <Link
            to="/payments"
            className={`menu-item ${activeItem === "Payments" ? "active" : ""}`}
            onClick={() => handleItemClick("Payments")}
          >
            <span>To‘lovlar</span>
          </Link>
          <Link
            to="/file-upload"
            className={`menu-item ${activeItem === "FileUpload" ? "active" : ""}`}
            onClick={() => handleItemClick("FileUpload")}
          >
            <span>Fayl yuklash</span>
          </Link>
          {/* Ota-Onalar (Parents) linki olib tashlandi */}
          <Link
            to="/report"
            className={`menu-item ${activeItem === "Hisobotlar" ? "active" : ""}`}
            onClick={() => handleItemClick("Hisobotlar")}
          >
            <img src={images.cashs} alt="Report" />
            <span>Hisobotlar</span>
          </Link>
          <Link
            to="/settings"
            className={`menu-item ${activeItem === "Settings" ? "active" : ""}`}
            onClick={() => handleItemClick("Settings")}
          >
            <span>Sozlamalar</span>
          </Link>
        </ul>
      </nav>
      <div className="footer-menu">
        <ul>
          <Link
            to="setting"
            className={`menu-item ${activeItem === "Setting" ? "active" : ""}`}
            onClick={() => handleItemClick("Setting")}
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
