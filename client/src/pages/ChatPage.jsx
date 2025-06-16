import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [recipient, setRecipient] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [username] = useState(localStorage.getItem("username"));
  const [token] = useState(localStorage.getItem("token"));
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (token && !socketRef.current) {
      socketRef.current = io("https://minigames-tjnz.onrender.com", {
        auth: { token },
        withCredentials: true,
        reconnection: true,
      });

      socketRef.current.on("private_message", (msg) => {
        const { sender, recipient: msgRecipient } = msg;
        if ([sender, msgRecipient].includes(username)) {
          setMessages((prev) => [...prev, msg]);
        }
      });

      return () => {
        socketRef.current.disconnect();
        socketRef.current = null;
      };
    }
  }, [token, username]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://minigames-tjnz.onrender.com/users");
        const data = await res.json();
        const filtered = data.filter((u) => u !== username);
        setUsers(filtered);
        if (filtered.length > 0) setRecipient(filtered[0]);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };
    fetchUsers();
  }, [username]);

  useEffect(() => {
    if (username && recipient && socketRef.current) {
      const room = `dm_${[username, recipient].sort().join("_")}`;
      socketRef.current.emit("join", { username, room });
    }
  }, [recipient, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!recipient || !text.trim()) return;
    const msg = { sender: username, recipient, text, token };
    socketRef.current.emit("private_message", msg);
    setMessages((prev) => [...prev, { sender: username, recipient, text }]);
    setText("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl h-[80vh] bg-white/5 backdrop-blur-lg shadow-2xl border border-white/20 rounded-2xl flex overflow-hidden">
        {/* Left: Users List */}
        <div className="w-1/3 border-r border-white/10 bg-gray-900/40 p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <ul className="space-y-2">
            {users.map((user) => (
              <li
                key={user}
                onClick={() => setRecipient(user)}
                className={`cursor-pointer px-4 py-2 rounded-lg transition ${
                  user === recipient
                    ? "bg-purple-600 text-white"
                    : "hover:bg-gray-700 text-gray-200"
                }`}
              >
                {user}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Chat Section */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-purple-700/30 via-indigo-600/30 to-purple-800/30 border-b border-white/10">
            <h2 className="text-lg font-semibold">
              Chat with {recipient || "..."}, You are {username}
            </h2>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar bg-gray-900/60">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[75%] px-4 py-2 rounded-xl transition ${
                  msg.sender === username
                    ? "ml-auto bg-blue-600/70 hover:bg-blue-600"
                    : "mr-auto bg-gray-700/60 hover:bg-gray-700"
                }`}
              >
                <div className="text-xs font-semibold opacity-80">
                  {msg.sender === username ? "You" : msg.sender}
                </div>
                <div className="text-sm">{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-gray-900/60 border-t border-white/10 flex items-center">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              onClick={sendMessage}
              className="ml-3 px-5 py-2 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-lg hover:scale-105 hover:shadow-md transition-all"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
