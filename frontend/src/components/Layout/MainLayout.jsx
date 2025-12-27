import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { LeftNavBar } from "../UI/LeftNavBar";

export const MainLayout = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState("");

  return (
    <div className="flex">
      <LeftNavBar
        setShowLogoutModal={setShowLogoutModal}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Provide context to all child routes */}
      <Outlet
        context={{
          setShowLogoutModal,
          isSidebarOpen,
          setIsSidebarOpen,
          setCurrentQuestion,
        }}
      />
    </div>
  );
};
