// src/utils/gameLogic.js

export const calculateWinner = (choices, players, activeRules) => {
  const validChoices = choices.filter(c => c.number !== null);
  if (validChoices.length === 0) return null;

  const numbers = validChoices.map(c => c.number);
  const average = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const target = average * 0.8;
  const roundedTarget = Math.round(target * 100) / 100;

  // ルール3チェック
  const hasZero = numbers.includes(0);
  const hundredPlayers = validChoices.filter(c => c.number === 100);
  
  if (activeRules.rule3 && hasZero && hundredPlayers.length > 0) {
    if (activeRules.rule1 && hundredPlayers.length > 1) {
      return {
        winners: [],
        losers: validChoices.map(c => c.playerId),
        target: roundedTarget,
        average,
        invalidVotes: hundredPlayers.map(c => c.playerId),
        rule3Applied: true,
        choices: validChoices
      };
    }
    return {
      winners: hundredPlayers.map(c => c.playerId),
      losers: validChoices.filter(c => c.number !== 100).map(c => c.playerId),
      target: roundedTarget,
      average,
      rule3Applied: true,
      choices: validChoices
    };
  }

  // ルール1チェック
  let invalidVotes = [];
  if (activeRules.rule1) {
    const numberCounts = {};
    numbers.forEach(num => {
      numberCounts[num] = (numberCounts[num] || 0) + 1;
    });
    
    const duplicateNumbers = Object.keys(numberCounts)
      .filter(num => numberCounts[num] >= 2)
      .map(Number);
    
    invalidVotes = validChoices
      .filter(c => duplicateNumbers.includes(c.number))
      .map(c => c.playerId);
  }

  const validForWinner = validChoices.filter(c => !invalidVotes.includes(c.playerId));
  
  if (validForWinner.length === 0) {
    return {
      winners: [],
      losers: validChoices.map(c => c.playerId),
      target: roundedTarget,
      average,
      invalidVotes,
      choices: validChoices
    };
  }

  let minDiff = Infinity;
  let closestPlayers = [];
  
  validForWinner.forEach(choice => {
    const diff = Math.abs(choice.number - target);
    if (diff < minDiff) {
      minDiff = diff;
      closestPlayers = [choice.playerId];
    } else if (diff === minDiff) {
      closestPlayers.push(choice.playerId);
    }
  });

  // ルール2チェック
  const isPerfect = activeRules.rule2 && Math.abs(Math.round(target) - target) < 0.01 
    && closestPlayers.some(id => {
      const choice = validChoices.find(c => c.playerId === id);
      return choice && Math.round(target) === choice.number;
    });

  const losers = validChoices
    .filter(c => !closestPlayers.includes(c.playerId))
    .map(c => c.playerId);

  return {
    winners: closestPlayers,
    losers,
    target: roundedTarget,
    average,
    invalidVotes,
    isPerfect,
    choices: validChoices
  };
};

export const getCPUChoice = (round, difficulty, activeRules, players, allChoices = []) => {
  const alivePlayers = players.filter(p => !p.eliminated);
  const aliveCount = alivePlayers.length;
  const chosenNumbers = allChoices.map(c => c.number);
  
  // CPUの性格を決定（各CPUで異なる戦略）
  const cpuId = allChoices.filter(c => players.find(p => p.id === c.playerId && p.isCPU)).length;
  const cpuPersonality = cpuId % 3; // 0: 保守的, 1: 中道, 2: 攻撃的
  
  // 現在のCPUプレイヤーを特定
  const cpuPlayer = alivePlayers.find(p => p.isCPU && !allChoices.find(c => c.playerId === p.id));
  
  let baseChoice;
  let variance;
  
  // 難易度によるランダム性と戦略性の調整
  if (difficulty === 'easy') {
    variance = Math.random() * 15 - 7.5; // 大きなランダム性
  } else if (difficulty === 'normal') {
    variance = Math.random() * 10 - 5; // 中程度のランダム性
  } else { // hard
    variance = Math.random() * 5 - 2.5; // 小さなランダム性（より計算的）
  }
  
  // === Easy難易度: シンプルな戦略 ===
  if (difficulty === 'easy') {
    if (round <= 3) {
      baseChoice = 40 + variance;
    } else if (round <= 6) {
      baseChoice = 35 + variance;
    } else {
      baseChoice = 30 + variance;
    }
  }
  
  // === Normal難易度: バランス型戦略 ===
  else if (difficulty === 'normal') {
    if (round <= 2) {
      switch(cpuPersonality) {
        case 0: baseChoice = 42 + variance; break;
        case 1: baseChoice = 38 + variance; break;
        case 2: baseChoice = 35 + variance; break;
      }
    } else if (round <= 5) {
      switch(cpuPersonality) {
        case 0: baseChoice = 36 + variance; break;
        case 1: baseChoice = 32 + variance; break;
        case 2: baseChoice = 28 + variance; break;
      }
    } else {
      if (aliveCount === 2) {
        baseChoice = cpuPersonality === 2 
          ? (Math.random() > 0.5 ? 15 + Math.random() * 10 : 45 + Math.random() * 10)
          : 25 + variance * 1.5;
      } else {
        baseChoice = 28 + variance;
      }
    }
    
    // スコアによる調整
    if (cpuPlayer && cpuPlayer.score <= -7) {
      baseChoice *= 0.85; // 負けが込んでいたら低めを狙う
    }
  }
  
  // === Hard難易度: 高度な戦略 ===
  else {
    // 過去の平均から予測（Hardモードのみ）
    const humanChoices = allChoices.filter(c => {
      const p = players.find(pl => pl.id === c.playerId);
      return p && !p.isCPU;
    });
    
    let predictedAverage = 40; // デフォルト予測
    
    if (humanChoices.length > 0) {
      const humanAverage = humanChoices.reduce((sum, c) => sum + c.number, 0) / humanChoices.length;
      predictedAverage = humanAverage;
    }
    
    // ラウンド進行による補正
    const roundFactor = Math.max(0.7, 1 - (round * 0.05));
    predictedAverage *= roundFactor;
    
    // 予測平均の0.8倍を狙う（さらに心理的な調整）
    let targetValue = predictedAverage * 0.8;
    
    // CPUの性格による微調整
    switch(cpuPersonality) {
      case 0: // 保守的: 予測通り
        baseChoice = targetValue + variance;
        break;
      case 1: // 中道: やや低めを狙う
        baseChoice = targetValue * 0.95 + variance;
        break;
      case 2: // 攻撃的: 相手の裏をかく
        if (round > 5) {
          baseChoice = targetValue * (Math.random() > 0.5 ? 0.85 : 1.15) + variance;
        } else {
          baseChoice = targetValue * 0.90 + variance;
        }
        break;
    }
    
    // 人数による戦略調整
    if (aliveCount === 2) {
      // 1対1: 極端な戦略でブラフ
      if (Math.random() > 0.7) {
        baseChoice = Math.random() > 0.5 ? baseChoice * 0.6 : baseChoice * 1.4;
      }
    } else if (aliveCount === 3) {
      // 3人: 中間的な読み合い
      if (cpuPersonality === 2 && Math.random() > 0.6) {
        baseChoice *= Math.random() > 0.5 ? 0.85 : 1.15;
      }
    }
    
    // スコアによる大胆な調整
    if (cpuPlayer) {
      if (cpuPlayer.score <= -8) {
        // 絶体絶命: 極端な数字で逆転を狙う
        if (Math.random() > 0.5) {
          baseChoice = Math.random() * 25 + 5; // 5-30の低い数字
        }
      } else if (cpuPlayer.score <= -6) {
        baseChoice *= 0.88; // やや冒険的に
      } else if (cpuPlayer.score >= -2) {
        baseChoice *= 1.05; // 余裕があれば安全策
      }
    }
    
    // ルール3対策（Hardのみ）
    if (activeRules.rule3 && Math.random() > 0.92) {
      // 低確率で100を選んで0待ち狙い
      if (!chosenNumbers.includes(100)) {
        baseChoice = 100;
      }
    }
  }
  
  // 最終調整
  let choice = Math.max(0, Math.min(100, Math.round(baseChoice)));
  
  // ルール1対策: 既に選ばれた数字を避ける
  if (activeRules.rule1 && chosenNumbers.includes(choice)) {
    // 難易度によって回避の精度が変わる
    const searchRange = difficulty === 'hard' ? 3 : (difficulty === 'normal' ? 5 : 10);
    
    for (let offset = 1; offset <= 50; offset++) {
      if (offset <= searchRange) {
        // 近い数字を優先的に探す（Hardほど精密）
        if (!chosenNumbers.includes(choice + offset) && choice + offset <= 100) {
          choice = choice + offset;
          break;
        }
        if (!chosenNumbers.includes(choice - offset) && choice - offset >= 0) {
          choice = choice - offset;
          break;
        }
      } else if (difficulty === 'easy') {
        // Easyは遠くの数字も許容
        if (!chosenNumbers.includes(choice + offset) && choice + offset <= 100) {
          choice = choice + offset;
          break;
        }
        if (!chosenNumbers.includes(choice - offset) && choice - offset >= 0) {
          choice = choice - offset;
          break;
        }
      }
    }
  }
  
  return choice;
};