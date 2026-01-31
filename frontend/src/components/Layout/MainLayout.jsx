import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { LeftNavBar } from "../UI/LeftNavBar";

export const MainLayout = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - fixed on left */}
      <LeftNavBar
        setShowLogoutModal={setShowLogoutModal}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main content area */}
      <div className={`transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "md:pl-72" : "md:pl-20"
      }`}>
        <Outlet
          context={{
            setShowLogoutModal,
            isSidebarOpen,
            setIsSidebarOpen,
            setCurrentQuestion,
          }}
        />
      </div>
    </div>
  );
};