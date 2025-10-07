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
  const variance = Math.random() * 10 - 5;
  const chosenNumbers = allChoices.map(c => c.number);
  
  let baseChoice;
  
  if (round <= 2) {
    baseChoice = 45 + variance;
  } else if (round <= 5) {
    baseChoice = 35 + variance;
  } else {
    if (alivePlayers.length === 2) {
      baseChoice = Math.random() > 0.5 ? 20 + Math.random() * 10 : 35 + Math.random() * 10;
    } else {
      baseChoice = 30 + variance;
    }
  }
  
  let choice = Math.max(0, Math.min(100, Math.round(baseChoice)));
  
  if (activeRules.rule1 && chosenNumbers.includes(choice)) {
    for (let offset = 1; offset <= 50; offset++) {
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
  
  return choice;
};