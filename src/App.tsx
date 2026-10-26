/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { MainTab, GameId, CoupleProfile, GameStats, UserProfile, CoupleRelationship, RealLifeChallenge } from './types';
import { loadCoupleProfile, saveCoupleProfile, loadGameStats, saveGameStats, updateStatsAndCheckAchievements } from './utils/storage';
import { calculateDaysTogether, calculateCoinsReward } from './utils/gameLogic';
import { sound } from './utils/audio';
import { ACHIEVEMENTS_DATA } from './data/achievements';
import { auth } from './lib/firebase';
import { getUserProfile, listenToUserProfile } from './services/authService';
import { listenToRelationship, addRelationshipHistoryItem } from './services/relationshipService';

import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { GamesHubView } from './components/GamesHubView';
import { RealLifeView } from './components/RealLifeView';
import { ProfileView } from './components/ProfileView';

import { ConheceGame } from './components/games/ConheceGame';
import { DueloGame } from './components/games/DueloGame';
import { ESeGame } from './components/games/ESeGame';
import { MundinhoGame } from './components/games/MundinhoGame';
import { MultiplayerModal } from './components/multiplayer/MultiplayerModal';
import { AuthModal } from './components/auth/AuthModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<MainTab>('inicio');
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const [profile, setProfile] = useState<CoupleProfile>(loadCoupleProfile);
  const [stats, setStats] = useState<GameStats>(loadGameStats);
  const [unlockedToast, setUnlockedToast] = useState<{ title: string; icon: string } | null>(null);
  const [isMultiplayerOpen, setIsMultiplayerOpen] = useState<boolean>(false);
  const [multiplayerMode, setMultiplayerMode] = useState<'create' | 'join'>('create');

  // Individual accounts & shared relationship states
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentRelationship, setCurrentRelationship] = useState<CoupleRelationship | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Monitor Firebase Auth changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser && !fbUser.isAnonymous) {
        const uProfile = await getUserProfile(fbUser.uid);
        if (uProfile) {
          setCurrentUser(uProfile);

          // Sync local profile with user details
          setProfile((prev) => ({
            ...prev,
            partner1Name: uProfile.displayName || prev.partner1Name,
            partner1Avatar: uProfile.avatar || prev.partner1Avatar,
          }));
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Monitor real-time user profile in Firestore
  useEffect(() => {
    if (!currentUser?.uid) return;
    const unsub = listenToUserProfile(currentUser.uid, (updatedUser) => {
      setCurrentUser(updatedUser);
      if (updatedUser.displayName) {
        setProfile((prev) => ({
          ...prev,
          partner1Name: updatedUser.displayName,
          partner1Avatar: updatedUser.avatar,
        }));
      }
    });
    return () => unsub();
  }, [currentUser?.uid]);

  // Monitor real-time couple relationship
  useEffect(() => {
    const relId = currentUser?.relationshipId || currentRelationship?.id;
    if (!relId) {
      setCurrentRelationship(null);
      return;
    }

    const unsubRel = listenToRelationship(relId, (rel) => {
      setCurrentRelationship(rel);
      if (rel && rel.status === 'connected') {
        const isUser1 = currentUser?.uid === rel.user1Id;
        const myName = isUser1 ? rel.user1Name : rel.user2Name || 'Amor 1';
        const myAvatar = isUser1 ? rel.user1Avatar : rel.user2Avatar || '💜';
        const partnerName = isUser1 ? rel.user2Name || 'Amor 2' : rel.user1Name;
        const partnerAvatar = isUser1 ? rel.user2Avatar || '🌸' : rel.user1Avatar;

        setProfile((prev) => {
          const updated = {
            ...prev,
            partner1Name: myName,
            partner1Avatar: myAvatar,
            partner2Name: partnerName,
            partner2Avatar: partnerAvatar,
            anniversaryDate: rel.anniversaryDate || prev.anniversaryDate,
          };
          saveCoupleProfile(updated);
          return updated;
        });
      }
    });

    return () => unsubRel();
  }, [currentUser?.relationshipId]);

  // Sync audio mute state with profile
  useEffect(() => {
    sound.setMuted(!profile.soundEnabled);
  }, [profile.soundEnabled]);

  const daysTogether = calculateDaysTogether(profile.anniversaryDate);

  const showAchievementToast = (achId: string) => {
    const ach = ACHIEVEMENTS_DATA.find((a) => a.id === achId);
    if (ach) {
      sound.playFanfare();
      setUnlockedToast({ title: ach.title, icon: ach.icon });
      setTimeout(() => {
        setUnlockedToast(null);
      }, 4000);
    }
  };

  const handleUpdateProfile = (updated: CoupleProfile) => {
    setProfile(updated);
    saveCoupleProfile(updated);
  };

  const handleToggleSound = () => {
    const next = !profile.soundEnabled;
    const updated = { ...profile, soundEnabled: next };
    setProfile(updated);
    saveCoupleProfile(updated);
  };

  const handleSelectGame = (gameId: GameId) => {
    if (gameId === 'vida-real') {
      setCurrentTab('vida-real');
      setActiveGame(null);
    } else {
      setActiveGame(gameId);
    }
  };

  const handleBackToHub = () => {
    setActiveGame(null);
  };

  const handleOpenCreateRoom = () => {
    setMultiplayerMode('create');
    setIsMultiplayerOpen(true);
  };

  const handleOpenJoinRoom = () => {
    setMultiplayerMode('join');
    setIsMultiplayerOpen(true);
  };

  const handleMultiplayerCoins = (coinsWon: number) => {
    const { stats: updated, newAchievements } = updateStatsAndCheckAchievements((prev) => ({
      ...prev,
      totalGamesPlayed: prev.totalGamesPlayed + 1,
      conheceRounds: prev.conheceRounds + 1,
      coins: (prev.coins || 0) + coinsWon,
    }));
    setStats(updated);
    if (newAchievements.length > 0) {
      showAchievementToast(newAchievements[0]);
    }
  };

  // Record stats from Quanto Você Me Conhece
  const handleRecordConheceRound = (isCorrect: boolean) => {
    const reward = isCorrect ? calculateCoinsReward('conhece') : 5;
    const { stats: updated, newAchievements } = updateStatsAndCheckAchievements((prev) => ({
      ...prev,
      totalGamesPlayed: prev.totalGamesPlayed + 1,
      conheceRounds: prev.conheceRounds + 1,
      coins: (prev.coins || 0) + reward,
    }));
    setStats(updated);
    if (newAchievements.length > 0) {
      showAchievementToast(newAchievements[0]);
    }

    if (currentRelationship) {
      addRelationshipHistoryItem(
        currentRelationship.id,
        {
          id: `hist_${Date.now()}`,
          type: 'conhece',
          title: 'Rodada de Afinidade',
          description: isCorrect
            ? `${profile.partner1Name} e ${profile.partner2Name} acertaram em cheio! (+${reward} 🪙)`
            : `Nova descoberta entre ${profile.partner1Name} e ${profile.partner2Name}`,
          timestamp: Date.now(),
        },
        reward
      ).catch(console.warn);
    }
  };

  // Record stats from Duelo de Casais
  const handleRecordDuelMatch = (winner: 'p1' | 'p2' | 'tie') => {
    const reward = winner === 'tie' ? calculateCoinsReward('duelo_tie') : calculateCoinsReward('duelo_win');
    const { stats: updated, newAchievements } = updateStatsAndCheckAchievements((prev) => ({
      ...prev,
      totalGamesPlayed: prev.totalGamesPlayed + 1,
      dueloWinsP1: winner === 'p1' ? prev.dueloWinsP1 + 1 : prev.dueloWinsP1,
      dueloWinsP2: winner === 'p2' ? prev.dueloWinsP2 + 1 : prev.dueloWinsP2,
      coins: (prev.coins || 0) + reward,
    }));
    setStats(updated);
    if (newAchievements.length > 0) {
      showAchievementToast(newAchievements[0]);
    }

    if (currentRelationship) {
      const winnerName = winner === 'p1' ? profile.partner1Name : winner === 'p2' ? profile.partner2Name : 'Empate';
      addRelationshipHistoryItem(
        currentRelationship.id,
        {
          id: `hist_${Date.now()}`,
          type: 'duelo',
          title: 'Duelo de Casais',
          description: winner === 'tie' ? 'Disputa acirrada terminada em empate!' : `${winnerName} venceu o duelo! (+${reward} 🪙)`,
          timestamp: Date.now(),
        },
        reward
      ).catch(console.warn);
    }
  };

  // Record stats from E Se Nós Dois...?
  const handleRecordESeMatch = (isMatch: boolean) => {
    const reward = isMatch ? calculateCoinsReward('e_se_match') : calculateCoinsReward('e_se_played');
    const { stats: updated, newAchievements } = updateStatsAndCheckAchievements((prev) => ({
      ...prev,
      totalGamesPlayed: prev.totalGamesPlayed + 1,
      eSeMatches: isMatch ? prev.eSeMatches + 1 : prev.eSeMatches,
      coins: (prev.coins || 0) + reward,
    }));
    setStats(updated);
    if (newAchievements.length > 0) {
      showAchievementToast(newAchievements[0]);
    }
  };

  // Record challenge completed in Vida Real
  const handleRecordChallengeCompleted = (challenge: RealLifeChallenge) => {
    const reward = calculateCoinsReward('vida_real');
    const { stats: updated, newAchievements } = updateStatsAndCheckAchievements((prev) => ({
      ...prev,
      realLifeCompleted: prev.realLifeCompleted + 1,
      coins: (prev.coins || 0) + reward,
    }));
    setStats(updated);
    if (newAchievements.length > 0) {
      showAchievementToast(newAchievements[0]);
    }

    if (currentRelationship) {
      addRelationshipHistoryItem(
        currentRelationship.id,
        {
          id: `hist_${Date.now()}`,
          type: 'desafio_vida_real',
          title: `Desafio: ${challenge.title}`,
          description: `${profile.partner1Name} e ${profile.partner2Name} cumpriram a missão '${challenge.title}' fora da tela! (+${reward} 🪙)`,
          timestamp: Date.now(),
        },
        reward
      ).catch(console.warn);
    }
  };

  // Complete daily challenge from Home
  const handleCompleteDailyChallenge = () => {
    const today = new Date().toISOString().split('T')[0];
    if (stats.lastCompletedDailyDate === today) return;

    sound.playFanfare();
    const reward = calculateCoinsReward('daily_challenge');
    const { stats: updated, newAchievements } = updateStatsAndCheckAchievements((prev) => ({
      ...prev,
      lastCompletedDailyDate: today,
      coins: (prev.coins || 0) + reward,
    }));
    setStats(updated);
    if (newAchievements.length > 0) {
      showAchievementToast(newAchievements[0]);
    }
  };

  // Reset all stats
  const handleResetStats = () => {
    const freshStats: GameStats = {
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
    saveGameStats(freshStats);
    setStats(freshStats);
  };

  // Update Nosso Mundinho items & coins
  const handleUpdateMundinho = (newCoins: number, newItems: string[]) => {
    const { stats: updated } = updateStatsAndCheckAchievements((prev) => ({
      ...prev,
      coins: newCoins,
      mundinhoItems: newItems,
    }));
    setStats(updated);
  };

  return (
    <div className="min-h-screen bg-[#063F39] text-[#FFFDF7] flex flex-col font-sans selection:bg-[#FFD15C] selection:text-[#063F39]">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setActiveGame(null);
          setCurrentTab(tab);
        }}
        profile={profile}
        stats={stats}
        onToggleSound={handleToggleSound}
        daysTogether={daysTogether}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-2 sm:px-6">
        {/* If a game is actively running */}
        {activeGame === 'conhece' && (
          <ConheceGame
            profile={profile}
            onBackToHub={handleBackToHub}
            onRecordRound={handleRecordConheceRound}
            onUpdateProfile={handleUpdateProfile}
            onOpenOnlineMultiplayer={handleOpenCreateRoom}
          />
        )}

        {activeGame === 'duelo' && (
          <DueloGame
            profile={profile}
            onBackToHub={handleBackToHub}
            onRecordDuelMatch={handleRecordDuelMatch}
          />
        )}

        {activeGame === 'e-se' && (
          <ESeGame
            profile={profile}
            onBackToHub={handleBackToHub}
            onRecordMatch={handleRecordESeMatch}
          />
        )}

        {activeGame === 'mundinho' && (
          <MundinhoGame
            profile={profile}
            stats={stats}
            onBackToHub={handleBackToHub}
            onUpdateCoinsAndItems={handleUpdateMundinho}
          />
        )}

        {/* If no standalone game is active, render the active tab */}
        {!activeGame && (
          <>
            {currentTab === 'inicio' && (
              <HomeView
                profile={profile}
                stats={stats}
                daysTogether={daysTogether}
                onStartPlaying={() => setCurrentTab('jogos')}
                onSelectGame={handleSelectGame}
                onOpenVidaReal={() => setCurrentTab('vida-real')}
                onOpenPerfil={() => setCurrentTab('perfil')}
                onCompleteDailyChallenge={handleCompleteDailyChallenge}
                onCreateOnlineRoom={handleOpenCreateRoom}
                onJoinOnlineRoom={handleOpenJoinRoom}
              />
            )}

            {currentTab === 'jogos' && (
              <GamesHubView
                profile={profile}
                onSelectGame={handleSelectGame}
                onCreateOnlineRoom={handleOpenCreateRoom}
                onJoinOnlineRoom={handleOpenJoinRoom}
              />
            )}

            {currentTab === 'vida-real' && (
              <RealLifeView
                profile={profile}
                onBackToHome={() => setCurrentTab('inicio')}
                onChallengeCompleted={handleRecordChallengeCompleted}
              />
            )}

            {currentTab === 'perfil' && (
              <ProfileView
                profile={profile}
                stats={stats}
                daysTogether={daysTogether}
                currentUser={currentUser}
                currentRelationship={currentRelationship}
                onUpdateProfile={handleUpdateProfile}
                onUpdateCurrentUser={setCurrentUser}
                onUpdateRelationship={setCurrentRelationship}
                onOpenAuthModal={(mode) => {
                  setAuthModalMode(mode);
                  setIsAuthModalOpen(true);
                }}
                onResetStats={handleResetStats}
              />
            )}
          </>
        )}
      </main>

      {/* Auth Modal (Login / Register / Forgot Password) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(uProf) => {
          setCurrentUser(uProf);
        }}
      />

      {/* Real-Time Multiplayer Modal / Overlay */}
      <MultiplayerModal
        isOpen={isMultiplayerOpen}
        initialMode={multiplayerMode}
        profile={profile}
        onClose={() => setIsMultiplayerOpen(false)}
        onRecordCoins={handleMultiplayerCoins}
      />

      {/* Achievement / Reward Toast Banner */}
      {unlockedToast && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-[#082F2B] text-[#FFFDF7] px-5 py-3 rounded-2xl shadow-2xl shadow-[#FFD15C]/20 flex items-center gap-3 border border-[#FFD15C] animate-bounce"
        >
          <span className="text-2xl">{unlockedToast.icon}</span>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#FFD15C] block">
              Recompensa Desbloqueada!
            </span>
            <span className="text-sm font-bold text-[#FFFDF7] block">
              {unlockedToast.title}
            </span>
          </div>
        </aside>
      )}

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setActiveGame(null);
          setCurrentTab(tab);
        }}
      />
    </div>
  );
}
