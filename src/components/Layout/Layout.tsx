import React, { useState } from "react";
import { Outlet, useLocation, Link, Navigate, useNavigate } from "react-router-dom";
import { Layout, Button, Avatar, Input, Row, Col, theme, Menu, Popover } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import logo from "../../images/logo.png";
import searchIcon from "../../images/icons/search_icon.png";
import notificationIcon from "../../images/icons/notification.png";
import menuIcon from "../../images/icons/menu_icon.png";
import menuSecond from "../../images/icons/menu_second.png";
import groupIcon from "../../images/icons/group.png";
import userIcon from "../../images/icons/user.png";
import usersThree from "../../images/icons/users-three.png";
import settingIcon from "../../images/icons/setting.png";
import logoutIcon from "../../images/icons/logout.png";
import cashIcon from "../../images/icons/cash.png";
import attendanceIcon from "../../images/icons/attendance.png";

import { useAuthStore } from "../../store/useAuthStore";
import { getSidebarMenu } from "./sidebarMenus";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const selectedKey = path;

  // Auth store
  const { isLogged, user, logOut } = useAuthStore();
  const navigate = useNavigate();

  // Agar login qilinmagan bo‘lsa, login sahifasiga yo‘naltir
  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }

  // Logout tugmasi bosilganda sessionni tozalash va login sahifasiga o'tkazish
  const handleLogout = () => {
    logOut();
    navigate("/login", { replace: true });
  };

  // TypeScript uchun menyu itemlarini aniq tipda yozamiz
  type SidebarMenuItem = {
    key: string;
    label: string;
    to: string;
    icon: any;
  };
  type SidebarMenuGroup = {
    type: "group";
    label: string;
    children: SidebarMenuItem[];
  };
  type SidebarMenu = (SidebarMenuItem | SidebarMenuGroup)[];

  // Role normalization: har doim katta harflarga o'tkaziladi
  const normRole = user?.role?.toUpperCase?.();
  const sidebarMenu: SidebarMenu = getSidebarMenu(normRole);

  // SubMenu uchun destructure
  const { SubMenu } = Menu;

  // Profil menyusi uchun alohida komponent
  const ProfileMenu = ({ user, onLogout }: { user: any, onLogout: () => void }) => (
    <div style={{ minWidth: 180 }}>
      <div style={{ fontWeight: 600 }}>{user?.name || user?.full_name || user?.username}</div>
      <div style={{ color: "#888" }}>{user?.role}</div>
      <hr />
      <div>
        <Link to="/profile">Profil</Link>
      </div>
      <div style={{ color: "red", cursor: "pointer" }} onClick={onLogout}>Chiqish</div>
    </div>
  );

  // Pastki menyu (settings, logout)
  const bottomMenu = [
    {
      key: "settings",
      icon: <img src={settingIcon} width={22} height={22} alt="Sozlamalar" />,
      label: <Link to="/settings">Sozlamalar</Link>
    },
    {
      key: "logout",
      icon: <img src={logoutIcon} width={22} height={22} alt="Chiqish" />,
      label: <span onClick={handleLogout} style={{ cursor: 'pointer' }}>Chiqish</span>
    }
  ];

  // --- Rasm importlarini to'g'rilash uchun images.d.ts mavjud, importlar to'g'ri ishlaydi ---
  // --- Menu items massivini TypeScriptga mos va to'g'ri strukturada shakllantirish ---
  // Avval sidebarMenu ni Menu uchun kerakli formatga o'zgartiramiz:
  const menuItems = sidebarMenu.map(item => {
    if ("type" in item && item.type === "group") {
      return {
        key: item.label,
        label: item.label,
        children: item.children.map(child => ({
          key: child.key,
          icon: <img src={child.icon} width={22} height={22} alt={child.label} />,
          label: <Link to={child.to}>{child.label}</Link>,
        }))
      };
    } else {
      return {
        key: item.key,
        icon: <img src={item.icon} width={22} height={22} alt={item.label} />,
        label: <Link to={item.to}>{item.label}</Link>,
      };
    }
  });

  return (
    <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={220}
        style={{
          backgroundColor: "#fff",
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          zIndex: 100,
          boxShadow: "2px 0 8px #f0f1f2",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <div>
          <div
            style={{
              textAlign: "center",
              padding: "10px",
              marginBottom: "6px",
              border: "2px solid #e6e8ec",
              borderTop: "none",
              background: "#fff",
            }}
          >
            <img src={logo} alt="Logo" style={{ width: "80%" }} />
          </div>
          {/* SubMenu Sidebar */}
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ border: "none", background: "#fff" }}
            items={menuItems}
          />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[]}
          items={bottomMenu}
          style={{ border: "none", background: "#fff", marginBottom: 16 }}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 220, transition: "margin-left 0.2s" }}>
        <Header
          style={{
            padding: 0,
            height: "80px",
            display: "flex",
            alignItems: "center",
            background: colorBgContainer,
            boxShadow: "0 1px 4px #f0f1f2",
          }}
        >
          <Row justify="space-between" style={{ width: "100%", alignItems: "center" }}>
            <Row style={{ alignItems: "center", gap: "10px" }}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
              <Input
                style={{
                  maxWidth: "210px",
                  padding: "6px 60px 6px 15px",
                  border: "1px solid #e6e8ec",
                  borderRadius: "4px",
                  boxShadow: "2px 2px 2px 0 rgba(0, 0, 0, 0.1)",
                  background: "#f7f8fa",
                  fontWeight: 900,
                  fontSize: "16px",
                }}
                placeholder="Qidiruv tizimi..."
                prefix={<img width={24} height={24} src={searchIcon} />}
              />
            </Row>
            <Row style={{ gap: "10px", alignItems: "center", marginRight: "20px" }}>
              <Button
                type="default"
                shape="circle"
                style={{
                  width: 38,
                  height: 38,
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#fff",
                  border: "1px solid #e6e8ec"
                }}
                onClick={() => navigate("/notifications")}
              >
                <img src={notificationIcon} width={24} height={24} alt="" />
              </Button>
              <Popover
                placement="bottomRight"
                trigger="click"
                content={<ProfileMenu user={user} onLogout={handleLogout} />}
              >
                <Avatar
                  src={user?.avatar || user?.images?.[1]?.url}
                  alt="Logo"
                  size={38}
                  style={{ cursor: "pointer" }}
                />
              </Popover>
            </Row>
          </Row>
        </Header>
        <Content
          className="custom-scroll"
          style={{
            backgroundColor: "#f7f8fa",
            overflowY: "auto",
            height: "calc(100vh - 80px)",
            padding: "20px",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
