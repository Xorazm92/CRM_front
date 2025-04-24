import React, { useState } from "react";
import { Menu, Layout } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  FileTextOutlined,
  CalendarOutlined,
  DollarOutlined,
  SettingOutlined,
  LogoutOutlined,
  HomeOutlined,
  BarChartOutlined,
  SolutionOutlined
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Sider } = Layout;

const menuItems = [
  {
    key: "home",
    icon: <HomeOutlined />,
    label: <Link to="/">Asosiy</Link>,
    roles: ["admin", "teacher", "student", "parent"],
  },
  {
    key: "students",
    icon: <TeamOutlined />,
    label: <Link to="/students">O’quvchilar</Link>,
    roles: ["admin", "teacher"],
  },
  {
    key: "teachers",
    icon: <UserOutlined />,
    label: <Link to="/teacher">O’qituvchilar</Link>,
    roles: ["admin"],
  },
  {
    key: "groups",
    icon: <SolutionOutlined />,
    label: <Link to="/groups">Guruhlar</Link>,
    roles: ["admin", "teacher"],
  },
  {
    key: "courses",
    icon: <BookOutlined />,
    label: <Link to="/courses">Kurslar</Link>,
    roles: ["admin", "teacher"],
  },
  {
    key: "lessons",
    icon: <FileTextOutlined />,
    label: <Link to="/lessons">Darslar</Link>,
    roles: ["admin", "teacher"],
  },
  {
    key: "attendance",
    icon: <CalendarOutlined />,
    label: <Link to="/attendance">Davomat</Link>,
    roles: ["admin", "teacher"],
  },
  {
    key: "assignments",
    icon: <FileTextOutlined />,
    label: <Link to="/assignments">Vazifalar</Link>,
    roles: ["admin", "teacher", "student"],
  },
  {
    key: "payments",
    icon: <DollarOutlined />,
    label: <Link to="/payments">To‘lovlar</Link>,
    roles: ["admin", "teacher", "student", "parent"],
  },
  {
    key: "report",
    icon: <BarChartOutlined />,
    label: <Link to="/report">Hisobotlar</Link>,
    roles: ["admin"],
  },
  {
    key: "settings",
    icon: <SettingOutlined />,
    label: <Link to="/settings">Foydalanuvchi sozlamalari</Link>,
    roles: ["admin", "teacher", "student", "parent"],
  },
  {
    key: "logout",
    icon: <LogoutOutlined />,
    label: <Link to="/logout">Chiqish</Link>,
    roles: ["admin", "teacher", "student", "parent"],
  },
];

const Sidebar: React.FC = () => {
  const userRole = localStorage.getItem("role") || "admin";
  const location = useLocation();
  const currentKey = menuItems.find(item => location.pathname.startsWith(item.label.props.to))?.key || "home";

  return (
    <div className="h-full bg-white">
      <div className="flex items-center justify-center py-6 border-b">
        <span className="text-2xl font-bold text-blue-700">CRM</span>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[currentKey]}
        className="border-r-0 !bg-white"
        items={menuItems.filter(item => item.roles.includes(userRole))}
      />
    </div>
  );
};

export default Sidebar;
