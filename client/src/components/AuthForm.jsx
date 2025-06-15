import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      const res = await fetch(`http://localhost:5000${endpoint}`, {
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
    <div className="min-h-screen flex justify-center items-center bg-gray-800 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg shadow-xl w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>
        {err && <div className="text-red-500 mb-2 text-sm">{err}</div>}
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 p-2 bg-gray-700 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 bg-gray-700 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
        >
          {isLogin ? "Log In" : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
