import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { LeftNavBar } from "../UI/LeftNavBar";

export const MainLayout = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // ⭐ Sidebar collapse state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex">
      {/* LEFT SIDEBAR */}
      <LeftNavBar
        setShowLogoutModal={setShowLogoutModal}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* RIGHT / MAIN CONTENT */}
      <Outlet context={{ setShowLogoutModal, isSidebarOpen }} />
    </div>
  );
};
