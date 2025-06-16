import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    setUsername(storedUser);
  }, [location]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-black via-gray-900 to-black text-white shadow-lg sticky w-full top-0 z-50 backdrop-blur-md">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-bold tracking-wide text-blue-400 hover:text-white transition duration-200"
      >
        🎮 MiniGames
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-4">
        {username ? (
          <>
            {/* Avatar or Initial */}
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              {username[0].toUpperCase()}
            </div>

            {/* Username */}
            <span className="text-sm text-gray-300 hidden sm:inline">
              Hi, <span className="text-white font-semibold">{username}</span>
            </span>

            <Link
              to="/chat"
              className={`text-sm hover:text-blue-400 transition ${
                isActive("/chat") ? "underline text-blue-400" : ""
              }`}
            >
              Chat
            </Link>

            <button
              onClick={logout}
              className="text-sm text-red-400 hover:text-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`text-sm hover:text-blue-400 transition ${
                isActive("/login") ? "underline text-blue-400" : ""
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`text-sm hover:text-green-400 transition ${
                isActive("/register") ? "underline text-green-400" : ""
              }`}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
