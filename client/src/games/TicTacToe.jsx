import { useState, useEffect } from "react";

const EMPTY_BOARD = Array(9).fill(null);
const PLAYER = "X";
const AI = "O";

const TicTacToe = () => {
  const [board, setBoard] = useState(EMPTY_BOARD);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [status, setStatus] = useState("Your turn");

  const checkWinner = (b) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // cols
      [0, 4, 8],
      [2, 4, 6], // diags
    ];
    for (let [a, b_, c] of lines) {
      if (b[a] && b[a] === b[b_] && b[a] === b[c]) return b[a];
    }
    return b.every(Boolean) ? "draw" : null;
  };

  const minimax = (newBoard, depth, isMaximizing) => {
    const result = checkWinner(newBoard);
    if (result === AI) return 10 - depth;
    if (result === PLAYER) return depth - 10;
    if (result === "draw") return 0;

    if (isMaximizing) {
      let best = -Infinity;
      newBoard.forEach((cell, i) => {
        if (!cell) {
          newBoard[i] = AI;
          best = Math.max(best, minimax(newBoard, depth + 1, false));
          newBoard[i] = null;
        }
      });
      return best;
    } else {
      let best = Infinity;
      newBoard.forEach((cell, i) => {
        if (!cell) {
          newBoard[i] = PLAYER;
          best = Math.min(best, minimax(newBoard, depth + 1, true));
          newBoard[i] = null;
        }
      });
      return best;
    }
  };

  const aiMove = () => {
    const difficulty = 0.9; // 80% chance to play optimally

    let move;
    const availableMoves = board
      .map((cell, i) => (cell ? null : i))
      .filter((i) => i !== null);

    if (Math.random() < difficulty) {
      // Use Minimax to find best move
      let bestScore = -Infinity;
      availableMoves.forEach((i) => {
        board[i] = AI;
        const score = minimax(board, 0, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      });
    } else {
      // Pick a random valid move
      const randomIndex = Math.floor(Math.random() * availableMoves.length);
      move = availableMoves[randomIndex];
    }

    if (move !== undefined) {
      const newBoard = [...board];
      newBoard[move] = AI;
      setBoard(newBoard);
      setIsPlayerTurn(true);
    }
  };

  const handleClick = (i) => {
    if (board[i] || !isPlayerTurn || checkWinner(board)) return;
    const newBoard = [...board];
    newBoard[i] = PLAYER;
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  useEffect(() => {
    const winner = checkWinner(board);
    if (winner) {
      setStatus(
        winner === "draw"
          ? "It's a draw!"
          : winner === PLAYER
          ? "You win!"
          : "AI wins!"
      );
    } else if (!isPlayerTurn) {
      setTimeout(() => aiMove(), 300);
    }
  }, [board, isPlayerTurn]);

  const resetGame = () => {
    setBoard(EMPTY_BOARD);
    setIsPlayerTurn(true);
    setStatus("Your turn");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">❌ Tic Tac Toe ⭕</h1>
      <p className="mb-4 text-lg">{status}</p>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="w-24 h-24 text-3xl font-bold rounded bg-gray-700 hover:bg-gray-600"
          >
            {cell}
          </button>
        ))}
      </div>
      <button
        onClick={resetGame}
        className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded"
      >
        Reset
      </button>
    </div>
  );
};

export default TicTacToe;
