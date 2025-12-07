import React from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { TopBar } from "../UI/TopBar";

export const RightLayout = () => {
  // Receive props from MainLayout
  const { setShowLogoutModal } = useOutletContext();

  return (
    <div className="w-full h-screen flex flex-col">
      {/* TOP BAR */}
      <TopBar setShowLogoutModal={setShowLogoutModal} />

      {/* MAIN RIGHT CONTENT */}
      <div className="right-pannel-scrollbar flex-1 overflow-auto">
        <Outlet />

        {/* Toast notifications */}
        <Toaster position="top-center" containerStyle={{ marginTop: "90px" }} />
      </div>
    </div>
  );
};
