// import React from "react";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { LeftNavBar } from "../UI/LeftNavBar";
import { LogoutModal } from "../UI/LogoutModel";

export const MainLayout = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  return (
    <>
      <div className="flex gap-0.5 h-screen max-w-screen bg-[var(--background-color)]  ">
        <LeftNavBar setShowLogoutModal={setShowLogoutModal} />
        <div className=" bg-gray-100 dark:bg-white flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
      {showLogoutModal && (
        <LogoutModal onClose={() => setShowLogoutModal(false)} />
      )}
    </>
  );
};
