/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoupleProfile, GameStats } from '../types';
import { evaluateAchievements } from './gameLogic';

const DEFAULT_PROFILE: CoupleProfile = {
  partner1Name: 'Amor 1',
  partner2Name: 'Amor 2',
  partner1Avatar: '💜',
  partner2Avatar: '🌸',
  anniversaryDate: '',
  soundEnabled: true,
};

const DEFAULT_STATS: GameStats = {
  totalGamesPlayed: 4,
  conheceRounds: 2,
  dueloWinsP1: 1,
  dueloWinsP2: 0,
  eSeMatches: 1,
  realLifeCompleted: 1,
  coins: 120,
  recordsCount: 1,
  mundinhoItems: ['casinha'],
  lastCompletedDailyDate: '',
  unlockedAchievements: ['primeiro_passo', 'sintonia_total', 'cofre_do_amor'],
  recentQuestionIds: [],
  recentDilemmaIds: [],
  recentChallengeIds: [],
};

const memoryStore: Record<string, string> = {};

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return memoryStore[key] || null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    memoryStore[key] = value;
  }
}

export function loadCoupleProfile(): CoupleProfile {
  const raw = safeGet('nosdois_couple_profile');
  if (!raw) return DEFAULT_PROFILE;
  try {
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveCoupleProfile(profile: CoupleProfile): void {
  safeSet('nosdois_couple_profile', JSON.stringify(profile));
}

export function loadGameStats(): GameStats {
  const raw = safeGet('nosdois_game_stats');
  if (!raw) return DEFAULT_STATS;
  try {
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveGameStats(stats: GameStats): void {
  safeSet('nosdois_game_stats', JSON.stringify(stats));
}

export function updateStatsAndCheckAchievements(
  updater: (prev: GameStats) => GameStats
): { stats: GameStats; newAchievements: string[] } {
  const current = loadGameStats();
  const updated = updater(current);
  const newAchievements = evaluateAchievements(updated);

  if (newAchievements.length > 0) {
    updated.unlockedAchievements = [
      ...updated.unlockedAchievements,
      ...newAchievements,
    ];
  }

  saveGameStats(updated);
  return { stats: updated, newAchievements };
}
