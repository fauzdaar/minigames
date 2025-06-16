import { useEffect, useRef, useState } from "react";

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);

  const box = 20;
  const canvasSize = 400;
  const intervalRef = useRef(null);

  let snake = useRef([{ x: 9 * box, y: 10 * box }]);
  let direction = useRef("RIGHT");
  let food = useRef({
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box,
  });

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    setPaused(false);
    direction.current = "RIGHT";
    snake.current = [{ x: 9 * box, y: 10 * box }];
    food.current = {
      x: Math.floor(Math.random() * (canvasSize / box)) * box,
      y: Math.floor(Math.random() * (canvasSize / box)) * box,
    };
  };

  const togglePause = () => setPaused((prev) => !prev);

  const changeDirection = (e) => {
    const key = e.key;
    if (key === "ArrowLeft" && direction.current !== "RIGHT") direction.current = "LEFT";
    if (key === "ArrowUp" && direction.current !== "DOWN") direction.current = "UP";
    if (key === "ArrowRight" && direction.current !== "LEFT") direction.current = "RIGHT";
    if (key === "ArrowDown" && direction.current !== "UP") direction.current = "DOWN";
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault(); // ✅ prevent scrolling
        changeDirection(e);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    const game = () => {
      if (paused || gameOver) return;

      ctx.clearRect(0, 0, canvasSize, canvasSize);

      // Draw food
      ctx.fillStyle = "red";
      ctx.fillRect(food.current.x, food.current.y, box, box);

      // Move snake
      let newHead = { ...snake.current[0] };
      if (direction.current === "LEFT") newHead.x -= box;
      if (direction.current === "UP") newHead.y -= box;
      if (direction.current === "RIGHT") newHead.x += box;
      if (direction.current === "DOWN") newHead.y += box;

      // Collision
      if (
        newHead.x < 0 ||
        newHead.y < 0 ||
        newHead.x >= canvasSize ||
        newHead.y >= canvasSize ||
        snake.current.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setGameOver(true);
        clearInterval(intervalRef.current);
        return;
      }

      snake.current.unshift(newHead);

      if (newHead.x === food.current.x && newHead.y === food.current.y) {
        setScore((prev) => prev + 1);
        food.current = {
          x: Math.floor(Math.random() * (canvasSize / box)) * box,
          y: Math.floor(Math.random() * (canvasSize / box)) * box,
        };
      } else {
        snake.current.pop();
      }

      // Draw snake
      ctx.fillStyle = "lime";
      snake.current.forEach((seg) => ctx.fillRect(seg.x, seg.y, box, box));
    };

    intervalRef.current = setInterval(game, 150);
    return () => clearInterval(intervalRef.current);
  }, [gameOver, paused]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h2 className="text-3xl font-bold mb-4">🐍 Snake Game</h2>
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        className="border border-white bg-gray-900"
      ></canvas>

      <div className="mt-4 text-xl">Score: {score}</div>
      {gameOver && <div className="text-red-500 mt-2">Game Over!</div>}

      <div className="flex gap-4 mt-6">
        <button
          onClick={resetGame}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          🔁 Restart
        </button>
        <button
          onClick={togglePause}
          className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600"
        >
          {paused ? "▶ Resume" : "⏸ Pause"}
        </button>
      </div>
    </div>
  );
};

export default SnakeGame;
