import React from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { TopBar } from "../UI/TopBar";

export const RightLayout = () => {
  // 🔹 Get all context from MainLayout
  const context = useOutletContext();

  return (
    <div className="w-full h-screen flex flex-col">
      {/* TopBar - fixed at top */}
      <div className="sticky top-0 z-50">
        <TopBar setShowLogoutModal={context.setShowLogoutModal} />
      </div>

      {/* Main content */}
      <div className="flex-1 h-full p-4 overflow-auto">
        {/* 🔹 Forward context to children */}
        <Outlet context={context} />
        <Toaster position="top-center" containerStyle={{ marginTop: "90px" }} />
      </div>
    </div>
  );
};