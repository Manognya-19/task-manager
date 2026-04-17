import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <Navbar activeMenu={activeMenu} />

      {/* Layout */}
      {user && (
      <div className="flex">
        {/* Sidebar (desktop) */}
        <div className="max-[1080px]:hidden">
          <SideMenu activeMenu={activeMenu} />
        </div>

        {/* Main Content */}
        <div className="grow mx-5">{children}</div>
      </div>
      )}
    </div>
  );
};

export default DashboardLayout;
