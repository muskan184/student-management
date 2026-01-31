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
import FlashcardList from "./pages/student/flashcards/FlashcardList";
import CreateFlashcard from "./pages/student/flashcards/CreateFlashcard";
import FlashcardPlayer from "./pages/student/flashcards/FlashcardPlayer";
import AIFlashcard from "./pages/student/flashcards/AIFlashcard";
import EditFlashcard from "./pages/student/flashcards/EditFlashcard";
import PlannerList from "./pages/student/planner/PlannerList";
import CreatePlanner from "./pages/student/planner/CreatePlanner";
import EditPlanner from "./pages/student/planner/EditPlanner";
import AskQuestion from "./pages/student/forum/AskQuestion";
// import ForumHome from "./pages/student/forum/ForumHome";
import QuestionList from "./pages/student/forum/QuestionList";
import QuestionDetail from "./pages/student/forum/QuestionDetail";
import AIChat from "./pages/student/ai/AIChat";
import AIHistory from "./pages/student/ai/AIHistory";
import TeacherQuestions from "./pages/teacher/TeacherQuestion";
import TeacherQuestionOpen from "./pages/teacher/TeacherQuestionOpen";
import NotificationsPage from "./pages/Notification";
import { UserProfilePage } from "./pages/UserProfilePage";

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
          <Route path="/student/flashcards" element={<FlashcardList />} />
          <Route
            path="/student/flashcards/create"
            element={<CreateFlashcard />}
          />
          <Route
            path="/student/flashcards/play/:id"
            element={<FlashcardPlayer />}
          />
          <Route path="/student/flashcards/ai" element={<AIFlashcard />} />
          <Route
            path="/student/flashcards/edit/:id"
            element={<EditFlashcard />}
          />
          <Route path="/student/planner" element={<PlannerList />} />
          <Route path="/student/planner/add-task" element={<CreatePlanner />} />
          <Route path="/student/planner/edit/:id" element={<EditPlanner />} />
          <Route path="/student/questions/ask" element={<AskQuestion />} />
          {/* <Route path="/student/questions" element={<ForumHome />} /> */}
          <Route path="/student/questions" element={<QuestionList />} />
          <Route path="/student/qa/ask" element={<AskQuestion />} />
          <Route path="/student/forum/:id" element={<QuestionDetail />} />
          <Route path="/student/ai" element={<AIChat />} />
          <Route path="/student/ai-chat/:id" element={<AIChat />} />
          <Route path="/student/ai-history" element={<AIHistory />} />
          <Route path="/teacher/questions" element={<TeacherQuestions />} />
          <Route path="/profile/:id" element={<UserProfilePage />} />
          <Route
            path="/teacher/question/:id"
            element={<TeacherQuestionOpen />}
          />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
