/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Heart,
  Sparkles,
  Volume2,
  VolumeX,
  Calendar,
  Award,
  Trophy,
  RotateCcw,
  Check,
  Users,
  Coins,
  Smartphone,
  User,
  LogIn,
  LogOut,
  Copy,
  Share2,
  Link as LinkIcon,
  Unlink,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { CoupleProfile, CoupleRelationship, GameStats, RelationshipHistoryItem, UserProfile } from '../types';
import { ACHIEVEMENTS_DATA } from '../data/achievements';
import { sound } from '../utils/audio';
import { formatRelationshipDuration } from '../utils/gameLogic';
import { logoutUser, updateCurrentProfile } from '../services/authService';
import {
  createCoupleInvite,
  lookupInvite,
  acceptCoupleInvite,
  disconnectRelationship,
  updateRelationshipAnniversary,
  listenToRelationship,
} from '../services/relationshipService';

interface ProfileViewProps {
  profile: CoupleProfile;
  stats: GameStats;
  daysTogether: number;
  currentUser: UserProfile | null;
  currentRelationship: CoupleRelationship | null;
  onUpdateProfile: (updated: CoupleProfile) => void;
  onUpdateCurrentUser: (user: UserProfile | null) => void;
  onUpdateRelationship: (rel: CoupleRelationship | null) => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onResetStats: () => void;
}

const AVATAR_OPTIONS = ['💜', '🌸', '👑', '✨', '🦊', '🐻', '🌹', '🍓', '☕', '🪐', '🎸', '🌟'];

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  stats,
  daysTogether,
  currentUser,
  currentRelationship,
  onUpdateProfile,
  onUpdateCurrentUser,
  onUpdateRelationship,
  onOpenAuthModal,
  onResetStats,
}) => {
  const [subTab, setSubTab] = useState<'meu_perfil' | 'nosso_relacionamento'>('meu_perfil');

  // Individual profile edit state
  const [myDisplayName, setMyDisplayName] = useState<string>(
    currentUser?.displayName || profile.partner1Name || 'Amor'
  );
  const [myAvatar, setMyAvatar] = useState<string>(
    currentUser?.avatar || profile.partner1Avatar || '💜'
  );
  const [mySavedSuccess, setMySavedSuccess] = useState<boolean>(false);

  // Relationship edit state
  const [partner2NameLocal, setPartner2NameLocal] = useState<string>(profile.partner2Name || 'Amor 2');
  const [partner2AvatarLocal, setPartner2AvatarLocal] = useState<string>(profile.partner2Avatar || '🌸');
  const [anniversaryDate, setAnniversaryDate] = useState<string>(
    currentRelationship?.anniversaryDate || profile.anniversaryDate || ''
  );

  // Invite connection state
  const [generatedInviteCode, setGeneratedInviteCode] = useState<string | null>(null);
  const [isGeneratingInvite, setIsGeneratingInvite] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [inputInviteCode, setInputInviteCode] = useState<string>('');
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [isJoiningInvite, setIsJoiningInvite] = useState<boolean>(false);
  const [showConfirmDisconnect, setShowConfirmDisconnect] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      setMyDisplayName(currentUser.displayName);
      setMyAvatar(currentUser.avatar);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentRelationship?.anniversaryDate) {
      setAnniversaryDate(currentRelationship.anniversaryDate);
    }
  }, [currentRelationship]);

  // Handle saving individual profile
  const handleSaveMyProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();
    const cleanName = myDisplayName.trim() || 'Amor';

    if (currentUser) {
      await updateCurrentProfile(currentUser.uid, {
        displayName: cleanName,
        avatar: myAvatar,
      });
      onUpdateCurrentUser({
        ...currentUser,
        displayName: cleanName,
        avatar: myAvatar,
      });
    }

    onUpdateProfile({
      ...profile,
      partner1Name: cleanName,
      partner1Avatar: myAvatar,
    });

    setMySavedSuccess(true);
    setTimeout(() => setMySavedSuccess(false), 2500);
  };

  // Handle saving local couple details (for offline/same-device play)
  const handleSaveLocalCouple = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();
    const updated: CoupleProfile = {
      ...profile,
      partner1Name: myDisplayName.trim() || 'Amor 1',
      partner1Avatar: myAvatar,
      partner2Name: partner2NameLocal.trim() || 'Amor 2',
      partner2Avatar: partner2AvatarLocal,
      anniversaryDate,
    };
    onUpdateProfile(updated);

    if (currentRelationship && anniversaryDate !== currentRelationship.anniversaryDate) {
      updateRelationshipAnniversary(currentRelationship.id, anniversaryDate).catch(console.warn);
    }

    setMySavedSuccess(true);
    setTimeout(() => setMySavedSuccess(false), 2500);
  };

  // Handle Create Invite
  const handleCreateInvite = async () => {
    if (!currentUser) {
      sound.playClick();
      onOpenAuthModal('register');
      return;
    }

    try {
      setIsGeneratingInvite(true);
      setInviteError(null);
      sound.playClick();
      const res = await createCoupleInvite(currentUser);
      setGeneratedInviteCode(res.code);
      sound.playSuccess();
    } catch (err: any) {
      sound.playBuzzer();
      setInviteError(err?.message || 'Erro ao gerar código de convite.');
    } finally {
      setIsGeneratingInvite(false);
    }
  };

  // Handle Copy / Share Code
  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      sound.playSuccess();
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch (_) {}
  };

  const handleShareInvite = async (code: string) => {
    sound.playClick();
    const shareText = `Vem jogar comigo no Nós Dois! Meu código de casal é: ${code}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Nós Dois — Conexão de Casal',
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch (_) {}
    }
    handleCopyCode(shareText);
  };

  // Handle Join Invite
  const handleJoinInvite = async () => {
    if (!currentUser) {
      sound.playClick();
      onOpenAuthModal('register');
      return;
    }

    if (!inputInviteCode.trim()) {
      setInviteError('Digite o código de 6 caracteres do seu parceiro.');
      return;
    }

    try {
      setIsJoiningInvite(true);
      setInviteError(null);
      setInviteSuccess(null);
      sound.playClick();

      const rel = await acceptCoupleInvite(inputInviteCode, currentUser);
      sound.playFanfare();
      onUpdateRelationship(rel);
      setInviteSuccess(`Conexão confirmada com ${rel.user1Name}! Agora vocês estão vinculados 💕`);
      setInputInviteCode('');

      // Also update local profile partner names
      onUpdateProfile({
        ...profile,
        partner1Name: currentUser.displayName,
        partner1Avatar: currentUser.avatar,
        partner2Name: rel.user1Name,
        partner2Avatar: rel.user1Avatar,
      });
    } catch (err: any) {
      sound.playBuzzer();
      setInviteError(err?.message || 'Código inválido ou indisponível.');
    } finally {
      setIsJoiningInvite(false);
    }
  };

  // Handle Disconnect
  const handleDisconnect = async () => {
    if (!currentRelationship || !currentUser) return;
    try {
      sound.playClick();
      await disconnectRelationship(currentRelationship.id, currentUser.uid);
      onUpdateRelationship(null);
      setShowConfirmDisconnect(false);
      sound.playSuccess();
    } catch (err) {
      console.warn(err);
    }
  };

  const unlockedSet = new Set(stats.unlockedAchievements || []);
  const isOnlineConnected = Boolean(currentRelationship && currentRelationship.status === 'connected');
  const partnerName = isOnlineConnected
    ? currentRelationship?.user1Id === currentUser?.uid
      ? currentRelationship?.user2Name
      : currentRelationship?.user1Name
    : profile.partner2Name;
  const partnerAvatar = isOnlineConnected
    ? currentRelationship?.user1Id === currentUser?.uid
      ? currentRelationship?.user2Avatar
      : currentRelationship?.user1Avatar
    : profile.partner2Avatar;

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-28">
      {/* Page Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#FFFDF7] mb-1">
          Perfil & Relacionamento
        </h2>
        <p className="text-xs sm:text-sm text-[#BBD9D2]">
          Gerencie sua conta individual, sincronize com seu amor e celebre sua trajetória.
        </p>

        {/* Subtabs Switcher */}
        <div className="inline-flex bg-[#082F2B] border border-[#17675C] rounded-2xl p-1 mt-4 shadow-md">
          <button
            onClick={() => {
              sound.playClick();
              setSubTab('meu_perfil');
            }}
            className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'meu_perfil'
                ? 'bg-[#FFD15C] text-[#063F39] shadow-sm'
                : 'text-[#BBD9D2] hover:text-[#FFFDF7]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Meu Perfil</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setSubTab('nosso_relacionamento');
            }}
            className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'nosso_relacionamento'
                ? 'bg-[#FFD15C] text-[#063F39] shadow-sm'
                : 'text-[#BBD9D2] hover:text-[#FFFDF7]'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Nosso Relacionamento</span>
            {isOnlineConnected && (
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* ======================= SUBTAB 1: MEU PERFIL ======================= */}
      {subTab === 'meu_perfil' && (
        <div className="space-y-6 animate-fade-in">
          {/* Account Status Card */}
          <div className="bg-[#082F2B] border border-[#17675C] rounded-3xl p-5 sm:p-7 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <span className="w-16 h-16 rounded-2xl bg-[#073630] border border-[#17675C] flex items-center justify-center text-3xl shrink-0 shadow-inner">
                {myAvatar}
              </span>
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h3 className="text-lg sm:text-xl font-bold font-display text-[#FFFDF7]">
                    {currentUser?.displayName || myDisplayName}
                  </h3>
                  {currentUser && (
                    <span className="px-2 py-0.5 rounded-full bg-[#104B43] border border-[#17675C] text-[10px] text-[#FFD15C] font-semibold">
                      Conta Online
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#BBD9D2] mt-0.5">
                  {currentUser?.email ? (
                    currentUser.email
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[#8AAFA7]">
                      <Smartphone className="w-3.5 h-3.5" /> Modo Local (sem login)
                    </span>
                  )}
                </p>
                {currentUser?.createdAt && (
                  <span className="text-[10px] text-[#8AAFA7] block mt-1">
                    Membro desde {new Date(currentUser.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
            </div>

            {/* Auth Action Buttons */}
            <div>
              {currentUser ? (
                <button
                  onClick={async () => {
                    sound.playClick();
                    await logoutUser();
                    onUpdateCurrentUser(null);
                  }}
                  className="px-4 py-2 bg-[#073630] hover:bg-[#104B43] border border-[#17675C] text-[#F16D7A] hover:text-[#FFFDF7] font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair da Conta</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playClick();
                      onOpenAuthModal('login');
                    }}
                    className="px-4 py-2 bg-[#073630] hover:bg-[#104B43] border border-[#17675C] text-[#FFFDF7] font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#FFD15C]" />
                    <span>Entrar</span>
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      onOpenAuthModal('register');
                    }}
                    className="px-4 py-2 bg-[#FFD15C] hover:bg-[#EAB83F] text-[#063F39] font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#063F39]" />
                    <span>Criar Conta</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Guest Explanation Banner */}
          {!currentUser && (
            <div className="bg-[#104B43]/50 border border-[#17675C] rounded-2xl p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#FFD15C] shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-[#FFFDF7] block mb-0.5">
                  Conecte celulares com uma conta gratuita!
                </span>
                <p className="text-[#BBD9D2] leading-relaxed">
                  Criando uma conta individual, você poderá convidar seu parceiro usando um código de 6 letras e sincronizar o progresso dos dois em tempo real!
                </p>
              </div>
            </div>
          )}

          {/* Personal Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="bg-[#082F2B] border border-[#17675C] rounded-2xl p-3.5 text-center">
              <span className="text-xl font-extrabold text-[#FFD15C] block">
                {stats.totalGamesPlayed || 0}
              </span>
              <span className="text-[11px] text-[#BBD9D2]">Partidas Jogadas</span>
            </div>
            <div className="bg-[#082F2B] border border-[#17675C] rounded-2xl p-3.5 text-center">
              <span className="text-xl font-extrabold text-[#FFD15C] block">
                {stats.dueloWinsP1 || 0}
              </span>
              <span className="text-[11px] text-[#BBD9D2]">Vitórias em Duelo</span>
            </div>
            <div className="bg-[#082F2B] border border-[#17675C] rounded-2xl p-3.5 text-center">
              <span className="text-xl font-extrabold text-[#FFD15C] block">
                {stats.realLifeCompleted || 0}
              </span>
              <span className="text-[11px] text-[#BBD9D2]">Vida Real Feitos</span>
            </div>
            <div className="bg-[#082F2B] border border-[#17675C] rounded-2xl p-3.5 text-center">
              <span className="text-xl font-extrabold text-[#FFD15C] block">
                {stats.coins || 0} 🪙
              </span>
              <span className="text-[11px] text-[#BBD9D2]">Moedas do Amor</span>
            </div>
          </div>

          {/* Edit Profile Form */}
          <form
            onSubmit={handleSaveMyProfile}
            className="bg-[#082F2B] border border-[#17675C] rounded-3xl p-5 sm:p-7 shadow-xl space-y-4"
          >
            <h3 className="text-sm sm:text-base font-bold text-[#FFFDF7] border-b border-[#17675C] pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-[#FFD15C]" />
              <span>Personalizar Meus Dados</span>
            </h3>

            <div>
              <label className="text-[11px] font-semibold text-[#BBD9D2] uppercase tracking-wider block mb-1">
                Meu Nome ou Apelido
              </label>
              <input
                type="text"
                value={myDisplayName}
                onChange={(e) => setMyDisplayName(e.target.value)}
                maxLength={30}
                placeholder="Como seu amor te chama?"
                className="w-full bg-[#073630] border border-[#17675C] focus:border-[#FFD15C] rounded-xl px-4 py-2.5 text-xs text-[#FFFDF7] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#BBD9D2] uppercase tracking-wider block mb-1">
                Meu Avatar
              </label>
              <div className="flex flex-wrap gap-2 p-2 bg-[#073630] border border-[#17675C] rounded-xl">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setMyAvatar(emoji);
                    }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm cursor-pointer transition-all ${
                      myAvatar === emoji
                        ? 'bg-[#104B43] border-2 border-[#FFD15C] scale-110'
                        : 'hover:bg-[#104B43]'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#FFD15C] hover:bg-[#EAB83F] text-[#063F39] font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </button>

              {mySavedSuccess && (
                <span className="text-xs font-semibold text-[#10B981] flex items-center gap-1 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  Salvo com sucesso!
                </span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* ================= SUBTAB 2: NOSSO RELACIONAMENTO ================= */}
      {subTab === 'nosso_relacionamento' && (
        <div className="space-y-6 animate-fade-in">
          {/* Days & Years Together Counter Hero Card */}
          {(() => {
            const duration = formatRelationshipDuration(anniversaryDate);
            if (!duration.hasDate) return null;
            return (
              <div className="bg-gradient-to-r from-[#082F2B] via-[#104B43] to-[#082F2B] border border-[#17675C] rounded-3xl p-5 sm:p-7 text-center shadow-xl relative overflow-hidden">
                <Heart className="w-6 h-6 fill-[#F16D7A] text-[#F16D7A] mx-auto mb-2" />
                <span className="text-xs uppercase tracking-widest text-[#FFD15C] font-bold block mb-1">
                  Tempo Juntos
                </span>
                <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-[#FFFDF7] mb-1.5 tabular-nums">
                  {duration.primary}
                </div>
                {duration.secondary && (
                  <span className="inline-block px-3 py-1 rounded-full bg-[#073630]/80 border border-[#17675C] text-xs text-[#FFD15C] font-semibold mb-2">
                    {duration.secondary}
                  </span>
                )}
                <p className="text-xs text-[#BBD9D2] max-w-sm mx-auto">
                  Celebrando a história de {myDisplayName} e {partnerName}!
                </p>
              </div>
            );
          })()}

          {/* Connected Partner Card */}
          {isOnlineConnected ? (
            <div className="bg-[#082F2B] border border-[#17675C] rounded-3xl p-5 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#17675C] pb-3 mb-4">
                <span className="text-xs font-bold text-[#FFD15C] flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  <span>Casal Conectado Online</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#104B43] text-[#10B981] text-[11px] font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  Ativo
                </span>
              </div>

              <div className="flex items-center justify-around py-3">
                <div className="text-center">
                  <span className="text-3xl block mb-1">{myAvatar}</span>
                  <span className="text-xs font-bold text-[#FFFDF7] block">{myDisplayName}</span>
                  <span className="text-[10px] text-[#BBD9D2]">Você</span>
                </div>

                <div className="flex flex-col items-center">
                  <Heart className="w-6 h-6 fill-[#F16D7A] text-[#F16D7A] animate-pulse" />
                  <span className="text-[10px] text-[#FFD15C] font-bold mt-1">Conectados</span>
                </div>

                <div className="text-center">
                  <span className="text-3xl block mb-1">{partnerAvatar}</span>
                  <span className="text-xs font-bold text-[#FFFDF7] block">{partnerName}</span>
                  <span className="text-[10px] text-[#BBD9D2]">Parceiro(a)</span>
                </div>
              </div>

              {/* Danger Zone: Disconnect */}
              <div className="pt-4 border-t border-[#17675C] flex justify-end">
                {showConfirmDisconnect ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#F16D7A]">Confirmar desvinculação?</span>
                    <button
                      onClick={handleDisconnect}
                      className="px-3 py-1.5 bg-[#F16D7A] text-[#FFFDF7] text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Sim, desvincular
                    </button>
                    <button
                      onClick={() => setShowConfirmDisconnect(false)}
                      className="px-3 py-1.5 bg-[#073630] text-[#BBD9D2] text-xs rounded-lg cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowConfirmDisconnect(true)}
                    className="text-[11px] text-[#8AAFA7] hover:text-[#F16D7A] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Unlink className="w-3.5 h-3.5" />
                    <span>Desvincular relacionamento</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Invite Connection Hub (Not Connected) */
            <div className="bg-[#082F2B] border border-[#17675C] rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
              <div className="text-center max-w-md mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-[#104B43] border border-[#17675C] flex items-center justify-center text-[#FFD15C] mx-auto mb-2">
                  <Heart className="w-6 h-6 fill-[#FFD15C]" />
                </div>
                <h3 className="text-base sm:text-lg font-bold font-display text-[#FFFDF7]">
                  Conectar com meu Amor
                </h3>
                <p className="text-xs text-[#BBD9D2] mt-1">
                  Gere um código de 6 dígitos para seu parceiro ou insira o código que você recebeu.
                </p>
              </div>

              {/* Feedback messages */}
              {inviteError && (
                <div className="p-3 rounded-xl bg-[#3A1E24] border border-[#F16D7A] text-xs text-[#FFFDF7] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#F16D7A] shrink-0" />
                  <span>{inviteError}</span>
                </div>
              )}

              {inviteSuccess && (
                <div className="p-3 rounded-xl bg-[#104B43] border border-[#10B981] text-xs text-[#FFFDF7] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>{inviteSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option 1: Create Invite Code */}
                <div className="bg-[#073630] border border-[#17675C] rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#FFD15C] uppercase tracking-wider block mb-1">
                      Opção 1
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-[#FFFDF7] mb-1">
                      Gerar Código de Convite
                    </h4>
                    <p className="text-[11px] text-[#BBD9D2] mb-3 leading-relaxed">
                      Crie um código exclusivo de 6 letras para seu parceiro digitar no celular dele.
                    </p>

                    {generatedInviteCode ? (
                      <div className="bg-[#082F2B] border border-[#17675C] rounded-xl p-3 text-center mb-3">
                        <span className="text-[10px] text-[#BBD9D2] block mb-0.5">Seu Código:</span>
                        <span className="text-2xl font-extrabold text-[#FFD15C] tracking-widest font-mono">
                          {generatedInviteCode}
                        </span>
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <button
                            onClick={() => handleCopyCode(generatedInviteCode)}
                            className="px-3 py-1 bg-[#104B43] hover:bg-[#17675C] text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5 text-[#FFD15C]" />
                            <span>{copiedCode ? 'Copiado!' : 'Copiar'}</span>
                          </button>
                          <button
                            onClick={() => handleShareInvite(generatedInviteCode)}
                            className="px-3 py-1 bg-[#FFD15C] text-[#063F39] text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Compartilhar</span>
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {!generatedInviteCode && (
                    <button
                      onClick={handleCreateInvite}
                      disabled={isGeneratingInvite}
                      className="w-full py-2.5 bg-[#FFD15C] hover:bg-[#EAB83F] disabled:opacity-50 text-[#063F39] font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 text-[#063F39]" />
                      <span>{isGeneratingInvite ? 'Gerando...' : 'Gerar Meu Código'}</span>
                    </button>
                  )}
                </div>

                {/* Option 2: Enter Partner's Code */}
                <div className="bg-[#073630] border border-[#17675C] rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#FFD15C] uppercase tracking-wider block mb-1">
                      Opção 2
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-[#FFFDF7] mb-1">
                      Tenho um Código do Meu Amor
                    </h4>
                    <p className="text-[11px] text-[#BBD9D2] mb-3 leading-relaxed">
                      Se seu parceiro já gerou um código, digite os 6 dígitos abaixo para se conectar.
                    </p>

                    <input
                      type="text"
                      value={inputInviteCode}
                      onChange={(e) => setInputInviteCode(e.target.value.toUpperCase())}
                      maxLength={6}
                      placeholder="Ex: LOVE88"
                      className="w-full bg-[#082F2B] border border-[#17675C] focus:border-[#FFD15C] rounded-xl px-3 py-2 text-center text-sm font-mono tracking-widest text-[#FFD15C] focus:outline-none mb-3 uppercase"
                    />
                  </div>

                  <button
                    onClick={handleJoinInvite}
                    disabled={isJoiningInvite || inputInviteCode.trim().length !== 6}
                    className="w-full py-2.5 bg-[#104B43] hover:bg-[#17675C] disabled:opacity-50 border border-[#17675C] text-[#FFFDF7] font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <LinkIcon className="w-4 h-4 text-[#FFD15C]" />
                    <span>{isJoiningInvite ? 'Conectando...' : 'Conectar Agora'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Anniversary Date & Local Setup Form */}
          <form
            onSubmit={handleSaveLocalCouple}
            className="bg-[#082F2B] border border-[#17675C] rounded-3xl p-5 sm:p-7 shadow-xl space-y-4"
          >
            <h3 className="text-sm sm:text-base font-bold text-[#FFFDF7] border-b border-[#17675C] pb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#FFD15C]" />
              <span>Data do Início do Relacionamento</span>
            </h3>

            <div>
              <label className="text-[11px] font-semibold text-[#BBD9D2] uppercase tracking-wider block mb-1">
                Data Comemorativa
              </label>
              <input
                type="date"
                value={anniversaryDate}
                onChange={(e) => setAnniversaryDate(e.target.value)}
                className="w-full bg-[#073630] border border-[#17675C] focus:border-[#FFD15C] rounded-xl px-4 py-2.5 text-xs text-[#FFFDF7] focus:outline-none"
              />
              <span className="text-[10px] text-[#8AAFA7] mt-1 block">
                Calcula automaticamente os dias de história e amor juntos!
              </span>
            </div>

            {/* If offline, allow configuring Partner 2 details */}
            {!isOnlineConnected && (
              <div className="pt-3 border-t border-[#17675C] space-y-3">
                <span className="text-xs font-bold text-[#FFD15C] block">
                  Configuração para Partidas no Mesmo Celular
                </span>

                <div>
                  <label className="text-[11px] font-semibold text-[#BBD9D2] uppercase tracking-wider block mb-1">
                    Nome do Jogador 2 (Parceiro)
                  </label>
                  <input
                    type="text"
                    value={partner2NameLocal}
                    onChange={(e) => setPartner2NameLocal(e.target.value)}
                    maxLength={30}
                    placeholder="Nome do Jogador 2"
                    className="w-full bg-[#073630] border border-[#17675C] focus:border-[#FFD15C] rounded-xl px-4 py-2 text-xs text-[#FFFDF7] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#BBD9D2] uppercase tracking-wider block mb-1">
                    Avatar do Jogador 2
                  </label>
                  <div className="flex flex-wrap gap-2 p-2 bg-[#073630] border border-[#17675C] rounded-xl">
                    {AVATAR_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setPartner2AvatarLocal(emoji);
                        }}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs cursor-pointer transition-all ${
                          partner2AvatarLocal === emoji
                            ? 'bg-[#104B43] border-2 border-[#FFD15C] scale-110'
                            : 'hover:bg-[#104B43]'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#FFD15C] hover:bg-[#EAB83F] text-[#063F39] font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Relacionamento</span>
              </button>

              {mySavedSuccess && (
                <span className="text-xs font-semibold text-[#10B981] flex items-center gap-1 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  Salvo com sucesso!
                </span>
              )}
            </div>
          </form>

          {/* History of Relationship Activities */}
          {currentRelationship?.history && currentRelationship.history.length > 0 && (
            <div className="bg-[#082F2B] border border-[#17675C] rounded-3xl p-5 sm:p-7 shadow-xl space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-[#FFFDF7] border-b border-[#17675C] pb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FFD15C]" />
                <span>Histórico de Atividades do Casal</span>
              </h3>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {currentRelationship.history.map((hist) => (
                  <div
                    key={hist.id}
                    className="p-3 bg-[#073630] border border-[#17675C] rounded-xl flex items-start justify-between gap-2"
                  >
                    <div>
                      <span className="text-xs font-bold text-[#FFFDF7] block">
                        {hist.title}
                      </span>
                      <p className="text-[11px] text-[#BBD9D2] leading-tight">
                        {hist.description}
                      </p>
                    </div>
                    <span className="text-[10px] text-[#8AAFA7] shrink-0 mt-0.5">
                      {new Date(hist.timestamp).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Joint Achievements */}
          <div className="bg-[#082F2B] border border-[#17675C] rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#17675C] pb-3">
              <h3 className="text-sm sm:text-base font-bold text-[#FFFDF7] flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#FFD15C]" />
                <span>Conquistas do Casal ({unlockedSet.size}/{ACHIEVEMENTS_DATA.length})</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ACHIEVEMENTS_DATA.map((ach) => {
                const isUnlocked = unlockedSet.has(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                      isUnlocked
                        ? 'bg-[#073630] border-[#FFD15C]/40 text-[#FFFDF7]'
                        : 'bg-[#082F2B]/60 border-[#17675C]/40 text-[#8AAFA7] opacity-60'
                    }`}
                  >
                    <span className="text-2xl">{ach.icon}</span>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold block truncate">{ach.title}</span>
                      <p className="text-[10px] text-[#BBD9D2] line-clamp-1">{ach.description}</p>
                    </div>
                    {isUnlocked && <CheckCircle2 className="w-4 h-4 text-[#FFD15C] shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
