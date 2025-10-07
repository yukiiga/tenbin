import { useState, useEffect } from "react";

export default function GameScreen({ players, onFinish }) {
  const [choices, setChoices] = useState({});
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelect = (player, num) => {
    setChoices((prev) => ({ ...prev, [player.name]: num }));
  };

  useEffect(() => {
    const allChosen = Object.keys(choices).length === players.length;
    if (allChosen) {
      const nums = Object.values(choices);
      const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
      const target = avg * 0.8;
      const diffs = players.map((p) => ({
        name: p.name,
        choice: choices[p.name],
        diff: Math.abs(choices[p.name] - target),
      }));
      diffs.sort((a, b) => a.diff - b.diff);
      const winner = diffs[0].name;

      const results = players.map((p) => ({
        ...p,
        choice: choices[p.name],
        score: p.name === winner ? p.score : p.score - 1,
        win: p.name === winner,
      }));

      setTimeout(() => onFinish(results), 1000);
    }
  }, [choices]);

  return (
    <div className="text-center">
      <h2 className="text-2xl mb-2">残り時間: {timeLeft}s</h2>
      <div className="grid grid-cols-10 gap-2 p-2 max-w-3xl mx-auto">
        {[...Array(101).keys()].map((n) => (
          <button
            key={n}
            onClick={() => handleSelect(players.find((p) => !p.isCPU), n)}
            className="bg-gray-700 hover:bg-emerald-600 px-3 py-2 rounded text-sm"
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
