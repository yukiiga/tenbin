import React, { useState } from 'react';
import { Scale, Users } from 'lucide-react';

export default function TitleScreen({ onStart }) {
  const [playerCount, setPlayerCount] = useState(5);

  return (
    <div className="fixed inset-0 bg-[#0a1628] bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:20px_20px] overflow-hidden">
      <div className="h-full flex items-center justify-center p-8">
        <div className="w-full max-w-4xl text-center">
          <div className="mb-12">
            <Scale className="w-40 h-40 mx-auto text-cyan-400 mb-8 opacity-80" strokeWidth={1} />
            <h1 className="text-8xl font-bold text-white mb-4 tracking-[0.3em]" style={{ fontFamily: 'serif' }}>
              てんびん
            </h1>
            <div className="text-xs tracking-[0.5em] text-cyan-400 mb-2">[GAME]</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg p-8 border border-cyan-900/30 mb-8">
            <label className="block text-white text-xl mb-6 flex items-center justify-center gap-3">
              <Users className="w-7 h-7 text-cyan-400" />
              プレイヤー人数
            </label>
            <select
              value={playerCount}
              onChange={(e) => setPlayerCount(Number(e.target.value))}
              className="w-full bg-slate-800 text-white rounded-lg p-5 text-2xl border-2 border-cyan-500/50 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}人</option>
              ))}
            </select>
            {playerCount < 5 && (
              <p className="text-cyan-400 mt-4 text-sm">
                残り{5 - playerCount}人はCPUが参加します
              </p>
            )}
          </div>

          <button
            onClick={() => onStart(playerCount)}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-16 py-5 rounded-lg text-2xl font-bold transition-all transform hover:scale-105"
          >
            ゲームスタート
          </button>
        </div>
      </div>
    </div>
  );
}