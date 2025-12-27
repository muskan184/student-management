import React from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { TopBar } from "../UI/TopBar";

export const RightLayout = () => {
  // 🔹 Get all context from MainLayout
  const context = useOutletContext();

  const sidebarWidth = context.isSidebarOpen ? "ml-[260px]" : "ml-[70px]";

  return (
    <div
      className={`w-full min-h-screen flex flex-col transition-all duration-300 ${sidebarWidth}`}
    >
      <TopBar setShowLogoutModal={context.setShowLogoutModal} />

      <div className="flex-1 p-4 overflow-auto">
        {/* 🔹 Forward context to children */}
        <Outlet context={context} />
        <Toaster position="top-center" containerStyle={{ marginTop: "90px" }} />
      </div>
    </div>
  );
};
