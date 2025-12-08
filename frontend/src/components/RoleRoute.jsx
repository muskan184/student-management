// src/components/RoleRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const RoleRoute = ({ allowedRoles = [], children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  const role = (user.role || "").toLowerCase();
  if (!allowedRoles.map((r) => r.toLowerCase()).includes(role))
    return <Navigate to="/no-access" replace />;
  return children;
};
