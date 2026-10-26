/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import configData from '../../firebase-applet-config.json';

const firebaseConfig = {
  projectId: configData.projectId,
  appId: configData.appId,
  apiKey: configData.apiKey,
  authDomain: configData.authDomain,
  storageBucket: configData.storageBucket,
  messagingSenderId: configData.messagingSenderId,
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = configData.firestoreDatabaseId
  ? getFirestore(app, configData.firestoreDatabaseId)
  : getFirestore(app);

let currentAuthPromise: Promise<User> | null = null;

/**
 * Ensures the client has an active anonymous Firebase Auth session.
 */
export async function ensureAuth(): Promise<User> {
  if (auth.currentUser) {
    return auth.currentUser;
  }

  if (currentAuthPromise) {
    return currentAuthPromise;
  }

  currentAuthPromise = new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        unsubscribe();
        currentAuthPromise = null;
        resolve(user);
      }
    });

    signInAnonymously(auth).catch((err) => {
      unsubscribe();
      currentAuthPromise = null;
      console.error('[Firebase Auth] Failed to sign in anonymously:', err);
      reject(err);
    });
  });

  return currentAuthPromise;
}

/**
 * Tests Firestore connectivity via getDocFromServer
 */
export async function testConnection(): Promise<boolean> {
  try {
    await ensureAuth();
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Client is offline or unreachable.');
      return false;
    }
    // Document might not exist, but network reachable
    return true;
  }
}
