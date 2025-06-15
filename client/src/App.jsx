import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import Navbar from "./components/Navbar";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <Router>
      <div className="h-screen flex flex-col bg-gray-800 text-white">
        <Navbar />
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/login" element={<div className="flex-grow flex items-center justify-center"><AuthForm type="login" /></div>} />
            <Route path="/register" element={<div className="flex-grow flex items-center justify-center"><AuthForm type="register" /></div>} />
            <Route path="/" element={<div className="flex-grow flex items-center justify-center text-2xl">🏠 Welcome Home</div>} />
            <Route path="/chat" element={<div className="flex-grow"><ChatPage /></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
