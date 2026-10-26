/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameId = 'conhece' | 'duelo' | 'e-se' | 'vida-real' | 'mundinho';

export type MainTab = 'inicio' | 'jogos' | 'vida-real' | 'perfil';

export interface CoupleProfile {
  partner1Name: string;
  partner2Name: string;
  partner1Avatar: string;
  partner2Avatar: string;
  anniversaryDate: string; // YYYY-MM-DD
  soundEnabled: boolean;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  category: 'romantico' | 'cotidiano' | 'engracado' | 'personalidade';
  categoryLabel: string;
  text: string;
  options: QuestionOption[];
  chatPrompt?: string; // Follow-up question to spark deep conversation
}

export interface Dilemma {
  id: string;
  category: 'viagens' | 'encontros' | 'engracado' | 'rotina' | 'decisoes';
  categoryLabel: string;
  title: string;
  description: string;
  options: {
    id: string;
    text: string;
    icon?: string;
  }[];
  insightComment: string;
}

export interface RealLifeChallenge {
  id: string;
  category: 'romantico' | 'engracado' | 'criativo' | 'memoria' | 'conhecimento' | 'encontros';
  categoryLabel: string;
  title: string;
  description: string;
  steps: string[];
  durationMinutes: number;
  hasTimer?: boolean;
}

export type DuelMinigameId = 'memoria' | 'reflexos' | 'adivinhacao' | 'sequencia' | 'observacao';

export interface MinigameInfo {
  id: DuelMinigameId;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  roundsCount: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string | null;
}

export interface GameStats {
  totalGamesPlayed: number;
  conheceRounds: number;
  dueloWinsP1: number;
  dueloWinsP2: number;
  eSeMatches: number;
  realLifeCompleted: number;
  coins: number;
  recordsCount?: number;
  mundinhoItems?: string[];
  lastCompletedDailyDate?: string;
  unlockedAchievements: string[];
  recentQuestionIds: string[];
  recentDilemmaIds: string[];
  recentChallengeIds: string[];
}

export type RoomStatus = 'aguardando' | 'pronta' | 'em_andamento' | 'encerrada';
export type RoomStep = 'LOBBY' | 'RESPONDING' | 'GUESSING' | 'REVEAL' | 'SUMMARY';

export interface RoomData {
  id: string;
  code: string;
  status: RoomStatus;
  gameId: string;
  hostUid: string;
  hostName: string;
  hostAvatar: string;
  guestUid: string | null;
  guestName: string | null;
  guestAvatar: string | null;
  scoreHost: number;
  scoreGuest: number;
  currentRound: number;
  totalRounds: number;
  turn: 'host' | 'guest'; // who answers secretly
  step: RoomStep;
  currentQuestionId: string;
  currentQuestionCategory: string;
  currentQuestionText: string;
  currentQuestionOptions: string; // JSON string of QuestionOption[]
  currentChatPrompt: string;
  secretAnswerId: string;
  guessedAnswerId: string;
  hasSecretAnswer: boolean;
  createdAt: number;
  lastActiveAt: number;
  abandonedBy?: string | null;
}

export interface UserPreferences {
  soundEnabled: boolean;
  theme: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string;
  avatar: string;
  createdAt: number;
  relationshipId: string | null;
  partnerUid?: string | null;
  partnerName?: string | null;
  partnerAvatar?: string | null;
  stats: GameStats;
  preferences: UserPreferences;
}

export interface RelationshipHistoryItem {
  id: string;
  type: 'desafio_vida_real' | 'conhece' | 'duelo' | 'e_se';
  title: string;
  description: string;
  timestamp: number;
  scoreSummary?: string;
}

export interface CoupleRelationship {
  id: string;
  user1Id: string;
  user2Id: string | null;
  user1Name: string;
  user2Name: string | null;
  user1Avatar: string;
  user2Avatar: string | null;
  anniversaryDate: string; // YYYY-MM-DD
  coins: number;
  status: 'pending' | 'connected' | 'disconnected';
  createdAt: number;
  history: RelationshipHistoryItem[];
}

export interface CoupleInvite {
  code: string;
  relationshipId: string;
  creatorUid: string;
  creatorName: string;
  creatorAvatar: string;
  status: 'pending' | 'accepted' | 'expired';
  createdAt: number;
  expiresAt: number;
}

export interface RealLifeHistoryRecord {
  id: string;
  challengeId: string;
  title: string;
  categoryLabel: string;
  completedAt: number;
}

