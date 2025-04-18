import React from "react";
import "./Layout.css";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";

function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <header>
        <Header />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
