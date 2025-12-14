// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { Login } from "./pages/Login";
import StudentDashboard from "./pages/student/StudentDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import TeacherProfile from "./pages/teacher/TeacherProfile";
import AdminProfile from "./pages/admin/AdminProfile";
import { RoleRoute } from "./components/RoleRoute";
import Home from "./pages/Home";
import { MainLayout } from "./components/Layout/MainLayout";
import { RightLayout } from "./components/Layout/RightLayout";
import Signup from "./pages/Signup";
import AllNotes from "./pages/student/notes/AllNotes";
import CreateNote from "./pages/student/notes/CreateNotes";
import NoteDetails from "./pages/student/notes/NotesDetails";
import EditNote from "./pages/student/notes/EditNotes";

export default function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<MainLayout />}>
        <Route element={<RightLayout />}>
          <Route index element={<Home />} />
          <Route
            path="/student/dashboard"
            element={
              <RoleRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/teacher/dashboard"
            element={
              <RoleRoute allowedRoles={["teacher"]}>
                <TeacherDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/student/profile"
            element={
              <RoleRoute allowedRoles={["student"]}>
                <StudentProfile />
              </RoleRoute>
            }
          />
          <Route
            path="/teacher/profile"
            element={
              <RoleRoute allowedRoles={["teacher"]}>
                <TeacherProfile />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <AdminProfile />
              </RoleRoute>
            }
          />

          <Route
            path="/no-access"
            element={<div className="p-8 text-center">Access Denied</div>}
          />
          <Route path="/student/notes" element={<AllNotes />} />
          <Route path="/student/notes/create" element={<CreateNote />} />
          <Route path="/student/notes/:id" element={<NoteDetails />} />
          <Route path="/student/notes/:id/edit" element={<EditNote />} />
        </Route>
      </Route>
    </Routes>
  );
}
