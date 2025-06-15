import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: {
    token: localStorage.getItem("token"),
  },
});

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [recipient, setRecipient] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const messagesEndRef = useRef(null);

  // Fetch users dynamically
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Join DM room when recipient is selected
  useEffect(() => {
    if (username && recipient) {
      const room = `dm_${[username, recipient].sort().join("_")}`;
      socket.emit("join", { username, room });
    }
  }, [recipient]);

  // Handle incoming messages
  useEffect(() => {
    socket.on("private_message", (msg) => {
      const { sender, recipient: msgRecipient } = msg;
      const isForThisUser = [sender, msgRecipient].includes(username);
      if (isForThisUser) setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("private_message");
    };
  }, [username]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = () => {
    if (!recipient || !text.trim()) return;
    socket.emit("private_message", {
      sender: username,
      recipient,
      text,
      token,
    });
    setText("");
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-4">Welcome, {username}</h2>

      <select
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="mb-4 p-2 rounded bg-gray-700 text-white"
      >
        <option value="">-- Select recipient --</option>
        {users && users.length > 0 ? (
          users
            .filter((u) => u !== username)
            .map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))
        ) : (
          <option disabled>Loading users...</option>
        )}
      </select>

      <div className="flex-1 overflow-y-auto bg-gray-900 p-4 rounded shadow">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <span className="font-bold text-blue-400">{msg.sender}:</span>{" "}
            <span>{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 flex">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-2 rounded bg-gray-700 text-white"
          placeholder="Type a private message..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
