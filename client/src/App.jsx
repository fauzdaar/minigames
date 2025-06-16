import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import Navbar from "./components/Navbar";
import ChatPage from "./pages/ChatPage";
import Home from "./pages/Home";
import FlappyBall from "./games/FlappyBall";
import TicTacToe from "./games/TicTacToe";
import SnakeGame from "./games/SnakeGame";

function App() {
  return (
    <Router>
        <Navbar />

          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={<AuthForm type="login" />} />
            <Route path="/register" element={<AuthForm type="register" />}/>
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/flappyball" element={<FlappyBall />} />
            <Route path="/tictactoe" element={<TicTacToe />} />
            <Route path="/snakegame" element={<SnakeGame />} />
          </Routes>
    </Router>
  );
}

export default App;
