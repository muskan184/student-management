import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const StudentRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "student") {
    return <Navigate to="/no-access" replace />;
  }

  return children;
};
export default StudentRoute;
