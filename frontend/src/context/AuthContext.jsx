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

  const { data: user, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: fetchprofile,
    enabled: !!token,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const loginMutation = useMutation({
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

  const registerMutation = useMutation({
    mutationFn: (payload) => signupUser(payload),
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
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      localStorage.removeItem("token");
      setToken(null);
      qc.removeQueries(["authUser"]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updates) => updateUser(updates),
    onSuccess: (res) => qc.invalidateQueries(["authUser"]),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteUser(),
    onSuccess: () => {
      localStorage.removeItem("token");
      setToken(null);
      qc.removeQueries(["authUser"]);
    },
  });

  const changePassMutation = useMutation({
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
