import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { TopBar } from "../UI/TopBar";
export const RightLayout = () => {
  return (
    <div className="w-full h-screen flex flex-col">
      <TopBar />
      <div className="right-pannel-scrollbar h-full overflow-auto">
        <Outlet />
        <Toaster containerStyle={{ marginTop: "95px" }} position="top-center" />
      </div>
    </div>
  );
};
