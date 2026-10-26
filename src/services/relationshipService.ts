/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CoupleInvite, CoupleRelationship, RelationshipHistoryItem, UserProfile } from '../types';
import { USER_COLLECTION } from './authService';

export const RELATIONSHIPS_COLLECTION = 'relationships';
export const INVITES_COLLECTION = 'invites';

/**
 * Generate 6-char alphanumeric invite code (uppercase, readable)
 */
function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Creates an invite and an associated relationship record for the couple.
 */
export async function createCoupleInvite(user: UserProfile): Promise<{ code: string; relationshipId: string }> {
  const code = generateInviteCode();
  const relationshipId = `rel_${user.uid}_${Date.now()}`;
  const now = Date.now();
  const expiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days

  const relationship: CoupleRelationship = {
    id: relationshipId,
    user1Id: user.uid,
    user2Id: null,
    user1Name: user.displayName,
    user2Name: null,
    user1Avatar: user.avatar,
    user2Avatar: null,
    anniversaryDate: '',
    coins: 100,
    status: 'pending',
    createdAt: now,
    history: [
      {
        id: `hist_${now}`,
        type: 'conhece',
        title: 'Nós Dois Conectado',
        description: `${user.displayName} criou o convite de conexão do casal.`,
        timestamp: now,
      },
    ],
  };

  const invite: CoupleInvite = {
    code,
    relationshipId,
    creatorUid: user.uid,
    creatorName: user.displayName,
    creatorAvatar: user.avatar,
    status: 'pending',
    createdAt: now,
    expiresAt,
  };

  // Write relationship doc and invite doc
  await setDoc(doc(db, RELATIONSHIPS_COLLECTION, relationshipId), relationship);
  await setDoc(doc(db, INVITES_COLLECTION, code), invite);

  // Update creator user profile with relationshipId
  await updateDoc(doc(db, USER_COLLECTION, user.uid), {
    relationshipId,
  });

  return { code, relationshipId };
}

/**
 * Look up an invite by code
 */
export async function lookupInvite(code: string): Promise<CoupleInvite | null> {
  const cleanCode = code.trim().toUpperCase();
  if (cleanCode.length !== 6) {
    throw new Error('O código de convite deve conter 6 caracteres.');
  }

  const snap = await getDoc(doc(db, INVITES_COLLECTION, cleanCode));
  if (!snap.exists()) {
    throw new Error('Código de convite não encontrado. Verifique se digitou corretamente.');
  }

  const invite = snap.data() as CoupleInvite;
  if (invite.status !== 'pending') {
    throw new Error('Este convite já foi utilizado ou não está mais ativo.');
  }

  if (Date.now() > invite.expiresAt) {
    throw new Error('Este convite expirou. Peça ao seu amor para gerar um novo código.');
  }

  return invite;
}

/**
 * Accept invite and link the two accounts in a shared relationship.
 */
export async function acceptCoupleInvite(
  code: string,
  guestUser: UserProfile
): Promise<CoupleRelationship> {
  const invite = await lookupInvite(code);
  if (!invite) {
    throw new Error('Convite inválido.');
  }

  if (invite.creatorUid === guestUser.uid) {
    throw new Error('Você não pode aceitar seu próprio convite!');
  }

  const relRef = doc(db, RELATIONSHIPS_COLLECTION, invite.relationshipId);
  const relSnap = await getDoc(relRef);
  if (!relSnap.exists()) {
    throw new Error('Relacionamento não encontrado.');
  }

  const relData = relSnap.data() as CoupleRelationship;
  if (relData.user2Id && relData.user2Id !== guestUser.uid) {
    throw new Error('Este casal já foi formado por outro usuário.');
  }

  const now = Date.now();
  const updatedRel: Partial<CoupleRelationship> = {
    user2Id: guestUser.uid,
    user2Name: guestUser.displayName,
    user2Avatar: guestUser.avatar,
    status: 'connected',
    history: [
      ...(relData.history || []),
      {
        id: `hist_${now}`,
        type: 'conhece',
        title: 'Casal Conectado!',
        description: `${guestUser.displayName} aceitou o convite de ${relData.user1Name}. Agora vocês estão conectados no Nós Dois! 💕`,
        timestamp: now,
      },
    ],
  };

  // Update relationship
  await updateDoc(relRef, updatedRel);

  // Mark invite accepted
  await updateDoc(doc(db, INVITES_COLLECTION, invite.code), {
    status: 'accepted',
  });

  // Update guest user profile
  await updateDoc(doc(db, USER_COLLECTION, guestUser.uid), {
    relationshipId: relData.id,
    partnerUid: relData.user1Id,
    partnerName: relData.user1Name,
    partnerAvatar: relData.user1Avatar,
  });

  // Update creator user profile
  await updateDoc(doc(db, USER_COLLECTION, relData.user1Id), {
    partnerUid: guestUser.uid,
    partnerName: guestUser.displayName,
    partnerAvatar: guestUser.avatar,
  });

  return {
    ...relData,
    ...updatedRel,
  } as CoupleRelationship;
}

/**
 * Disconnect relationship
 */
export async function disconnectRelationship(
  relationshipId: string,
  currentUid: string
): Promise<void> {
  const relRef = doc(db, RELATIONSHIPS_COLLECTION, relationshipId);
  const relSnap = await getDoc(relRef);

  if (relSnap.exists()) {
    const rel = relSnap.data() as CoupleRelationship;
    await updateDoc(relRef, {
      status: 'disconnected',
    });

    // Clear relationshipId on both users
    if (rel.user1Id) {
      try {
        await updateDoc(doc(db, USER_COLLECTION, rel.user1Id), {
          relationshipId: null,
          partnerUid: null,
          partnerName: null,
          partnerAvatar: null,
        });
      } catch (_) {}
    }
    if (rel.user2Id) {
      try {
        await updateDoc(doc(db, USER_COLLECTION, rel.user2Id), {
          relationshipId: null,
          partnerUid: null,
          partnerName: null,
          partnerAvatar: null,
        });
      } catch (_) {}
    }
  }
}

/**
 * Update relationship anniversary date
 */
export async function updateRelationshipAnniversary(
  relationshipId: string,
  anniversaryDate: string
): Promise<void> {
  await updateDoc(doc(db, RELATIONSHIPS_COLLECTION, relationshipId), {
    anniversaryDate,
  });
}

/**
 * Add history entry to relationship
 */
export async function addRelationshipHistoryItem(
  relationshipId: string,
  item: RelationshipHistoryItem,
  coinsBonus: number = 0
): Promise<void> {
  const relRef = doc(db, RELATIONSHIPS_COLLECTION, relationshipId);
  const snap = await getDoc(relRef);
  if (snap.exists()) {
    const rel = snap.data() as CoupleRelationship;
    const currentHist = rel.history || [];
    const newHistory = [item, ...currentHist].slice(0, 50); // keep recent 50
    await updateDoc(relRef, {
      history: newHistory,
      coins: (rel.coins || 0) + coinsBonus,
    });
  }
}

/**
 * Subscribe to real-time relationship updates
 */
export function listenToRelationship(
  relationshipId: string,
  onUpdate: (rel: CoupleRelationship | null) => void
): () => void {
  return onSnapshot(
    doc(db, RELATIONSHIPS_COLLECTION, relationshipId),
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as CoupleRelationship);
      } else {
        onUpdate(null);
      }
    },
    (err) => {
      console.warn('[relationshipService] listenToRelationship error:', err);
    }
  );
}
