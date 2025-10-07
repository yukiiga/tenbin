import React from 'react';
import { TrendingDown } from 'lucide-react';
import icon1 from '../assets/icon1.png';
import icon2 from '../assets/icon2.png';
import icon3 from '../assets/icon3.png';
import icon4 from '../assets/icon4.png';
import playerIcon from '../assets/player-icon.png';

const PlayerIcon = ({ icon, size = "w-16 h-16" }) => {
  const iconMap = {
    icon1: icon1,
    icon2: icon2,
    icon3: icon3,
    icon4: icon4,
    cpu: playerIcon
  };
  
  return (
    <div className={`${size} rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-700`}>
      <img 
        src={iconMap[icon] || icon1} 
        alt={icon}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default function ScoreScreen({ players, round }) {
  const activePlayers = players.filter(p => !p.eliminated).sort((a, b) => b.score - a.score);
  const eliminatedPlayers = players.filter(p => p.eliminated);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h2 className="text-4xl font-bold text-white text-center mb-8">
          第{round}回戦終了後のスコア
        </h2>

        <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 shadow-2xl mb-6">
          <h3 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
            <TrendingDown className="w-6 h-6" />
            プレイヤー状況
          </h3>
          
          <div className="space-y-4">
            {activePlayers.map((player, index) => (
              <div key={player.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl border border-slate-600">
                <div className="flex items-center gap-4">
                  <div className="text-cyan-400 font-bold text-2xl w-8">
                    {index + 1}
                  </div>
                  <PlayerIcon icon={player.icon} size="w-14 h-14" />
                  <div>
                    <div className="text-white font-bold text-lg">{player.name}</div>
                    <div className="text-slate-400 text-sm">
                      {player.isCPU ? 'CPU' : 'プレイヤー'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${
                    player.score >= -3 ? 'text-green-400' :
                    player.score >= -7 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {player.score}pt
                  </div>
                  <div className="text-slate-400 text-sm">
                    残り{Math.abs(player.score - (-10))}pt
                  </div>
                </div>
              </div>
            ))}
          </div>

          {eliminatedPlayers.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-600">
              <h3 className="text-xl font-bold text-red-400 mb-4">脱落者</h3>
              <div className="space-y-3">
                {eliminatedPlayers.map(player => (
                  <div key={player.id} className="flex items-center gap-4 p-3 bg-red-900/20 rounded-lg opacity-50">
                    <PlayerIcon icon={player.icon} size="w-10 h-10" />
                    <div className="text-red-300 font-bold">{player.name}</div>
                    <div className="text-red-400 ml-auto">{player.score}pt</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}