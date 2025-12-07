import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { MainLayout } from "./components/Layout/MainLayout";
import { RightLayout } from "./components/Layout/RightLayout";
import Home from "./pages/Home";
import PageLoader from "./components/UI/PageLoader";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";

export const App = () => {
  const { token, isLoading } = useAuth();
  const isAuthenticated = Boolean(token);

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen">
      <Routes>
        {/*  ALWAYS visible Layout */}
        <Route path="/" element={<MainLayout />}>
          <Route element={<RightLayout />}>
            <Route index element={<Home />} />
          </Route>
        </Route>

        {/* PUBLIC ROUTES */}
        <Route
          path="/signup"
          element={!isAuthenticated ? <Signup /> : <Navigate to="/" />}
        />

        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
};
