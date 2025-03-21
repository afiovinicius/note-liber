import "./styles.css";

import { Note } from "@phosphor-icons/react";

import { SidebarProps } from "./sidebar.type";

export const Sidebar = ({ children, resize }: SidebarProps) => {
  return (
    <nav className={`bar ${resize}`}>
      <Note size={48} className="logo" />
      {children}
    </nav>
  );
};
