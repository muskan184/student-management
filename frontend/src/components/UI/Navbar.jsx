import { useAuth } from "../../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const hide =
    location.pathname === "/login" || location.pathname === "/signup";

  if (hide) return null;

  return (
    <nav className="w-full bg-black text-white px-6 py-3 flex item-center justify-between">
      <div className="flex items-center gap-3">
        <AiOutlineHome size={26} className="text-cyan-400" />
        <h1 className="font-bold"> AI Knowladge Hub</h1>
      </div>
      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-cyan-300">
          {" "}
          Home
        </Link>
        <Link to="/suggestions" className="hover:text-cyan-300">
          Suggestions
        </Link>
        <Link to="/users" className="hover:text-cyan-300">
          Users
        </Link>

        {user ? (
          <>
            <Link
              to="/profile"
              className="flex items-center gap-2 hover:text-cyan-300"
            >
              <FaRegUser /> {user.name || user.email.split("@")[0]}
            </Link>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-300">
              Login
            </Link>
            <Link to="/signup" className="text-green-300">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
