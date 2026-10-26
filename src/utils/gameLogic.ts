/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameStats } from '../types';

/**
 * Calculates days a couple has been together.
 */
export function calculateDaysTogether(startDate: string, referenceDate: Date = new Date()): number {
  if (!startDate) return 0;
  const parts = startDate.trim().split('-');
  if (parts.length !== 3) return 0;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  const start = new Date(y, m, d);
  if (isNaN(start.getTime())) return 0;
  
  // Normalize both dates to midnight UTC to prevent DST off-by-one errors
  const utcStart = Date.UTC(y, m, d);
  const utcRef = Date.UTC(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  
  const diffTime = utcRef - utcStart;
  if (diffTime < 0) return 0;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export interface RelationshipDuration {
  primary: string;
  secondary?: string;
  hasDate: boolean;
  totalDays: number;
}

/**
 * Calculates human-friendly elapsed time since relationship start date.
 * E.g.: "1 ano e 29 dias", "2 anos e 3 meses", "120 dias juntos", "Adicionar data"
 */
export function formatRelationshipDuration(
  startDate?: string,
  referenceDate: Date = new Date()
): RelationshipDuration {
  if (!startDate || !startDate.trim()) {
    return {
      primary: 'Adicionar data',
      hasDate: false,
      totalDays: 0,
    };
  }

  const parts = startDate.trim().split('-');
  if (parts.length !== 3) {
    return {
      primary: 'Adicionar data',
      hasDate: false,
      totalDays: 0,
    };
  }

  const startYear = parseInt(parts[0], 10);
  const startMonth = parseInt(parts[1], 10) - 1;
  const startDay = parseInt(parts[2], 10);

  const start = new Date(startYear, startMonth, startDay);
  if (isNaN(start.getTime())) {
    return {
      primary: 'Adicionar data',
      hasDate: false,
      totalDays: 0,
    };
  }

  const refYear = referenceDate.getFullYear();
  const refMonth = referenceDate.getMonth();
  const refDay = referenceDate.getDate();

  const utcStart = Date.UTC(startYear, startMonth, startDay);
  const utcRef = Date.UTC(refYear, refMonth, refDay);
  const diffTime = utcRef - utcStart;

  if (diffTime < 0) {
    return {
      primary: 'Começando agora',
      secondary: `Início em ${start.toLocaleDateString('pt-BR')}`,
      hasDate: true,
      totalDays: 0,
    };
  }

  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const formattedDate = start.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // Calculate calendar years
  let years = refYear - startYear;
  if (refMonth < startMonth || (refMonth === startMonth && refDay < startDay)) {
    years--;
  }

  // Calculate calendar months
  let months = refMonth - startMonth;
  if (refDay < startDay) {
    months--;
  }
  if (months < 0) {
    months += 12;
  }

  // Calculate calendar remaining days after accounting for years and months
  // Date of start advanced by `years` years and `months` months:
  const anchorDate = new Date(startYear + years, startMonth + months, startDay);
  const utcAnchor = Date.UTC(anchorDate.getFullYear(), anchorDate.getMonth(), anchorDate.getDate());
  let remainingDays = Math.floor((utcRef - utcAnchor) / (1000 * 60 * 60 * 24));
  if (remainingDays < 0) remainingDays = 0;

  let primary = '';

  if (years >= 1) {
    const yrStr = years === 1 ? '1 ano' : `${years} anos`;
    if (months > 0 && remainingDays === 0) {
      // e.g. "2 anos e 3 meses"
      const moStr = months === 1 ? '1 mês' : `${months} meses`;
      primary = `${yrStr} e ${moStr}`;
    } else if (months === 0 && remainingDays > 0) {
      // e.g. "1 ano e 29 dias"
      const dStr = remainingDays === 1 ? '1 dia' : `${remainingDays} dias`;
      primary = `${yrStr} e ${dStr}`;
    } else if (months > 0 && remainingDays > 0) {
      // e.g. "1 ano e 2 meses" (compact format for header)
      const moStr = months === 1 ? '1 mês' : `${months} meses`;
      primary = `${yrStr} e ${moStr}`;
    } else {
      primary = `${yrStr} juntos`;
    }
  } else {
    // Under 1 year: e.g. "120 dias juntos"
    primary = `${totalDays} ${totalDays === 1 ? 'dia' : 'dias'} juntos`;
  }

  return {
    primary,
    secondary: `Desde ${formattedDate}`,
    hasDate: true,
    totalDays,
  };
}

/**
 * Deterministically picks the daily challenge item based on the calendar day string (YYYY-MM-DD).
 */
export function getDailyItem<T extends { id: string }>(items: T[], dateString?: string): T {
  if (!items || items.length === 0) {
    throw new Error('Items array cannot be empty');
  }
  const dateKey = dateString || new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash << 5) - hash + dateKey.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % items.length;
  return items[index];
}

/**
 * Picks an item avoiding recently used IDs. If all items have been used, resets and picks from all.
 */
export function pickNonRepeating<T extends { id: string }>(
  items: T[],
  recentIds: string[] = [],
  categoryFilter?: string
): { item: T; updatedRecentIds: string[] } {
  if (!items || items.length === 0) {
    throw new Error('Items array cannot be empty');
  }

  const pool = categoryFilter
    ? items.filter((it: any) => it.category === categoryFilter)
    : items;

  const validPool = pool.length > 0 ? pool : items;

  // Filter out recent
  const available = validPool.filter((item) => !recentIds.includes(item.id));
  const candidatePool = available.length > 0 ? available : validPool;

  const selectedIndex = Math.floor(Math.random() * candidatePool.length);
  const selected = candidatePool[selectedIndex];

  // Keep a history window of up to 15 items to avoid repetition
  const nextRecent = [...recentIds.filter((id) => id !== selected.id), selected.id];
  const maxHistory = Math.max(5, Math.floor(validPool.length * 0.7));
  const trimmedRecent = nextRecent.slice(-maxHistory);

  return { item: selected, updatedRecentIds: trimmedRecent };
}

/**
 * Evaluates Duel outcome between two players.
 */
export function evaluateDuelScore(
  p1Name: string,
  p2Name: string,
  scoreP1: number,
  scoreP2: number
): { winner: 'p1' | 'p2' | 'tie'; title: string; message: string } {
  if (scoreP1 > scoreP2) {
    return {
      winner: 'p1',
      title: `Vitória de ${p1Name}! 👑`,
      message: `${p1Name} levou a melhor nesta rodada com ${scoreP1} a ${scoreP2}. Vale um beijo de comemoração!`,
    };
  } else if (scoreP2 > scoreP1) {
    return {
      winner: 'p2',
      title: `Vitória de ${p2Name}! 👑`,
      message: `${p2Name} venceu com ${scoreP2} a ${scoreP1}. Hora do abraço do campeão!`,
    };
  } else {
    return {
      winner: 'tie',
      title: 'Empate Apaixonado! 💖',
      message: `Equilíbrio total: ${scoreP1} a ${scoreP2}! Vocês dois pensam e reagem no mesmo ritmo.`,
    };
  }
}

/**
 * Analyzes whether choices in "E Se Nós Dois...?" match and provides romantic commentary.
 */
export function evaluateDilemmaMatch(
  p1Choice: string,
  p2Choice: string,
  p1Name: string,
  p2Name: string
): { isMatch: boolean; title: string; banter: string } {
  const isMatch = p1Choice === p2Choice;
  if (isMatch) {
    const matchTitles = [
      'Almas Gêmeas em Sintonia! 💫',
      'Telepatia Romântica! 💖',
      'Na Mesma Frequência! ✨',
      'Pensaram Exatamente Igual! 🥂',
    ];
    const matchBanters = [
      `Incrível! Tanto ${p1Name} quanto ${p2Name} escolheram a mesma opção. A sintonia de vocês está tinindo!`,
      `Zero dúvidas: vocês fariam isso juntinhos sem pestanejar!`,
      `Parece que vocês já estavam combinando antes da pergunta aparecer!`,
    ];
    const title = matchTitles[Math.floor(Math.random() * matchTitles.length)];
    const banter = matchBanters[Math.floor(Math.random() * matchBanters.length)];
    return { isMatch: true, title, banter };
  } else {
    const diffTitles = [
      'Opostos que se Completam! ☯️',
      'Perspectivas Diferentes, Amor Igual! 💕',
      'Um Equilíbrio Perfeito! ⚖️',
      'Diversidade no Amor! 🎨',
    ];
    const diffBanters = [
      `${p1Name} e ${p2Name} têm visões diferentes sobre isso. Que tal conversarem sobre os motivos de cada escolha?`,
      `Cada um escolheu um caminho! É isso que torna a relação tão rica e interessante.`,
      `Divergência divertida! Um traz a aventura e o outro o charme da decisão.`,
    ];
    const title = diffTitles[Math.floor(Math.random() * diffTitles.length)];
    const banter = diffBanters[Math.floor(Math.random() * diffBanters.length)];
    return { isMatch: false, title, banter };
  }
}

/**
 * Calculate recreational coins rewarded based on event type.
 */
export function calculateCoinsReward(
  type: 'conhece' | 'duelo_win' | 'duelo_tie' | 'e_se_match' | 'e_se_played' | 'vida_real' | 'daily_challenge'
): number {
  switch (type) {
    case 'conhece':
      return 10;
    case 'duelo_win':
      return 15;
    case 'duelo_tie':
      return 10;
    case 'e_se_match':
      return 15;
    case 'e_se_played':
      return 8;
    case 'vida_real':
      return 20;
    case 'daily_challenge':
      return 30;
    default:
      return 5;
  }
}

/**
 * Verifies newly unlocked achievements based on stats.
 */
export function evaluateAchievements(stats: GameStats): string[] {
  const newUnlocked: string[] = [];
  const current = new Set(stats.unlockedAchievements || []);

  if (stats.totalGamesPlayed >= 1 && !current.has('primeiro_jogo')) {
    newUnlocked.push('primeiro_jogo');
  }
  if (stats.conheceRounds >= 3 && !current.has('conhece_mestre')) {
    newUnlocked.push('conhece_mestre');
  }
  if ((stats.dueloWinsP1 > 0 || stats.dueloWinsP2 > 0) && !current.has('duelo_iniciado')) {
    newUnlocked.push('duelo_iniciado');
  }
  if (stats.eSeMatches >= 3 && !current.has('sintonia_total')) {
    newUnlocked.push('sintonia_total');
  }
  if (stats.realLifeCompleted >= 1 && !current.has('vida_real_primeiro')) {
    newUnlocked.push('vida_real_primeiro');
  }
  if (stats.realLifeCompleted >= 5 && !current.has('romanticos_incorrigiveis')) {
    newUnlocked.push('romanticos_incorrigiveis');
  }
  if (stats.totalGamesPlayed >= 10 && !current.has('casal_gamer')) {
    newUnlocked.push('casal_gamer');
  }
  if ((stats.coins || 0) >= 50 && !current.has('cofre_do_amor')) {
    newUnlocked.push('cofre_do_amor');
  }

  return newUnlocked;
}
