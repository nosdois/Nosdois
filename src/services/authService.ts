/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, GameStats } from '../types';

export const USER_COLLECTION = 'users';

const DEFAULT_STATS: GameStats = {
  totalGamesPlayed: 0,
  conheceRounds: 0,
  dueloWinsP1: 0,
  dueloWinsP2: 0,
  eSeMatches: 0,
  realLifeCompleted: 0,
  coins: 50,
  mundinhoItems: ['bancocasal'],
  unlockedAchievements: [],
  recentQuestionIds: [],
  recentDilemmaIds: [],
  recentChallengeIds: [],
};

export function getFriendlyAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Este e-mail já está sendo utilizado por outra conta.';
    case 'auth/invalid-email':
      return 'O formato do e-mail é inválido.';
    case 'auth/weak-password':
      return 'A senha deve ter pelo menos 6 caracteres.';
    case 'auth/user-not-found':
      return 'Nenhuma conta encontrada com este e-mail.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos. Verifique suas credenciais.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas sem sucesso. Aguarde alguns instantes.';
    case 'auth/network-request-failed':
      return 'Falha de conexão. Verifique sua internet.';
    default:
      return 'Ocorreu um erro na autenticação. Tente novamente.';
  }
}

/**
 * Register a new user with Email, Password, Name, and Avatar
 */
export async function registerWithEmail(
  email: string,
  pass: string,
  displayName: string,
  avatar: string
): Promise<UserProfile> {
  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  const fbUser = userCredential.user;

  const cleanName = displayName.trim() || 'Amor';
  await updateProfile(fbUser, { displayName: cleanName });

  const profile: UserProfile = {
    uid: fbUser.uid,
    email: fbUser.email || email.trim(),
    displayName: cleanName,
    avatar: avatar || '💜',
    createdAt: Date.now(),
    relationshipId: null,
    partnerUid: null,
    partnerName: null,
    partnerAvatar: null,
    stats: DEFAULT_STATS,
    preferences: {
      soundEnabled: true,
      theme: 'teal',
    },
  };

  try {
    await setDoc(doc(db, USER_COLLECTION, fbUser.uid), profile);
  } catch (err) {
    console.warn('[authService] Failed to set user doc in Firestore, saving locally:', err);
  }

  localStorage.setItem(`nos_dois_user_${fbUser.uid}`, JSON.stringify(profile));
  return profile;
}

/**
 * Sign in existing user with Email and Password
 */
export async function loginWithEmail(email: string, pass: string): Promise<UserProfile> {
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
  const fbUser = userCredential.user;

  // Retrieve user doc from Firestore
  try {
    const userDocSnap = await getDoc(doc(db, USER_COLLECTION, fbUser.uid));
    if (userDocSnap.exists()) {
      const data = userDocSnap.data() as UserProfile;
      localStorage.setItem(`nos_dois_user_${fbUser.uid}`, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('[authService] Error fetching user doc from Firestore:', err);
  }

  // Fallback if doc didn't exist or offline
  const fallbackProfile: UserProfile = {
    uid: fbUser.uid,
    email: fbUser.email || email.trim(),
    displayName: fbUser.displayName || 'Amor',
    avatar: '💜',
    createdAt: Date.now(),
    relationshipId: null,
    partnerUid: null,
    partnerName: null,
    partnerAvatar: null,
    stats: DEFAULT_STATS,
    preferences: {
      soundEnabled: true,
      theme: 'teal',
    },
  };

  try {
    await setDoc(doc(db, USER_COLLECTION, fbUser.uid), fallbackProfile);
  } catch (_) {
    // ignore
  }

  return fallbackProfile;
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Sign out current user
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Update current user's profile in Firebase and Firestore
 */
export async function updateCurrentProfile(
  uid: string,
  updates: { displayName?: string; avatar?: string }
): Promise<void> {
  if (auth.currentUser && updates.displayName) {
    await updateProfile(auth.currentUser, { displayName: updates.displayName });
  }

  try {
    await updateDoc(doc(db, USER_COLLECTION, uid), {
      ...(updates.displayName ? { displayName: updates.displayName } : {}),
      ...(updates.avatar ? { avatar: updates.avatar } : {}),
    });
  } catch (err) {
    console.warn('[authService] updateDoc error:', err);
  }
}

/**
 * Fetch user profile from Firestore or local storage
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, USER_COLLECTION, uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
  } catch (err) {
    console.warn('[authService] getUserProfile error:', err);
  }

  const local = localStorage.getItem(`nos_dois_user_${uid}`);
  if (local) {
    try {
      return JSON.parse(local) as UserProfile;
    } catch (_) {}
  }
  return null;
}

/**
 * Listen to Firestore user profile real-time
 */
export function listenToUserProfile(
  uid: string,
  onUpdate: (profile: UserProfile) => void
): () => void {
  return onSnapshot(
    doc(db, USER_COLLECTION, uid),
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as UserProfile);
      }
    },
    (err) => {
      console.warn('[authService] listenToUserProfile snapshot error:', err);
    }
  );
}
