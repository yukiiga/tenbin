import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import icon1 from '../assets/icon1.png';
import icon2 from '../assets/icon2.png';
import icon3 from '../assets/icon3.png';
import icon4 from '../assets/icon4.png';
import playerIcon from '../assets/player-icon.png';

const PlayerIcon = ({ icon, size = "w-16 h-16" }) => {
  const iconMap = { icon1, icon2, icon3, icon4, cpu: playerIcon };
  
  return (
    <div className={`${size} rounded-lg overflow-hidden border-2 border-cyan-500/50 bg-slate-800`}>
      <img 
        src={iconMap[icon] || icon1} 
        alt={icon}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default function NumberSelectScreen({ player, onSelect, timeLeft }) {
  const [selectedNumber, setSelectedNumber] = useState(null);

  const numbers = Array.from({ length: 101 }, (_, i) => i);

  const handleConfirm = () => {
    if (selectedNumber !== null) {
      onSelect(selectedNumber);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft <= 30;

  return (
    <div className="fixed inset-0 bg-[#0a1628] bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:20px_20px] p-6">
      <div className="h-full flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <PlayerIcon icon={player.icon} size="w-16 h-16" />
            <h2 className="text-3xl font-bold text-white">{player.name}</h2>
          </div>
          <div className={`flex items-center gap-2 text-2xl font-bold ${
            isUrgent ? 'text-red-400' : 'text-cyan-400'
          }`}>
            <Clock className="w-7 h-7" />
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
        </div>

        {/* 選択中の数字 */}
        {selectedNumber !== null && (
          <div className="text-center mb-4">
            <div className="inline-block bg-slate-900/60 border-2 border-cyan-500 rounded-lg px-12 py-4">
              <div className="text-6xl font-bold text-cyan-300">{selectedNumber}</div>
            </div>
          </div>
        )}

        {/* 数字グリッド */}
        <div className="flex-1 bg-slate-900/40 backdrop-blur-sm rounded-lg p-4 border border-cyan-900/30 overflow-hidden">
          <div className="h-full overflow-y-auto pr-2">
            <div className="grid grid-cols-10 gap-2">
              {numbers.map(num => (
                <button
                  key={num}
                  onClick={() => setSelectedNumber(num)}
                  className={`aspect-square rounded-md font-bold text-lg transition-all ${
                    selectedNumber === num
                      ? 'bg-cyan-500 text-white scale-110 shadow-lg shadow-cyan-500/50'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 確定ボタン */}
        <button
          onClick={handleConfirm}
          disabled={selectedNumber === null}
          className={`mt-4 w-full py-5 rounded-lg text-2xl font-bold transition-all ${
            selectedNumber !== null
              ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          {selectedNumber !== null ? '確定' : '数字を選択してください'}
        </button>
      </div>
    </div>
  );
}