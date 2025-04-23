import React, { useState } from "react";
import "./Sidebar.css";
import "../../images/index.js";
import images from "../../images/index.js";
import { Link } from "react-router-dom";

function Sidebar() {
  const [activeItem, setActiveItem] = useState("Asosiy");
  const [openSection, setOpenSection] = useState(null);
  // TEST uchun: userRole ni har doim "admin" qilib qo'yamiz, keyin context yoki localStorage orqali to'g'ri oling
  const userRole = localStorage.getItem('role') || "admin";

  const handleItemClick = (itemName) => setActiveItem(itemName);
  const handleSectionToggle = (sectionTitle) => setOpenSection(openSection === sectionTitle ? null : sectionTitle);

  const sections = [
    {
      title: "📚 Ta’lim",
      items: [
        { to: "/", label: "Asosiy", icon: images.menu_icon, roles: ["admin", "teacher", "student", "parent"] },
        { to: "/students", label: "O’quvchilar", icon: images.doubleuser, roles: ["admin", "teacher"] },
        { to: "/teacher", label: "O’qituvchilar", icon: images.usersThree, roles: ["admin"] },
        { to: "/groups", label: "Guruhlar", icon: images.group, roles: ["admin", "teacher"] },
        { to: "/courses", label: "Kurslar", icon: images.add_icon, roles: ["admin", "teacher"] },
        { to: "/lessons", label: "Darslar", icon: images.lesson, roles: ["admin", "teacher"] },
        { to: "/attendance", label: "Davomat", icon: images.calendar, roles: ["admin", "teacher"] },
        { to: "/assignments", label: "Vazifalar", icon: null, roles: ["admin", "teacher", "student"] }
      ]
    },
    {
      title: "💵 Moliyaviy",
      items: [
        { to: "/payments", label: "To‘lovlar", icon: null, roles: ["admin", "teacher", "student", "parent"] },
        { to: "/report", label: "Hisobotlar", icon: images.cashs, roles: ["admin"] }
      ]
    },
    {
      title: "⚙️ Sozlamalar",
      items: [
        { to: "/settings", label: "Foydalanuvchi sozlamalari", icon: null, roles: ["admin", "teacher", "student", "parent"] }
      ]
    }
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <img src={images.logo} alt="Logo" />
      </div>
      <nav className="menu">
        {sections.map(section =>
          <div className="sidebar-section" key={section.title}>
            <div
              className="sidebar-title"
              onClick={() => handleSectionToggle(section.title)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <span>{section.title}</span>
              <span>{openSection === section.title ? "▼" : "▶"}</span>
            </div>
            {openSection === section.title && (
              <ul>
                {section.items.filter(item => item.roles.includes(userRole)).map(item => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={`menu-item ${activeItem === item.label ? "active" : ""}`}
                      onClick={() => handleItemClick(item.label)}
                    >
                      {item.icon && <img src={item.icon} alt={item.label} />}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </nav>
      <div className="footer-menu">
        <ul>
          <li>
            <Link to="/logout" className={`menu-item ${activeItem === "Logout" ? "active" : ""}`} onClick={() => handleItemClick("Logout")}> <img src={images.logout} alt="Log Out" /><span>Chiqish</span></Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
