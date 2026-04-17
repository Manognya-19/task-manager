import React from "react";
import UI_IMG from "../../assets/images/auth-img.png.png";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-screen">
      
      {/* LEFT SIDE */}
      <div className="w-full md:w-[60%] px-12 pt-8">
        <h2 className="text-lg font-medium text-black">Task Manager</h2>
        {children}
      </div>

      {/* RIGHT SIDE (IMAGE + BLUE BG) */}
      <div className="hidden md:flex w-[40%] h-screen items-center justify-center bg-blue-600">
        <img
          src={UI_IMG}
          alt="Auth Illustration"
          className="w-[85%] object-contain"
        />
      </div>

    </div>
  );
};

export default AuthLayout;

