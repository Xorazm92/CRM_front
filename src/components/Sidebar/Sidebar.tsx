import React from "react";

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ children, className = "" }) => (
  <aside className={`h-full w-[237px] bg-white shadow-md p-4 ${className}`}>
    {children}
  </aside>
);

export default Sidebar;
