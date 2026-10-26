/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Share2,
  Users,
  Smartphone,
  Play,
  ArrowRight,
  Wifi,
  Sparkles,
  AlertCircle,
  Clock,
  Heart,
  Gamepad2,
} from 'lucide-react';
import { CoupleProfile, RoomData } from '../../types';
import {
  createRoom,
  joinRoom,
  subscribeToRoom,
  startMultiplayerMatch,
  leaveRoom,
} from '../../services/roomService';
import { ensureAuth } from '../../lib/firebase';
import { QUESTIONS_DATA } from '../../data/questions';
import { pickNonRepeating } from '../../utils/gameLogic';
import { sound } from '../../utils/audio';
import { MultiplayerGame } from './MultiplayerGame';

interface MultiplayerModalProps {
  isOpen: boolean;
  initialMode: 'create' | 'join';
  profile: CoupleProfile;
  onClose: () => void;
  onRecordCoins: (coins: number) => void;
}

export const MultiplayerModal: React.FC<MultiplayerModalProps> = ({
  isOpen,
  initialMode,
  profile,
  onClose,
  onRecordCoins,
}) => {
  const [mode, setMode] = useState<'create' | 'join'>(initialMode);
  const [playerName, setPlayerName] = useState<string>(
    initialMode === 'create' ? profile.partner1Name : profile.partner2Name
  );
  const [playerAvatar, setPlayerAvatar] = useState<string>(
    initialMode === 'create' ? profile.partner1Avatar : profile.partner2Avatar
  );
  const [roomCodeInput, setRoomCodeInput] = useState<string>('');
  const [selectedGameId, setSelectedGameId] = useState<string>('conhece');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active room state
  const [activeRoom, setActiveRoom] = useState<RoomData | null>(null);
  const [currentUserUid, setCurrentUserUid] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    setMode(initialMode);
    setPlayerName(initialMode === 'create' ? profile.partner1Name : profile.partner2Name);
    setPlayerAvatar(initialMode === 'create' ? profile.partner1Avatar : profile.partner2Avatar);
    setErrorMessage(null);
  }, [initialMode, isOpen]);

  // Ensure auth on mount
  useEffect(() => {
    if (isOpen) {
      ensureAuth()
        .then((user) => setCurrentUserUid(user.uid))
        .catch((err) => console.error('[Auth Error]', err));
    }
  }, [isOpen]);

  // Subscribe to active room in real time
  useEffect(() => {
    if (!activeRoom?.id) return;

    const unsubscribe = subscribeToRoom(
      activeRoom.id,
      (updated) => {
        if (!updated) {
          setActiveRoom(null);
          return;
        }
        setActiveRoom(updated);
      },
      (err) => {
        setErrorMessage('Erro de sincronização com o Firebase. Tentando reconectar...');
      }
    );

    return () => unsubscribe();
  }, [activeRoom?.id]);

  if (!isOpen) return null;

  const handleCreateRoom = async () => {
    if (!playerName.trim()) {
      setErrorMessage('Por favor, informe seu nome.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);

    try {
      sound.playSuccess();
      const user = await ensureAuth();
      setCurrentUserUid(user.uid);
      const { roomId, code } = await createRoom(playerName, playerAvatar, selectedGameId);
      setActiveRoom({
        id: roomId,
        code,
        status: 'aguardando',
        gameId: selectedGameId,
        hostUid: user.uid,
        hostName: playerName.trim(),
        hostAvatar: playerAvatar,
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
      });
    } catch (err: any) {
      console.error('[Create Room Error]', err);
      setErrorMessage(err?.message || 'Falha ao criar sala. Verifique a conexão com a internet.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!playerName.trim()) {
      setErrorMessage('Por favor, informe seu nome.');
      return;
    }
    if (!roomCodeInput.trim()) {
      setErrorMessage('Por favor, digite o código de 6 letras da sala.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      sound.playSuccess();
      const user = await ensureAuth();
      setCurrentUserUid(user.uid);
      const { room } = await joinRoom(roomCodeInput, playerName, playerAvatar);
      setActiveRoom(room);
    } catch (err: any) {
      console.error('[Join Room Error]', err);
      sound.playBuzzer();
      setErrorMessage(err?.message || 'Não foi possível entrar na sala. Verifique o código.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (!activeRoom) return;
    try {
      await navigator.clipboard.writeText(activeRoom.code);
      sound.playClick();
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch (e) {
      console.warn('Clipboard write failed', e);
    }
  };

  const handleShareInvite = async () => {
    if (!activeRoom) return;
    const shareText = `Oii amor! Criei nossa sala no Nós Dois pra gente jogar juntinhos! Entra com o código: ${activeRoom.code} 💕`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Nós Dois — Jogar Juntos Online',
          text: shareText,
          url: window.location.href,
        });
        sound.playSuccess();
      } catch (err) {
        // Fallback to copy
        handleCopyCode();
      }
    } else {
      handleCopyCode();
    }
  };

  const handleStartGame = async () => {
    if (!activeRoom) return;
    sound.playSuccess();
    const { item: firstQ } = pickNonRepeating(QUESTIONS_DATA, []);
    await startMultiplayerMatch(activeRoom.id, firstQ);
  };

  const handleLeaveRoom = async () => {
    sound.playClick();
    if (activeRoom) {
      await leaveRoom(activeRoom.id, playerName);
    }
    setActiveRoom(null);
    onClose();
  };

  const isHost = activeRoom && currentUserUid === activeRoom.hostUid;

  // RENDER IN-GAME SCREEN
  if (activeRoom && (activeRoom.status === 'em_andamento' || activeRoom.step !== 'LOBBY')) {
    return (
      <div className="fixed inset-0 z-50 bg-[#063F39]/98 backdrop-blur-md overflow-y-auto pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <MultiplayerGame
          room={activeRoom}
          currentUserUid={currentUserUid}
          onLeaveRoom={handleLeaveRoom}
          onRecordCoins={onRecordCoins}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#082F2B] border border-[#17675C] rounded-3xl w-full max-w-lg p-5 sm:p-7 shadow-2xl relative text-[#FFFDF7] animate-scale-up my-auto">
        {/* Close Button */}
        <button
          onClick={activeRoom ? handleLeaveRoom : onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#073630] border border-[#17675C] text-[#BBD9D2] hover:text-[#FFFDF7] hover:border-[#FFD15C] transition-colors cursor-pointer"
          aria-label="Fechar janela"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. LOBBY VIEW (Room created or joined, waiting to start) */}
        {activeRoom ? (
          <div className="space-y-6 pt-1 text-center">
            {/* Header */}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#FFD15C] block mb-1">
                Sala Criada com Sucesso
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#FFFDF7]">
                Sala de Jogo
              </h2>
              <p className="text-xs text-[#BBD9D2] mt-0.5">
                Compartilhe o código abaixo com o seu amor para conectar!
              </p>
            </div>

            {/* Big Code Card */}
            <div className="bg-[#073630] border-2 border-[#17675C] rounded-2xl p-4 sm:p-5 relative">
              <span className="text-[10px] text-[#BBD9D2] font-semibold uppercase tracking-wider block mb-1">
                Código da Sala
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-widest font-mono text-[#FFD15C] select-all my-1">
                {activeRoom.code}
              </div>

              {/* Action Buttons for Code */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-2 rounded-xl bg-[#082F2B] hover:bg-[#104B43] border border-[#17675C] hover:border-[#FFD15C] text-xs font-bold text-[#FFFDF7] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Código Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#FFD15C]" />
                      <span>Copiar Código</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleShareInvite}
                  className="px-4 py-2 rounded-xl bg-[#082F2B] hover:bg-[#104B43] border border-[#17675C] hover:border-[#FFD15C] text-xs font-bold text-[#FFFDF7] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-[#FFD15C]" />
                  <span>Enviar Convite</span>
                </button>
              </div>
            </div>

            {/* Players Status List */}
            <div className="space-y-2.5 text-left">
              <span className="text-xs font-bold text-[#BBD9D2] block">
                Jogadores Conectados (2 necessários):
              </span>

              {/* Host Slot */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#073630] border border-[#17675C]">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-1 bg-[#104B43] rounded-lg border border-[#17675C]">
                    {activeRoom.hostAvatar}
                  </span>
                  <div>
                    <span className="text-sm font-bold text-[#FFFDF7] block">
                      {activeRoom.hostName}
                    </span>
                    <span className="text-[10px] text-[#BBD9D2]">Anfitrião da Sala</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-400">
                  Conectado 🟢
                </span>
              </div>

              {/* Guest Slot */}
              <div
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  activeRoom.guestUid
                    ? 'bg-[#073630] border-[#17675C]'
                    : 'bg-[#063F39]/60 border-dashed border-[#17675C]/80'
                }`}
              >
                {activeRoom.guestUid ? (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-1 bg-[#104B43] rounded-lg border border-[#17675C]">
                        {activeRoom.guestAvatar}
                      </span>
                      <div>
                        <span className="text-sm font-bold text-[#FFFDF7] block">
                          {activeRoom.guestName}
                        </span>
                        <span className="text-[10px] text-[#BBD9D2]">Convidado</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-400">
                      Pronto 🟢
                    </span>
                  </>
                ) : (
                  <div className="flex items-center gap-3 w-full py-1">
                    <div className="w-10 h-10 rounded-lg bg-[#073630] border border-dashed border-[#17675C] flex items-center justify-center text-lg animate-pulse">
                      ⏳
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#BBD9D2] block">
                        Aguardando parceiro conectar...
                      </span>
                      <span className="text-[10px] text-[#8AAFA7]">
                        Envie o código {activeRoom.code} para entrar
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Game Info */}
            <div className="p-3 bg-[#104B43]/50 border border-[#17675C] rounded-xl flex items-center justify-between text-xs">
              <span className="text-[#BBD9D2]">Jogo selecionado:</span>
              <span className="font-bold text-[#FFD15C]">Quanto Você Me Conhece?</span>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2">
              {isHost ? (
                activeRoom.guestUid ? (
                  <button
                    onClick={handleStartGame}
                    className="w-full py-3.5 bg-[#FFD15C] hover:bg-[#EAB83F] text-[#063F39] font-extrabold text-base rounded-2xl shadow-xl shadow-[#FFD15C]/20 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5 fill-[#063F39] text-[#063F39]" />
                    <span>Iniciar Partida Agora!</span>
                  </button>
                ) : (
                  <div className="p-3 bg-[#073630] border border-[#17675C] rounded-2xl text-xs text-[#BBD9D2]">
                    <span>Assim que seu amor entrar na sala, o botão de iniciar será liberado aqui.</span>
                  </div>
                )
              ) : (
                <div className="p-3 bg-[#073630] border border-[#17675C] rounded-2xl text-xs text-[#BBD9D2]">
                  <span>Você está conectado! Aguardando o anfitrião ({activeRoom.hostName}) iniciar a partida...</span>
                </div>
              )}

              <button
                onClick={handleLeaveRoom}
                className="w-full mt-3 py-2 text-xs text-[#BBD9D2] hover:text-[#F16D7A] transition-colors cursor-pointer underline"
              >
                Sair da Sala
              </button>
            </div>
          </div>
        ) : (
          /* 2. FORM VIEW (Create or Join) */
          <div className="space-y-5 pt-1">
            {/* Top Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-[#073630] p-1 rounded-2xl border border-[#17675C]">
              <button
                onClick={() => {
                  sound.playClick();
                  setMode('create');
                  setPlayerName(profile.partner1Name);
                  setPlayerAvatar(profile.partner1Avatar);
                  setErrorMessage(null);
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  mode === 'create'
                    ? 'bg-[#FFD15C] text-[#063F39] shadow-md'
                    : 'text-[#BBD9D2] hover:text-[#FFFDF7]'
                }`}
              >
                Criar Sala
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setMode('join');
                  setPlayerName(profile.partner2Name);
                  setPlayerAvatar(profile.partner2Avatar);
                  setErrorMessage(null);
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  mode === 'join'
                    ? 'bg-[#FFD15C] text-[#063F39] shadow-md'
                    : 'text-[#BBD9D2] hover:text-[#FFFDF7]'
                }`}
              >
                Entrar com Código
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 rounded-2xl bg-[#3A1E24] border border-[#F16D7A] text-xs text-[#F16D7A] flex items-start gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* CREATE MODE FORM */}
            {mode === 'create' && (
              <div className="space-y-4 text-left">
                <div>
                  <label className="text-xs font-bold text-[#BBD9D2] block mb-1.5">
                    Seu Nome na Sala:
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xl p-2 bg-[#073630] border border-[#17675C] rounded-xl">
                      {playerAvatar}
                    </span>
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Ex: Matheus"
                      maxLength={20}
                      className="flex-1 bg-[#073630] border border-[#17675C] focus:border-[#FFD15C] rounded-xl px-3.5 py-2.5 text-sm text-[#FFFDF7] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Game Selection */}
                <div>
                  <label className="text-xs font-bold text-[#BBD9D2] block mb-1.5">
                    Escolha o Jogo Multiplayer:
                  </label>
                  <div className="space-y-2">
                    <div
                      onClick={() => setSelectedGameId('conhece')}
                      className="p-3 rounded-2xl bg-[#073630] border-2 border-[#FFD15C] flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Heart className="w-5 h-5 fill-[#FFD15C] text-[#FFD15C]" />
                        <div>
                          <span className="font-bold text-sm text-[#FFFDF7] block">
                            Quanto Você Me Conhece?
                          </span>
                          <span className="text-[11px] text-[#BBD9D2]">
                            6 rodadas com escolhas em segredo e revelação mútua
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#104B43] text-[#FFD15C]">
                        Pronto
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#073630]/60 border border-[#17675C]/60 flex items-center justify-between opacity-60 cursor-not-allowed">
                      <div className="flex items-center gap-2.5">
                        <Gamepad2 className="w-5 h-5 text-[#BBD9D2]" />
                        <div>
                          <span className="font-bold text-sm text-[#FFFDF7] block">
                            Duelo de Casais
                          </span>
                          <span className="text-[11px] text-[#BBD9D2]">
                            Minijogos de reflexos e memória online
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#063F39] text-[#BBD9D2]">
                        Em breve
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCreateRoom}
                  disabled={isLoading}
                  className="w-full py-3.5 bg-[#FFD15C] hover:bg-[#EAB83F] text-[#063F39] font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-[#FFD15C]/20 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Criando sala no Firestore...</span>
                  ) : (
                    <>
                      <span>Criar Sala e Gerar Código</span>
                      <ArrowRight className="w-4 h-4 text-[#063F39]" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* JOIN MODE FORM */}
            {mode === 'join' && (
              <div className="space-y-4 text-left">
                <div>
                  <label className="text-xs font-bold text-[#BBD9D2] block mb-1.5">
                    Seu Nome:
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xl p-2 bg-[#073630] border border-[#17675C] rounded-xl">
                      {playerAvatar}
                    </span>
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Ex: Beatriz"
                      maxLength={20}
                      className="flex-1 bg-[#073630] border border-[#17675C] focus:border-[#FFD15C] rounded-xl px-3.5 py-2.5 text-sm text-[#FFFDF7] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#BBD9D2] block mb-1.5">
                    Código de 6 Dígitos da Sala:
                  </label>
                  <input
                    type="text"
                    value={roomCodeInput}
                    onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                    placeholder="Ex: NOS482"
                    maxLength={8}
                    className="w-full bg-[#073630] border-2 border-[#17675C] focus:border-[#FFD15C] rounded-2xl px-4 py-3 text-center text-2xl font-mono font-extrabold tracking-widest text-[#FFD15C] focus:outline-none placeholder:text-gray-600 placeholder:text-base placeholder:tracking-normal uppercase"
                  />
                  <span className="text-[11px] text-[#BBD9D2] block mt-1 text-center">
                    Peça o código gerado na tela do seu parceiro.
                  </span>
                </div>

                <button
                  onClick={handleJoinRoom}
                  disabled={isLoading}
                  className="w-full py-3.5 bg-[#FFD15C] hover:bg-[#EAB83F] text-[#063F39] font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-[#FFD15C]/20 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Conectando à sala...</span>
                  ) : (
                    <>
                      <span>Entrar na Sala Agora</span>
                      <ArrowRight className="w-4 h-4 text-[#063F39]" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
