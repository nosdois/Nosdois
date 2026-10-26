/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, ensureAuth } from '../lib/firebase';
import { RoomData, RoomStatus, Question } from '../types';

/**
 * Generate a friendly 6-character room code (e.g. NOS482, AMOR19, PAR531)
 */
export function generateRoomCode(): string {
  const prefixes = ['NOS', 'AMOR', 'PAR', 'DOIS', 'LOVE'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const num = Math.floor(100 + Math.random() * 900); // 3 digits
  return `${prefix}${num}`;
}

/**
 * Create a new multiplayer room
 */
export async function createRoom(
  hostName: string,
  hostAvatar: string,
  gameId: string = 'conhece'
): Promise<{ roomId: string; code: string }> {
  const user = await ensureAuth();
  const roomRef = doc(collection(db, 'rooms'));
  const code = generateRoomCode();

  const newRoom: RoomData = {
    id: roomRef.id,
    code,
    status: 'aguardando',
    gameId,
    hostUid: user.uid,
    hostName: hostName.trim() || 'Jogador 1',
    hostAvatar: hostAvatar || '💖',
    guestUid: null,
    guestName: null,
    guestAvatar: null,
    scoreHost: 0,
    scoreGuest: 0,
    currentRound: 1,
    totalRounds: 6,
    turn: 'host',
    step: 'LOBBY',
    currentQuestionId: '',
    currentQuestionCategory: '',
    currentQuestionText: '',
    currentQuestionOptions: '[]',
    currentChatPrompt: '',
    secretAnswerId: '',
    guessedAnswerId: '',
    hasSecretAnswer: false,
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
  };

  await setDoc(roomRef, newRoom);
  return { roomId: roomRef.id, code };
}

/**
 * Join an existing room via code
 */
export async function joinRoom(
  roomCodeInput: string,
  guestName: string,
  guestAvatar: string
): Promise<{ roomId: string; room: RoomData }> {
  const user = await ensureAuth();
  const cleanCode = roomCodeInput.trim().toUpperCase();

  if (!cleanCode) {
    throw new Error('Por favor, digite o código da sala.');
  }

  const q = query(collection(db, 'rooms'), where('code', '==', cleanCode));
  const snap = await getDocs(q);

  if (snap.empty) {
    throw new Error('Sala não encontrada. Verifique se o código está correto.');
  }

  const roomDoc = snap.docs[0];
  const room = roomDoc.data() as RoomData;

  if (room.status === 'encerrada') {
    throw new Error('Esta sala já foi encerrada.');
  }

  // If user is already the host
  if (room.hostUid === user.uid) {
    return { roomId: roomDoc.id, room };
  }

  // If another guest is already in and it's not the same user
  if (room.guestUid && room.guestUid !== user.uid) {
    throw new Error('Esta sala já está cheia (2 jogadores conectados).');
  }

  // Slot in as guest
  const updatedData: Partial<RoomData> = {
    guestUid: user.uid,
    guestName: guestName.trim() || 'Jogador 2',
    guestAvatar: guestAvatar || '💕',
    status: 'pronta',
    lastActiveAt: Date.now(),
  };

  await updateDoc(doc(db, 'rooms', roomDoc.id), updatedData);
  return { roomId: roomDoc.id, room: { ...room, ...updatedData } };
}

/**
 * Subscribe to real-time room updates
 */
export function subscribeToRoom(
  roomId: string,
  onUpdate: (room: RoomData | null) => void,
  onError?: (err: Error) => void
): () => void {
  const roomRef = doc(db, 'rooms', roomId);
  return onSnapshot(
    roomRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as RoomData);
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      console.error('[Room Subscription Error]', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Start match (Host triggers)
 */
export async function startMultiplayerMatch(
  roomId: string,
  firstQuestion: Question
): Promise<void> {
  const roomRef = doc(db, 'rooms', roomId);
  await updateDoc(roomRef, {
    status: 'em_andamento',
    step: 'RESPONDING',
    currentRound: 1,
    turn: 'host', // host answers first about self
    scoreHost: 0,
    scoreGuest: 0,
    currentQuestionId: firstQuestion.id,
    currentQuestionCategory: firstQuestion.categoryLabel,
    currentQuestionText: firstQuestion.text,
    currentQuestionOptions: JSON.stringify(firstQuestion.options),
    currentChatPrompt: firstQuestion.chatPrompt || '',
    secretAnswerId: '',
    guessedAnswerId: '',
    hasSecretAnswer: false,
    lastActiveAt: Date.now(),
  });
}

/**
 * Submit secret answer by current respondent
 */
export async function submitSecretAnswer(
  roomId: string,
  secretAnswerId: string
): Promise<void> {
  const roomRef = doc(db, 'rooms', roomId);
  await updateDoc(roomRef, {
    secretAnswerId,
    hasSecretAnswer: true,
    step: 'GUESSING',
    lastActiveAt: Date.now(),
  });
}

/**
 * Submit guess by partner
 */
export async function submitGuess(
  roomId: string,
  guessedAnswerId: string,
  isCorrect: boolean,
  guesserRole: 'host' | 'guest',
  currentScores: { host: number; guest: number }
): Promise<void> {
  const roomRef = doc(db, 'rooms', roomId);
  const nextScores = {
    scoreHost: guesserRole === 'host' && isCorrect ? currentScores.host + 1 : currentScores.host,
    scoreGuest: guesserRole === 'guest' && isCorrect ? currentScores.guest + 1 : currentScores.guest,
  };

  await updateDoc(roomRef, {
    guessedAnswerId,
    step: 'REVEAL',
    scoreHost: nextScores.scoreHost,
    scoreGuest: nextScores.scoreGuest,
    lastActiveAt: Date.now(),
  });
}

/**
 * Proceed to next round or finish
 */
export async function advanceMultiplayerRound(
  roomId: string,
  nextRoundNumber: number,
  nextTurn: 'host' | 'guest',
  nextQuestion: Question | null,
  isFinished: boolean
): Promise<void> {
  const roomRef = doc(db, 'rooms', roomId);

  if (isFinished || !nextQuestion) {
    await updateDoc(roomRef, {
      step: 'SUMMARY',
      status: 'encerrada',
      lastActiveAt: Date.now(),
    });
    return;
  }

  await updateDoc(roomRef, {
    currentRound: nextRoundNumber,
    turn: nextTurn,
    step: 'RESPONDING',
    hasSecretAnswer: false,
    secretAnswerId: '',
    guessedAnswerId: '',
    currentQuestionId: nextQuestion.id,
    currentQuestionCategory: nextQuestion.categoryLabel,
    currentQuestionText: nextQuestion.text,
    currentQuestionOptions: JSON.stringify(nextQuestion.options),
    currentChatPrompt: nextQuestion.chatPrompt || '',
    lastActiveAt: Date.now(),
  });
}

/**
 * Leave or close room
 */
export async function leaveRoom(roomId: string, leaverName: string): Promise<void> {
  const roomRef = doc(db, 'rooms', roomId);
  try {
    await updateDoc(roomRef, {
      status: 'encerrada',
      abandonedBy: leaverName,
      lastActiveAt: Date.now(),
    });
  } catch (err) {
    console.warn('[leaveRoom] Failed to mark room as abandoned:', err);
  }
}

/**
 * Restart match with new questions
 */
export async function restartMultiplayerMatch(
  roomId: string,
  firstQuestion: Question
): Promise<void> {
  await startMultiplayerMatch(roomId, firstQuestion);
}
