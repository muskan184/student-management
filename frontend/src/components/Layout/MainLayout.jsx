import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { LeftNavBar } from "../UI/LeftNavBar";
import { LogoutModal } from "../UI/LogoutModel";

export const MainLayout = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      <div className="flex gap-0.5 h-screen max-w-screen bg-[var(--background-color)]">
        {/* LEFT SIDEBAR */}
        <LeftNavBar setShowLogoutModal={setShowLogoutModal} />

        {/* MAIN CONTENT PANEL */}
        <div className="flex-1 bg-gray-100 dark:bg-white overflow-hidden">
          <Outlet context={{ setShowLogoutModal }} />
        </div>
      </div>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <LogoutModal onClose={() => setShowLogoutModal(false)} />
      )}
    </>
  );
};
