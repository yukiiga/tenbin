// src/App.jsx

import React, { useState, useEffect } from 'react';
import { Trophy, Scale } from 'lucide-react';
import TitleScreen from './components/TitleScreen';
import RuleScreen from './components/RuleScreen';
import PlayerSelect from './components/PlayerSelect';
import NumberSelectScreen from './components/NumberSelectScreen';
import ResultScreen from './components/ResultScreen';
import { calculateWinner, getCPUChoice } from './utils/gameLogic';
import icon1 from './assets/icon1.png';
import icon2 from './assets/icon2.png';
import icon3 from './assets/icon3.png';
import icon4 from './assets/icon4.png';
import playerIcon from './assets/player-icon.png';

const PlayerIcon = ({ icon, size = "w-20 h-20" }) => {
  const iconMap = { icon1, icon2, icon3, icon4, cpu: playerIcon };
  
  return (
    <div className={`${size} rounded-lg overflow-hidden border-4 border-white bg-slate-800`}>
      <img 
        src={iconMap[icon] || icon1} 
        alt={icon}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default function App() {
  const [screen, setScreen] = useState('title');
  const [playerCount, setPlayerCount] = useState(5);
  const [difficulty, setDifficulty] = useState('normal'); // 追加
  const [players, setPlayers] = useState([]);
  const [round, setRound] = useState(1);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [choices, setChoices] = useState([]);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(180);
  const [eliminatedCount, setEliminatedCount] = useState(0);

  const activeRules = {
    rule1: eliminatedCount >= 1,
    rule2: eliminatedCount >= 2,
    rule3: eliminatedCount >= 3
  };

  useEffect(() => {
    if (screen === 'numberSelect' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (screen === 'numberSelect' && timeLeft === 0) {
      handleAutoSelect();
    }
  }, [screen, timeLeft]);

  const handleAutoSelect = () => {
    const randomChoice = Math.floor(Math.random() * 101);
    handleNumberSelect(randomChoice);
  };

  // 修正: 難易度を受け取る
  const handleStart = (count, diff) => {
    setPlayerCount(count);
    setDifficulty(diff);
    setScreen('rules');
  };

  const handleRulesNext = () => {
    if (players.length === 0) {
      setScreen('playerSelect');
    } else {
      setRound(round + 1);
      startNewRound();
    }
  };

  const handlePlayersComplete = (allPlayers) => {
    setPlayers(allPlayers);
    setTimeout(() => {
      setScreen('numberSelect');
      startNewRoundWithPlayers(allPlayers);
    }, 0);
  };
  
  const startNewRoundWithPlayers = (currentPlayers) => {
    setChoices([]);
    setCurrentPlayerIndex(0);
    setTimeLeft(180);
    
    const activePlayers = currentPlayers.filter(p => !p.eliminated);
    
    if (activePlayers.length === 0) {
      console.error('No active players');
      return;
    }
    
    if (activePlayers.length === 1) {
      setScreen('gameOver');
      return;
    }
    
    const cpuChoices = [];
    activePlayers.forEach(player => {
      if (player.isCPU) {
        // 修正: difficultyを渡す
        const choice = getCPUChoice(round, difficulty, activeRules, currentPlayers, cpuChoices);
        cpuChoices.push({ playerId: player.id, number: choice });
      }
    });
    
    setChoices(cpuChoices);
    
    const firstHumanIndex = activePlayers.findIndex(p => !p.isCPU);
    if (firstHumanIndex === -1) {
      calculateResult(cpuChoices, currentPlayers);
    } else {
      setCurrentPlayerIndex(firstHumanIndex);
    }
  };

  const startNewRound = () => {
    setChoices([]);
    setCurrentPlayerIndex(0);
    setTimeLeft(180);
    
    const activePlayers = players.filter(p => !p.eliminated);
    
    if (activePlayers.length === 0) {
      console.error('No active players');
      return;
    }
    
    if (activePlayers.length === 1) {
      setScreen('gameOver');
      return;
    }
    
    const cpuChoices = [];
    activePlayers.forEach(player => {
      if (player.isCPU) {
        // 修正: difficultyを渡す
        const choice = getCPUChoice(round, difficulty, activeRules, players, cpuChoices);
        cpuChoices.push({ playerId: player.id, number: choice });
      }
    });
    
    setChoices(cpuChoices);
    
    const firstHumanIndex = activePlayers.findIndex(p => !p.isCPU);
    if (firstHumanIndex === -1) {
      calculateResult(cpuChoices, players);
    } else {
      setCurrentPlayerIndex(firstHumanIndex);
      setScreen('numberSelect');
    }
  };

  const handleNumberSelect = (number) => {
    const activePlayers = players.filter(p => !p.eliminated);
    const currentPlayer = activePlayers[currentPlayerIndex];
    
    const newChoices = [...choices, { playerId: currentPlayer.id, number }];
    setChoices(newChoices);

    let nextHumanIndex = -1;
    for (let i = currentPlayerIndex + 1; i < activePlayers.length; i++) {
      if (!activePlayers[i].isCPU) {
        nextHumanIndex = i;
        break;
      }
    }

    if (nextHumanIndex !== -1) {
      setCurrentPlayerIndex(nextHumanIndex);
      setTimeLeft(180);
      setScreen('numberSelect');
    } else {
      calculateResult(newChoices, players);
    }
  };

  const calculateResult = (finalChoices, currentPlayers) => {
    const roundResult = calculateWinner(finalChoices, currentPlayers, activeRules);
    
    const oldScores = {};
    currentPlayers.forEach(p => {
      oldScores[p.id] = p.score;
    });
    roundResult.oldScores = oldScores;
    
    setResult(roundResult);

    const updatedPlayers = currentPlayers.map(p => {
      if (p.eliminated) return p;
      
      const isWinner = roundResult.winners.includes(p.id);
      const isInvalid = roundResult.invalidVotes?.includes(p.id);
      
      let penalty = 0;
      if (isInvalid) {
        penalty = -1;
      } else if (!isWinner) {
        penalty = roundResult.isPerfect ? -2 : -1;
      }
      
      const newScore = p.score + penalty;
      return {
        ...p,
        score: newScore,
        eliminated: newScore <= -10
      };
    });

    setPlayers(updatedPlayers);
    setScreen('result');
  };

  const handleNextRound = () => {
    const activePlayers = players.filter(p => !p.eliminated);
    
    if (activePlayers.length === 1) {
      setScreen('gameOver');
      return;
    }
    
    const newEliminatedCount = players.filter(p => p.eliminated).length;
    const prevEliminatedCount = eliminatedCount;
    
    setEliminatedCount(newEliminatedCount);
    
    if (newEliminatedCount > prevEliminatedCount) {
      setScreen('rules');
    } else {
      setRound(round + 1);
      startNewRound();
    }
  };

  // 追加: タイトルに戻る関数
  const handleBackToTitle = () => {
    if (window.confirm('タイトル画面に戻りますか？\n現在のゲーム進行状況は失われます。')) {
      setScreen('title');
      setPlayers([]);
      setRound(1);
      setEliminatedCount(0);
      setChoices([]);
      setResult(null);
      setDifficulty('normal');
    }
  };

  const activePlayers = players.filter(p => !p.eliminated);
  const currentPlayer = activePlayers[currentPlayerIndex];

  return (
    <div className="min-h-screen">
      {screen === 'title' && <TitleScreen onStart={handleStart} />}
      
      {screen === 'rules' && (
        <RuleScreen 
          onNext={handleRulesNext} 
          eliminatedCount={eliminatedCount}
          onBackToTitle={handleBackToTitle}
        />
      )}
      
      {screen === 'playerSelect' && (
        <PlayerSelect 
          playerCount={playerCount} 
          onComplete={handlePlayersComplete}
          onBackToTitle={handleBackToTitle}
        />
      )}
      
      {screen === 'numberSelect' && currentPlayer && (
        <NumberSelectScreen 
          player={currentPlayer} 
          onSelect={handleNumberSelect} 
          timeLeft={timeLeft}
          onBackToTitle={handleBackToTitle}
        />
      )}
      
      {screen === 'result' && result && (
        <ResultScreen 
          result={result} 
          players={players} 
          round={round} 
          onNext={handleNextRound}
          onBackToTitle={handleBackToTitle}
        />
      )}
      
      {screen === 'gameOver' && (
        <div className="fixed inset-0 bg-[#0a1628] bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:20px_20px] overflow-auto">
          <div className="min-h-full flex items-center justify-center p-8">
            <div className="text-center max-w-4xl w-full">
              <Scale className="w-40 h-40 mx-auto text-yellow-400 mb-8 opacity-80" strokeWidth={1} />
              <h1 className="text-7xl font-bold text-white mb-12 tracking-wider">ゲームクリア</h1>
              {activePlayers[0] && (
                <div className="bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 rounded-lg p-10 border-4 border-yellow-400 mb-10">
                  <PlayerIcon icon={activePlayers[0].icon} size="w-40 h-40 mx-auto mb-6" />
                  <div className="text-5xl font-bold text-yellow-400 mb-4">
                    {activePlayers[0].name}
                  </div>
                  <div className="text-3xl text-cyan-300 mb-3">
                    最終スコア: {activePlayers[0].score}pt
                  </div>
                  <div className="text-2xl text-white">
                    {round}回戦を勝ち抜きました
                  </div>
                  <div className="text-xl text-slate-400 mt-4">
                    難易度: {difficulty === 'easy' ? 'Easy' : difficulty === 'normal' ? 'Normal' : 'Hard'}
                  </div>
                </div>
              )}
              
              <div className="bg-slate-900/60 rounded-lg p-8 mb-8 border border-cyan-900/30">
                <h3 className="text-3xl font-bold text-white mb-6">最終順位</h3>
                <div className="space-y-3">
                  {players
                    .sort((a, b) => {
                      if (!a.eliminated && b.eliminated) return -1;
                      if (a.eliminated && !b.eliminated) return 1;
                      return b.score - a.score;
                    })
                    .map((player, index) => (
                      <div key={player.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <span className="text-cyan-400 font-bold text-2xl w-10">{index + 1}</span>
                          <PlayerIcon icon={player.icon} size="w-12 h-12" />
                          <span className={`font-bold text-xl ${player.eliminated ? 'text-slate-400' : 'text-white'}`}>
                            {player.name}
                          </span>
                        </div>
                        <span className={`font-bold text-2xl ${player.eliminated ? 'text-red-400' : 'text-cyan-400'}`}>
                          {player.score}pt
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <button
                onClick={handleBackToTitle}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-16 py-5 rounded-lg text-2xl font-bold transition-all"
              >
                タイトルに戻る
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}