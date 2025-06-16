import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

const AuthForm = ({ type }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const isLogin = type === "login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/login" : "/register";

    try {
      const res = await fetch(`https://minigames-tjnz.onrender.com${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data.error || "Something went wrong");
        return;
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        navigate("/chat");
      } else {
        navigate("/login");
      }
    } catch (error) {
      setErr("Server error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-black px-4 text-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        {isLogin ? "Welcome Back 👋" : "Create Account 📝"}
      </h2>

      {err && <div className="text-red-400 mb-4 text-sm">{err}</div>}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6"
      >
        <div className="flex items-center border border-gray-700 rounded-md p-3 bg-gray-800">
          <FaUser className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Username"
            className="w-full bg-transparent outline-none text-white placeholder-gray-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center border border-gray-700 rounded-md p-3 bg-gray-800">
          <FaLock className="text-gray-400 mr-3" />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-transparent outline-none text-white placeholder-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 py-3 rounded-md font-semibold"
        >
          {isLogin ? "Log In 🚀" : "Sign Up 🎉"}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
