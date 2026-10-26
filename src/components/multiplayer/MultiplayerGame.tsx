/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import {
  Heart,
  Sparkles,
  Trophy,
  CheckCircle2,
  XCircle,
  MessageCircle,
  ArrowRight,
  LogOut,
  RotateCcw,
  Wifi,
  Hourglass,
  Clock,
} from 'lucide-react';
import { RoomData, Question } from '../../types';
import { QUESTIONS_DATA } from '../../data/questions';
import { pickNonRepeating } from '../../utils/gameLogic';
import {
  submitSecretAnswer,
  submitGuess,
  advanceMultiplayerRound,
  restartMultiplayerMatch,
} from '../../services/roomService';
import { sound } from '../../utils/audio';

interface MultiplayerGameProps {
  room: RoomData;
  currentUserUid: string;
  onLeaveRoom: () => void;
  onRecordCoins: (coinsWon: number) => void;
}

export const MultiplayerGame: React.FC<MultiplayerGameProps> = ({
  room,
  currentUserUid,
  onLeaveRoom,
  onRecordCoins,
}) => {
  const isHost = currentUserUid === room.hostUid;
  const myName = isHost ? room.hostName : (room.guestName || 'Você');
  const myAvatar = isHost ? room.hostAvatar : (room.guestAvatar || '💕');
  const partnerName = isHost ? (room.guestName || 'Parceiro') : room.hostName;
  const partnerAvatar = isHost ? (room.guestAvatar || '💕') : room.hostAvatar;

  // Determine role for current round
  const isMyTurnToRespond =
    (room.turn === 'host' && isHost) || (room.turn === 'guest' && !isHost);
  const isMyTurnToGuess =
    (room.turn === 'host' && !isHost) || (room.turn === 'guest' && isHost);

  const respondentName = room.turn === 'host' ? room.hostName : (room.guestName || 'Parceiro');
  const guesserName = room.turn === 'host' ? (room.guestName || 'Parceiro') : room.hostName;

  // Parse question options safely
  let options: { id: string; text: string }[] = [];
  try {
    options = JSON.parse(room.currentQuestionOptions || '[]');
  } catch {
    options = [];
  }

  const isCorrect = room.guessedAnswerId === room.secretAnswerId;
  const secretOption = options.find((o) => o.id === room.secretAnswerId);
  const guessedOption = options.find((o) => o.id === room.guessedAnswerId);

  // Sound cues on reveal or round change
  useEffect(() => {
    if (room.step === 'REVEAL') {
      if (isCorrect) {
        sound.playSuccess();
        onRecordCoins(10);
      } else {
        sound.playBuzzer();
      }
    } else if (room.step === 'SUMMARY') {
      sound.playFanfare();
    }
  }, [room.step, room.currentRound]);

  const handleRespondentSubmit = async (optId: string) => {
    sound.playClick();
    try {
      await submitSecretAnswer(room.id, optId);
    } catch (err) {
      console.error('[Error submitting secret answer]', err);
    }
  };

  const handleGuesserSubmit = async (optId: string) => {
    const correct = optId === room.secretAnswerId;
    try {
      await submitGuess(
        room.id,
        optId,
        correct,
        isHost ? 'host' : 'guest',
        { host: room.scoreHost, guest: room.scoreGuest }
      );
    } catch (err) {
      console.error('[Error submitting guess]', err);
    }
  };

  const handleNextRound = async () => {
    sound.playClick();
    const nextRound = room.currentRound + 1;
    const isFinished = nextRound > room.totalRounds;

    if (isFinished) {
      await advanceMultiplayerRound(room.id, nextRound, 'host', null, true);
    } else {
      const nextTurn = room.turn === 'host' ? 'guest' : 'host';
      const { item: nextQ } = pickNonRepeating(QUESTIONS_DATA, [room.currentQuestionId]);
      await advanceMultiplayerRound(room.id, nextRound, nextTurn, nextQ, false);
    }
  };

  const handleRestart = async () => {
    sound.playSuccess();
    const { item: firstQ } = pickNonRepeating(QUESTIONS_DATA, []);
    await restartMultiplayerMatch(room.id, firstQ);
  };

  // Compatibility title in summary
  const totalCorrect = room.scoreHost + room.scoreGuest;
  const compatibilityTitle =
    totalCorrect >= 5
      ? 'Almas Gêmeas Conectadas! ✨'
      : totalCorrect >= 3
      ? 'Sintonia Maravilhosa! 💕'
      : 'Muitos Segredos a Descobrir! 💖';

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-3 sm:py-6 pb-24">
      {/* Top Status & Scoreboard Bar */}
      <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
        {/* Room Code & Connection */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="px-2.5 sm:px-3 py-1 bg-[#082F2B] border border-[#17675C] rounded-xl flex items-center gap-1.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono font-bold text-[#FFD15C]">{room.code}</span>
          </div>
          <span className="text-[11px] text-[#BBD9D2] hidden xs:inline">Online</span>
        </div>

        {/* Live Score */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-semibold">
          <div className="px-2.5 sm:px-3 py-1 bg-[#104B43] border border-[#17675C] rounded-xl text-[#FFD15C] font-bold">
            Rodada <span className="tabular-nums">#{room.currentRound}</span>/{room.totalRounds}
          </div>
          <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1 bg-[#082F2B] border border-[#17675C] rounded-xl text-[#FFFDF7]">
            <span>{room.hostAvatar} {room.scoreHost}</span>
            <span className="text-[#17675C]">·</span>
            <span>{room.guestAvatar} {room.scoreGuest}</span>
          </div>
        </div>

        {/* Leave Room Button */}
        <button
          onClick={onLeaveRoom}
          className="p-1.5 sm:p-2 rounded-xl bg-[#082F2B] hover:bg-[#3A1E24] border border-[#17675C] text-[#BBD9D2] hover:text-[#F16D7A] transition-colors cursor-pointer"
          title="Sair da Sala"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* STATE 1: RESPONDING */}
      {room.step === 'RESPONDING' && (
        <div className="bg-[#082F2B] border border-[#17675C] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl">
          {/* Header indicator */}
          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#17675C]">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl p-1.5 bg-[#104B43] border border-[#17675C] rounded-xl">
                {room.turn === 'host' ? room.hostAvatar : room.guestAvatar}
              </span>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#FFD15C] font-bold block">
                  {isMyTurnToRespond ? 'Sua vez de responder em segredo' : `Vez de ${respondentName} responder`}
                </span>
                <span className="text-sm sm:text-base font-bold text-[#FFFDF7]">
                  {respondentName}
                </span>
              </div>
            </div>
            <span className="text-[11px] px-2.5 py-1 bg-[#104B43] border border-[#17675C] rounded-lg text-[#BBD9D2]">
              {room.currentQuestionCategory}
            </span>
          </div>

          {isMyTurnToRespond ? (
            /* User is answering */
            <div>
              <div className="mb-5">
                <h3 className="text-lg sm:text-2xl font-bold font-display text-[#FFFDF7] leading-snug">
                  {room.currentQuestionText}
                </h3>
                <p className="text-xs text-[#BBD9D2] mt-1">
                  Escolha o que mais combina com você. Seu parceiro tentará adivinhar!
                </p>
              </div>

              <div className="space-y-2.5">
                {options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleRespondentSubmit(opt.id)}
                    className="w-full text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#073630] hover:bg-[#104B43] border border-[#17675C] hover:border-[#FFD15C] transition-all cursor-pointer group flex items-start gap-3 active:scale-[0.99]"
                  >
                    <div className="w-5 h-5 rounded-full border-2 border-[#17675C] group-hover:border-[#FFD15C] flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-[#FFD15C] transition-colors" />
                    </div>
                    <span className="text-xs sm:text-sm text-[#FFFDF7] leading-relaxed">
                      {opt.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* User is waiting for partner to answer */
            <div className="py-8 sm:py-12 text-center space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#104B43] border-2 border-[#FFD15C] mx-auto flex items-center justify-center text-3xl shadow-lg animate-pulse">
                {partnerAvatar}
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-bold font-display text-[#FFFDF7] mb-1">
                  Aguardando {respondentName}...
                </h4>
                <p className="text-xs sm:text-sm text-[#BBD9D2] max-w-sm mx-auto leading-relaxed">
                  {respondentName} está escolhendo uma resposta em segredo no celular dele(a). Assim que confirmar, será sua vez de adivinhar!
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#073630] border border-[#17675C] text-[11px] text-[#FFD15C]">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Sincronizando escolhas...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STATE 2: GUESSING */}
      {room.step === 'GUESSING' && (
        <div className="bg-[#082F2B] border border-[#17675C] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#17675C]">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl p-1.5 bg-[#104B43] border border-[#17675C] rounded-xl">
                {room.turn === 'host' ? room.guestAvatar : room.hostAvatar}
              </span>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#FFD15C] font-bold block">
                  {isMyTurnToGuess ? 'Sua vez de adivinhar o palpite' : `Aguardando palpite de ${guesserName}`}
                </span>
                <span className="text-sm sm:text-base font-bold text-[#FFFDF7]">
                  {guesserName}
                </span>
              </div>
            </div>
            <span className="text-[11px] px-2.5 py-1 bg-[#104B43] border border-[#17675C] rounded-lg text-[#BBD9D2]">
              {room.currentQuestionCategory}
            </span>
          </div>

          {isMyTurnToGuess ? (
            /* Guesser picks their guess */
            <div>
              <div className="mb-5">
                <h3 className="text-lg sm:text-2xl font-bold font-display text-[#FFFDF7] leading-snug">
                  {room.currentQuestionText}
                </h3>
                <p className="text-xs text-[#BBD9D2] mt-1">
                  Qual você acha que foi a escolha de <strong className="text-[#FFD15C]">{respondentName}</strong>?
                </p>
              </div>

              <div className="space-y-2.5">
                {options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleGuesserSubmit(opt.id)}
                    className="w-full text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#073630] hover:bg-[#104B43] border border-[#17675C] hover:border-[#FFD15C] transition-all cursor-pointer group flex items-start gap-3 active:scale-[0.99]"
                  >
                    <div className="w-5 h-5 rounded-full border-2 border-[#17675C] group-hover:border-[#FFD15C] flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-[#FFD15C] transition-colors" />
                    </div>
                    <span className="text-xs sm:text-sm text-[#FFFDF7] leading-relaxed">
                      {opt.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Respondent waits for guesser */
            <div className="py-8 sm:py-12 text-center space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#104B43] border-2 border-[#FFD15C] mx-auto flex items-center justify-center text-3xl shadow-lg animate-pulse">
                {partnerAvatar}
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-bold font-display text-[#FFFDF7] mb-1">
                  Sua resposta foi registrada!
                </h4>
                <p className="text-xs sm:text-sm text-[#BBD9D2] max-w-sm mx-auto leading-relaxed">
                  {guesserName} está decidindo o palpite neste exato momento. A revelação acontecerá junta para os dois!
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#073630] border border-[#17675C] text-[11px] text-[#FFD15C]">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Aguardando palpite...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STATE 3: REVEAL */}
      {room.step === 'REVEAL' && (
        <div className="bg-[#082F2B] border border-[#17675C] rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-center shadow-2xl animate-fade-in">
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-3 ${
              isCorrect
                ? 'bg-[#104B43] border border-[#FFD15C] text-[#FFD15C]'
                : 'bg-[#3A1E24] border border-[#F16D7A] text-[#F16D7A]'
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#FFD15C]" />
            ) : (
              <XCircle className="w-8 h-8 sm:w-10 sm:h-10 text-[#F16D7A]" />
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-display text-[#FFFDF7] mb-1">
            {isCorrect ? 'Acertou em Cheio! (+10 🪙)' : 'Passou Perto! 💕'}
          </h3>
          <p className="text-xs sm:text-sm text-[#BBD9D2] mb-5">
            {isCorrect
              ? `${guesserName} acertou em cheio a mente de ${respondentName}!`
              : `${guesserName} tentou, mas ${respondentName} tinha outra preferência no coração.`}
          </p>

          {/* Answer Breakdown */}
          <div className="bg-[#073630] border border-[#17675C] rounded-2xl p-3.5 sm:p-4 text-left mb-5 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded bg-[#104B43] text-[#FFD15C] shrink-0 mt-0.5">
                Escolha de {respondentName}:
              </span>
              <span className="text-xs sm:text-sm text-[#FFFDF7] font-medium">
                {secretOption?.text}
              </span>
            </div>

            <div className="flex items-start gap-2.5 pt-2 border-t border-[#17675C]">
              <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded bg-[#063F39] text-[#BBD9D2] shrink-0 mt-0.5">
                Palpite de {guesserName}:
              </span>
              <span className="text-xs sm:text-sm text-[#BBD9D2]">
                {guessedOption?.text}
              </span>
            </div>
          </div>

          {/* Spark Conversation Prompt */}
          {room.currentChatPrompt && (
            <div className="bg-[#104B43] border border-[#17675C] rounded-2xl p-3.5 sm:p-4 mb-6 text-left">
              <div className="flex items-center gap-1.5 text-[#FFD15C] text-xs font-bold mb-1">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Papo de Casal:</span>
              </div>
              <p className="text-xs sm:text-sm text-[#FFFDF7] font-medium italic">
                "{room.currentChatPrompt}"
              </p>
            </div>
          )}

          {/* Host controls next round */}
          {isHost ? (
            <button
              onClick={handleNextRound}
              className="w-full sm:w-auto px-7 py-3 bg-[#FFD15C] hover:bg-[#EAB83F] text-[#063F39] font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#FFD15C]/20 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <span>{room.currentRound >= room.totalRounds ? 'Ver Resultado Final 🏆' : 'Próxima Rodada'}</span>
              <ArrowRight className="w-4 h-4 text-[#063F39]" />
            </button>
          ) : (
            <div className="text-xs text-[#BBD9D2] py-2">
              <span>Aguardando o anfitrião ({room.hostName}) avançar para a próxima rodada...</span>
            </div>
          )}
        </div>
      )}

      {/* STATE 4: SUMMARY (FINAL RESULTS) */}
      {room.step === 'SUMMARY' && (
        <div className="bg-[#082F2B] border border-[#17675C] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-2xl animate-fade-in">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#104B43] border border-[#FFD15C] mx-auto flex items-center justify-center text-3xl shadow-md mb-4 text-[#FFD15C]">
            <Trophy className="w-9 h-9 sm:w-10 sm:h-10 text-[#FFD15C]" />
          </div>

          <span className="text-[10px] uppercase tracking-wider text-[#FFD15C] font-bold block mb-1">
            Partida Online Concluída!
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#FFFDF7] mb-2">
            {compatibilityTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#BBD9D2] max-w-sm mx-auto mb-6">
            Vocês jogaram sincronizados em celulares diferentes com muita sintonia!
          </p>

          {/* Final scores */}
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-6">
            <div className="bg-[#073630] border border-[#17675C] rounded-2xl p-4 text-center">
              <span className="text-2xl block mb-1">{room.hostAvatar}</span>
              <span className="font-bold text-xs sm:text-sm text-[#FFFDF7] block truncate">{room.hostName}</span>
              <span className="text-2xl font-extrabold text-[#FFD15C] block mt-1">{room.scoreHost}</span>
              <span className="text-[10px] text-[#BBD9D2]">acertos</span>
            </div>
            <div className="bg-[#073630] border border-[#17675C] rounded-2xl p-4 text-center">
              <span className="text-2xl block mb-1">{room.guestAvatar}</span>
              <span className="font-bold text-xs sm:text-sm text-[#FFFDF7] block truncate">{room.guestName}</span>
              <span className="text-2xl font-extrabold text-[#FFD15C] block mt-1">{room.scoreGuest}</span>
              <span className="text-[10px] text-[#BBD9D2]">acertos</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {isHost && (
              <button
                onClick={handleRestart}
                className="w-full sm:w-auto px-6 py-3 bg-[#FFD15C] hover:bg-[#EAB83F] text-[#063F39] font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#FFD15C]/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4 text-[#063F39]" />
                <span>Jogar Novamente</span>
              </button>
            )}
            <button
              onClick={onLeaveRoom}
              className="w-full sm:w-auto px-5 py-3 bg-[#104B43] hover:bg-[#17675C] border border-[#17675C] text-[#BBD9D2] hover:text-[#FFFDF7] text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
