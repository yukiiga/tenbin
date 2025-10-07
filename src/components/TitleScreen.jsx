// src/components/TitleScreen.jsx

import React, { useState } from 'react';
import { Scale, Users, Zap, Brain, Cpu } from 'lucide-react';

export default function TitleScreen({ onStart }) {
  const [playerCount, setPlayerCount] = useState(5);
  const [difficulty, setDifficulty] = useState('normal');

  const difficulties = [
    { 
      value: 'easy', 
      label: 'Easy', 
      icon: Zap,
      description: '初心者向け',
      color: 'text-green-400',
      bgColor: 'bg-green-600',
      hoverColor: 'hover:bg-green-500',
      borderColor: 'border-green-500'
    },
    { 
      value: 'normal', 
      label: 'Normal', 
      icon: Brain,
      description: '標準',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-600',
      hoverColor: 'hover:bg-cyan-500',
      borderColor: 'border-cyan-500'
    },
    { 
      value: 'hard', 
      label: 'Hard', 
      icon: Cpu,
      description: '上級者向け',
      color: 'text-red-400',
      bgColor: 'bg-red-600',
      hoverColor: 'hover:bg-red-500',
      borderColor: 'border-red-500'
    }
  ];

  const selectedDifficulty = difficulties.find(d => d.value === difficulty);

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

          <div className="space-y-6 mb-8">
            {/* プレイヤー人数選択 */}
            <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg p-8 border border-cyan-900/30">
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

            {/* 難易度選択 */}
            <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg p-8 border border-cyan-900/30">
              <label className="block text-white text-xl mb-6">
                CPU難易度
              </label>
              <div className="grid grid-cols-3 gap-4">
                {difficulties.map(diff => {
                  const Icon = diff.icon;
                  const isSelected = difficulty === diff.value;
                  return (
                    <button
                      key={diff.value}
                      onClick={() => setDifficulty(diff.value)}
                      className={`p-6 rounded-lg transition-all border-2 ${
                        isSelected 
                          ? `${diff.bgColor} ${diff.borderColor} scale-105` 
                          : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      <Icon className={`w-12 h-12 mx-auto mb-3 ${isSelected ? 'text-white' : diff.color}`} />
                      <div className={`text-2xl font-bold mb-2 ${isSelected ? 'text-white' : diff.color}`}>
                        {diff.label}
                      </div>
                      <div className={`text-sm ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                        {diff.description}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* 難易度説明 */}
              <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className={`text-lg font-bold mb-2 ${selectedDifficulty.color}`}>
                  {selectedDifficulty.label}モード
                </div>
                <div className="text-slate-300 text-sm">
                  {difficulty === 'easy' && '🟢 CPUは基本的な戦略のみ使用。初めての方におすすめ。'}
                  {difficulty === 'normal' && '🔵 CPUはバランスの取れた戦略を使用。標準的な難易度。'}
                  {difficulty === 'hard' && '🔴 CPUは高度な読み合いと戦略を使用。上級者向け。'}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onStart(playerCount, difficulty)}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-16 py-5 rounded-lg text-2xl font-bold transition-all transform hover:scale-105"
          >
            ゲームスタート
          </button>
        </div>
      </div>
    </div>
  );
}