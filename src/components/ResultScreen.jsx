// src/components/ResultScreen.jsx

import React from 'react';
import { Home } from 'lucide-react';
import icon1 from '../assets/icon1.png';
import icon2 from '../assets/icon2.png';
import icon3 from '../assets/icon3.png';
import icon4 from '../assets/icon4.png';
import playerIcon from '../assets/player-icon.png';

const PlayerIcon = ({ icon, size = "w-20 h-20" }) => {
  const iconMap = { icon1, icon2, icon3, icon4, cpu: playerIcon };
  
  return (
    <div className={`${size} rounded-lg overflow-hidden border-2 border-white/30 bg-slate-800`}>
      <img 
        src={iconMap[icon] || icon1} 
        alt={icon}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default function ResultScreen({ result, players, round, onNext, onBackToTitle }) {
  const newlyEliminated = players.filter(p => p.eliminated && p.score === -10);
  const activePlayers = players.filter(p => !p.eliminated || newlyEliminated.includes(p));

  return (
    <div className="fixed inset-0 bg-[#0a1628] bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:20px_20px] overflow-auto">
      <div className="min-h-full flex items-center justify-center p-8">
        <div className="w-full max-w-7xl">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-white">第{round}回戦 結果</h2>
            <button
              onClick={onBackToTitle}
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              タイトルに戻る
            </button>
          </div>

          {/* WIN表示 */}
          {result.winners.length > 0 && (
            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-white mb-6 tracking-wider">WIN</div>
              <div className="flex justify-center gap-6">
                {result.winners.map(id => {
                  const p = players.find(pl => pl.id === id);
                  return (
                    <div key={id} className="relative">
                      <div className="border-4 border-red-500 rounded-lg p-2 bg-slate-900/60">
                        <PlayerIcon icon={p.icon} size="w-32 h-32" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* プレイヤー情報 */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {activePlayers.map(p => {
              const choice = result.choices?.find(c => c.playerId === p.id);
              const isWinner = result.winners.includes(p.id);
              const isInvalid = result.invalidVotes?.includes(p.id);
              const penalty = isInvalid ? -1 : (!isWinner ? (result.isPerfect ? -2 : -1) : 0);
              
              return (
                <div key={p.id} className="text-center">
                  <div className={`mb-3 ${isWinner ? 'opacity-30' : ''}`}>
                    <PlayerIcon icon={p.icon} size="w-24 h-24 mx-auto" />
                  </div>
                  <div className="bg-[#c8ddc8] text-slate-900 text-4xl font-bold py-3 rounded-md mb-2">
                    {choice ? choice.number : '-'}
                  </div>
                  {!isWinner && (
                    <div className="text-red-400 text-3xl font-bold">
                      {penalty}
                    </div>
                  )}
                  {isWinner && (
                    <div className="text-slate-600 text-3xl font-bold">
                      0
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 答え表示 */}
          <div className="text-center mb-8">
            <div className="inline-block bg-slate-900/60 border-2 border-cyan-500 rounded-lg px-12 py-4">
              <div className="text-slate-400 text-lg mb-1">答え</div>
              <div className="text-5xl font-bold text-cyan-300">{result.target.toFixed(2)}</div>
            </div>
          </div>

          {/* 特殊状況メッセージ */}
          {(result.isPerfect || result.rule3Applied || (result.invalidVotes && result.invalidVotes.length > 0)) && (
            <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg p-6 border border-cyan-900/30 mb-6">
              {result.isPerfect && (
                <div className="text-yellow-400 text-xl font-bold text-center mb-2">
                  ⭐ ピッタリ賞！敗者は2ポイント減点 ⭐
                </div>
              )}
              {result.rule3Applied && (
                <div className="text-red-400 text-xl font-bold text-center mb-2">
                  🎯 特殊ルール発動！0が出たため100が勝利！
                </div>
              )}
              {result.invalidVotes && result.invalidVotes.length > 0 && (
                <div className="text-orange-400 text-lg font-bold text-center">
                  ⚠️ 無効票あり（同じ数字を選択）
                </div>
              )}
            </div>
          )}

          {/* スコアボード */}
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg p-6 border border-cyan-900/30 mb-6">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">スコア</h3>
            <div className="grid grid-cols-5 gap-4">
              {activePlayers.map(p => {
                const isInvalid = result.invalidVotes?.includes(p.id);
                const isWinner = result.winners.includes(p.id);
                const penalty = isInvalid ? -1 : (!isWinner ? (result.isPerfect ? -2 : -1) : 0);
                
                const oldScore = result.oldScores?.[p.id] ?? 0;
                const newScore = oldScore + penalty;
                const isNewlyEliminated = newlyEliminated.includes(p);

                return (
                  <div key={p.id} className="text-center">
                    <div className="text-white text-lg font-bold mb-2">{p.name}</div>
                    <div className={`text-3xl font-bold ${
                      isNewlyEliminated ? 'text-red-500' : newScore >= -3 ? 'text-green-400' : newScore >= -7 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {oldScore}pt → {newScore}pt
                    </div>
                    {isNewlyEliminated && (
                      <div className="text-red-400 text-sm mt-1">💀 脱落</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={onNext}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-5 rounded-lg text-2xl font-bold transition-all"
          >
            次へ
          </button>
        </div>
      </div>
    </div>
  );
}