import React from "react";

const StartScreen = ({ numPlayers, setNumPlayers, onNext }) => {
  return (
    <div className="flex flex-col items-center text-center space-y-8">
      <h1 className="text-4xl font-bold mb-6">Tenbin Game</h1>
      <p className="text-lg">プレイ人数を選んでください（1〜5人）</p>
      <input
        type="range"
        min="1"
        max="5"
        value={numPlayers}
        onChange={(e) => setNumPlayers(Number(e.target.value))}
        className="w-64 accent-yellow-400"
      />
      <p className="text-xl mt-2">{numPlayers} 人でプレイ</p>
      <button
        onClick={onNext}
        className="mt-8 bg-yellow-400 text-black px-8 py-3 rounded-xl text-lg hover:bg-yellow-300"
      >
        次へ
      </button>
    </div>
  );
};

export default StartScreen;
