import React, { useRef, useEffect, useState } from "react";

const FlappyBall = () => {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);

  const gravity = 0.5;
  const flapStrength = -8;

  let ball = { x: 80, y: 200, velocity: 0 };
  let pipes = [];
  const pipeWidth = 60;
  const pipeGap = 150;
  const pipeSpeed = 2;

  const resetGame = () => {
    ball = { x: 80, y: 200, velocity: 0 };
    pipes = [];
    scoreRef.current = 0;
    setScore(0);
    setGameOver(false);
  };

  const flap = () => {
    if (!gameOver) ball.velocity = flapStrength;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        flap();
      }
    };

    const handleClick = (e) => {
      e.preventDefault();
      flap();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClick);
    document.addEventListener("touchstart", handleClick);

    let animationFrame;
    let frameCount = 0;

    const spawnPipe = () => {
      const topHeight = Math.random() * 200 + 50;
      pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: canvas.height - topHeight - pipeGap,
        counted: false,
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ball
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 12, 0, Math.PI * 2);
      ctx.fill();

      // Pipes
      ctx.fillStyle = "#22d3ee";
      pipes.forEach((pipe) => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(
          pipe.x,
          canvas.height - pipe.bottom,
          pipeWidth,
          pipe.bottom
        );
      });

      // Score (live from ref)
      ctx.fillStyle = "white";
      ctx.font = "24px sans-serif";
      ctx.fillText(`Score: ${scoreRef.current}`, 20, 40);
    };

    const update = () => {
      frameCount++;

      ball.velocity += gravity;
      ball.y += ball.velocity;

      pipes.forEach((pipe) => {
        pipe.x -= pipeSpeed;
      });

      pipes = pipes.filter((pipe) => pipe.x + pipeWidth > 0);

      if (frameCount % 90 === 0) {
        spawnPipe();
      }

      pipes.forEach((pipe) => {
        const withinX =
          ball.x + 12 > pipe.x && ball.x - 12 < pipe.x + pipeWidth;
        const hitTop = ball.y - 12 < pipe.top;
        const hitBottom = ball.y + 12 > canvas.height - pipe.bottom;

        if (withinX && (hitTop || hitBottom)) {
          setGameOver(true);
          setScore(scoreRef.current);
        }

        if (!pipe.counted && pipe.x + pipeWidth < ball.x) {
          pipe.counted = true;
          scoreRef.current += 1;
        }
      });

      if (ball.y > canvas.height || ball.y < 0) {
        setGameOver(true);
        setScore(scoreRef.current);
      }
    };

    const loop = () => {
      if (!gameOver) {
        update();
        draw();
        animationFrame = requestAnimationFrame(loop);
      } else {
        draw();
        ctx.fillStyle = "white";
        ctx.font = "bold 36px sans-serif";
        ctx.fillText("Game Over", canvas.width / 2 - 90, canvas.height / 2);
      }
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [gameOver]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-6">Flappy Ball 🟡</h1>

      <canvas
        ref={canvasRef}
        width={400}
        height={500}
        className="border-4 border-slate-700 bg-slate-800 rounded"
      ></canvas>

      {gameOver && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-xl font-semibold">Final Score: {score}</p>
          <button
            onClick={resetGame}
            className="mt-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded text-white font-semibold"
          >
            Restart
          </button>
        </div>
      )}

      <p className="mt-4 text-sm text-slate-400 text-center px-4">
        Tap screen or press <strong>Space</strong> to flap
      </p>
    </div>
  );
};

export default FlappyBall;
