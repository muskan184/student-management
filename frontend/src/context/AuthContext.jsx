// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  deleteUser,
  fetchprofile,
  logoutUser,
  signupUser,
  updateUser,
} from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const qc = useQueryClient();
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  console.log("AuthContext token:", token);

  const { data: user, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: fetchprofile,
    enabled: !!token,
    staleTime: Infinity,
    cacheTime: 2 * 60 * 60 * 1000, // 2 hours
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    keepPreviousData: true,
  });

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: async (credentials) => {
      const res = await loginUser(credentials);
      return res;
    },
    onSuccess: (res) => {
      // backend sends token in res.token
      const token = res.token || res.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        setToken(token);
        qc.invalidateQueries(["authUser"]);
      }
    },
  });
  console.log("AuthContext user:", user);

  const registerMutation = useMutation({
    mutationKey: ["signup"],
    mutationFn: async (credentials) => {
      const res = await signupUser(credentials);
      return res;
    },
    onSuccess: (res) => {
      const token = res.token || res.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        setToken(token);
        qc.invalidateQueries(["authUser"]);
      }
    },
  });

  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      localStorage.removeItem("token");
      setToken(null);
      qc.removeQueries(["authUser"]);
    },
  });

  const updateMutation = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: (updates) => updateUser(updates),
    onSuccess: (res) => qc.invalidateQueries(["authUser"]),
  });

  const deleteMutation = useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: () => deleteUser(),
    onSuccess: () => {
      localStorage.removeItem("token");
      setToken(null);
      qc.removeQueries(["authUser"]);
    },
  });

  const changePassMutation = useMutation({
    mutationKey: ["changePassword"],
    mutationFn: (payload) => changePassword(payload),
  });

  const logout = () => logoutMutation.mutate();

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        token,
        setToken,
        loginMutation,
        registerMutation,
        logoutMutation,
        logout,
        updateMutation,
        deleteMutation,
        changePassMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
