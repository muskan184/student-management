import React from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { TopBar } from "../UI/TopBar";

export const RightLayout = () => {
  const { setShowLogoutModal, isSidebarOpen } = useOutletContext();

  const sidebarWidth = isSidebarOpen ? "ml-[260px]" : "ml-[70px]";

  return (
    <div
      className={`w-full min-h-screen flex flex-col transition-all duration-300 ${sidebarWidth}`}
    >
      <TopBar setShowLogoutModal={setShowLogoutModal} />

      <div className="flex-1 p-4 overflow-auto">
        <Outlet />
        <Toaster position="top-center" containerStyle={{ marginTop: "90px" }} />
      </div>
    </div>
  );
};
