import { Link } from "react-router-dom";

const games = [
  {
    name: "Flappy Ball",
    description: "Fly through pipes and survive as long as possible.",
    path: "/flappyball",
  },
  {
    name: "Tic Tac Toe",
    description: "Play classic tic tac toe against a friend or AI.",
    path: "/tictactoe",
  },
  {
    name: "Snake Game",
    description: "Play the relaxing Snake Game.",
    path: "/snakegame",
  },
];

const Home = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Starfield background */}
      <div className="absolute inset-0 starfield" />

      {/* Content Layer */}
      <div className="relative z-10 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-12 px-6">
        <h1 className="text-4xl font-bold text-center mb-10">🎮 MiniGames</h1>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {games.map((game) => (
            <div
              key={game.name}
              className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition"
            >
              <div>
                <h2 className="text-2xl font-semibold mb-2">{game.name}</h2>
                <p className="text-gray-400 mb-4">{game.description}</p>
              </div>
              <Link
                to={game.path}
                className="mt-auto inline-block text-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
              >
                Play
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
