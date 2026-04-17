import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";


const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const navigate = useNavigate();

  // Handle menu click
  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  // Load menu based on role
  useEffect(() => {
    if (user) {
      setSideMenuData(
        user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
      );
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20">
      {/* PROFILE SECTION */}
      <div className="flex flex-col items-center justify-center pt-5 mb-7">
        <div className="relative">
          <img
          src={
        user?.profileImageUrl
          ? user.profileImageUrl
          : "/default-anime.png"
      }
          alt="Profile Image"
          className="w-20 h-20 rounded-full object-cover"
        />

        </div>

        {user?.role === "admin" && (
          <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1">
            Admin
          </div>
        )}

        <h5 className="text-gray-950 font-medium leading-6 mt-3">
          {user?.name || ""}
        </h5>

        <p className="text-[12px] text-gray-500">
          {user?.email || ""}
        </p>
      </div>

      {/* MENU ITEMS */}
      <div className="px-3">
        {sideMenuData.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-4 text-[15px]
              ${
                activeMenu === item.label
                  ? "text-primary bg-gradient-to-r from-blue-50/40 to-blue-100/50 border-r-4"
                  : "text-gray-700 hover:bg-gray-100"
              } py-3 px-6 mb-3 cursor-pointer`}
            onClick={() => handleClick(item.path)}
          >
            <item.icon className="text-xl" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;

