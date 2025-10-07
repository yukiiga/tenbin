import React, { useState } from 'react';
import { Home } from 'lucide-react';
import icon1 from '../assets/icon1.png';
import icon2 from '../assets/icon2.png';
import icon3 from '../assets/icon3.png';
import icon4 from '../assets/icon4.png';

const PlayerIcon = ({ icon, size = "w-20 h-20" }) => {
  const iconMap = { icon1, icon2, icon3, icon4 };
  
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

export default function PlayerSelect({ playerCount, onComplete, onBackToTitle }) {
  const [players, setPlayers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('icon1');

  const icons = ['icon1', 'icon2', 'icon3', 'icon4'];

  const handleNext = () => {
    const newPlayer = {
      id: `player${players.length + 1}`,
      name: name.trim() || `プレイヤー${players.length + 1}`,
      icon: selectedIcon,
      score: 0,
      eliminated: false,
      isCPU: false
    };

    const updatedPlayers = [...players, newPlayer];

    if (updatedPlayers.length < playerCount) {
      setPlayers(updatedPlayers);
      setCurrentIndex(currentIndex + 1);
      setName('');
      setSelectedIcon(icons[(currentIndex + 1) % icons.length]);
    } else {
      const allPlayers = [...updatedPlayers];
      for (let i = 0; i < 5 - playerCount; i++) {
        allPlayers.push({
          id: `cpu${i + 1}`,
          name: `CPU${i + 1}`,
          icon: 'cpu',
          score: 0,
          eliminated: false,
          isCPU: true
        });
      }
      onComplete(allPlayers);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0a1628] bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:20px_20px] overflow-y-auto">
      <div className="w-full py-6 px-4 sm:px-8">
        <div className="w-full max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6 sm:mb-10">
            <h2 className="text-2xl sm:text-4xl font-bold text-white">
              プレイヤー {currentIndex + 1} の設定
            </h2>
            <button
              onClick={onBackToTitle}
              className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all flex items-center gap-2 text-sm sm:text-base"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">タイトルに戻る</span>
            </button>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg p-6 sm:p-8 border border-cyan-900/30 mb-6">
            <div className="mb-6 sm:mb-8">
              <label className="block text-white text-lg sm:text-xl mb-3 sm:mb-4">名前</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`プレイヤー${currentIndex + 1}`}
                className="w-full bg-slate-800 text-white rounded-lg p-3 sm:p-4 text-lg sm:text-xl border-2 border-cyan-500/50 focus:outline-none focus:border-cyan-400 placeholder-slate-500"
                maxLength={10}
              />
            </div>

            <div className="mb-6 sm:mb-8">
              <label className="block text-white text-lg sm:text-xl mb-3 sm:mb-4">アイコン</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {icons.map(icon => (
                  <button
                    key={icon}
                    onClick={() => setSelectedIcon(icon)}
                    className={`p-3 rounded-lg transition-all ${
                      selectedIcon === icon
                        ? 'bg-cyan-600 scale-105'
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    <PlayerIcon icon={icon} size="w-20 h-20 sm:w-24 sm:h-24 mx-auto" />
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-lg text-xl sm:text-2xl font-bold transition-all"
            >
              {players.length + 1 < playerCount ? '次へ' : 'ゲーム開始'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}