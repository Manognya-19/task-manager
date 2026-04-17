import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";
import { useUser } from "../../context/userContext";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
   const { user } = useUser();

  return (
    <div className="flex gap-5 bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
      {/* Mobile Menu Button */}
      <button
        className="block lg:hidden text-black"
        onClick={() => setOpenSideMenu(!openSideMenu)}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      {/* Title */}
      <h2 className="text-lg font-medium text-black">
        Task Manager
      </h2>

      {/* Profile Image */}
      <div className="ml-auto flex items-center gap-3">
        <img
          src={user?.profileImageUrl || "/default-avatar.png"}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border"
        />
      </div>


      {/* Mobile Side Menu */}
      {openSideMenu && (
        <div className="fixed top-[64px] -ml-4 bg-white">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
