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

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow">
      <Link to="/" className="text-xl font-bold text-blue-400">
        🎮 MiniGames
      </Link>

      <div className="space-x-4">
        {username ? (
          <>
            <span className="text-gray-300">Hi, {username}</span>
            <Link to="/chat" className="hover:text-blue-400">
              Chat
            </Link>
            <button onClick={logout} className="text-red-400 hover:text-red-600">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-400">
              Login
            </Link>
            <Link to="/register" className="hover:text-blue-400">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
