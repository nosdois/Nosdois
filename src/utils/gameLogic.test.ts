/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDaysTogether,
  getDailyItem,
  pickNonRepeating,
  evaluateDuelScore,
  evaluateDilemmaMatch,
  evaluateAchievements,
  calculateCoinsReward,
} from './gameLogic.js';

test('calculateDaysTogether calculates difference in days accurately', () => {
  const refDate = new Date('2026-10-25T12:00:00Z');
  // 10 days ago
  const days10 = calculateDaysTogether('2026-10-15', refDate);
  assert.equal(days10, 10);

  // same day
  const days0 = calculateDaysTogether('2026-10-25', refDate);
  assert.equal(days0, 0);

  // invalid or empty
  assert.equal(calculateDaysTogether('', refDate), 0);
  assert.equal(calculateDaysTogether('invalid-date', refDate), 0);
});

test('getDailyItem selects deterministically for the same date string', () => {
  const items = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }];
  const itemA = getDailyItem(items, '2026-10-25');
  const itemB = getDailyItem(items, '2026-10-25');
  assert.equal(itemA.id, itemB.id);

  // Different dates can produce different items
  const itemC = getDailyItem(items, '2026-10-26');
  assert.ok(items.some((i) => i.id === itemC.id));
});

test('pickNonRepeating respects recent item exclusion when available', () => {
  const items = [
    { id: 'a', category: 'romantico' },
    { id: 'b', category: 'romantico' },
    { id: 'c', category: 'romantico' },
  ];

  // If 'a' and 'b' are recent, only 'c' can be picked
  const { item, updatedRecentIds } = pickNonRepeating(items, ['a', 'b']);
  assert.equal(item.id, 'c');
  assert.ok(updatedRecentIds.includes('c'));
});

test('evaluateDuelScore outputs correct winner and messages', () => {
  const r1 = evaluateDuelScore('Ana', 'Beto', 5, 3);
  assert.equal(r1.winner, 'p1');
  assert.ok(r1.title.includes('Ana'));

  const r2 = evaluateDuelScore('Ana', 'Beto', 2, 4);
  assert.equal(r2.winner, 'p2');
  assert.ok(r2.title.includes('Beto'));

  const r3 = evaluateDuelScore('Ana', 'Beto', 3, 3);
  assert.equal(r3.winner, 'tie');
});

test('evaluateDilemmaMatch detects matching and contrasting choices', () => {
  const match = evaluateDilemmaMatch('opt1', 'opt1', 'Lucas', 'Bia');
  assert.equal(match.isMatch, true);

  const diff = evaluateDilemmaMatch('opt1', 'opt2', 'Lucas', 'Bia');
  assert.equal(diff.isMatch, false);
});

test('calculateCoinsReward provides positive coin amounts per activity', () => {
  assert.equal(calculateCoinsReward('conhece'), 10);
  assert.equal(calculateCoinsReward('duelo_win'), 15);
  assert.equal(calculateCoinsReward('vida_real'), 20);
  assert.equal(calculateCoinsReward('daily_challenge'), 30);
});

test('evaluateAchievements unlocks badges based on criteria including coins', () => {
  const stats = {
    totalGamesPlayed: 1,
    conheceRounds: 3,
    dueloWinsP1: 1,
    dueloWinsP2: 0,
    eSeMatches: 0,
    realLifeCompleted: 1,
    coins: 55,
    unlockedAchievements: [],
    recentQuestionIds: [],
    recentDilemmaIds: [],
    recentChallengeIds: [],
  };

  const unlocked = evaluateAchievements(stats);
  assert.ok(unlocked.includes('primeiro_jogo'));
  assert.ok(unlocked.includes('conhece_mestre'));
  assert.ok(unlocked.includes('duelo_iniciado'));
  assert.ok(unlocked.includes('vida_real_primeiro'));
  assert.ok(unlocked.includes('cofre_do_amor'));
  assert.ok(!unlocked.includes('sintonia_total'));
});
