/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Zap, Brain, Sparkles, Eye, MessageCircle, Trophy, RefreshCw, Play, CheckCircle2, Coins } from 'lucide-react';
import { CoupleProfile, DuelMinigameId } from '../../types';
import { MINIGAMES_LIST, GUESSING_CARDS, MEMORY_ICONS, SEQUENCE_SYMBOLS } from '../../data/minigames';
import { evaluateDuelScore } from '../../utils/gameLogic';
import { sound } from '../../utils/audio';

interface DueloGameProps {
  profile: CoupleProfile;
  onBackToHub: () => void;
  onRecordDuelMatch: (winner: 'p1' | 'p2' | 'tie') => void;
}

export const DueloGame: React.FC<DueloGameProps> = ({
  profile,
  onBackToHub,
  onRecordDuelMatch,
}) => {
  const [selectedGameId, setSelectedGameId] = useState<DuelMinigameId | null>(null);
  const [gameState, setGameState] = useState<'SELECT' | 'INSTRUCTIONS' | 'PLAYING' | 'SUMMARY'>('SELECT');
  const [scoreP1, setScoreP1] = useState<number>(0);
  const [scoreP2, setScoreP2] = useState<number>(0);

  const activeMinigame = MINIGAMES_LIST.find((m) => m.id === selectedGameId) || MINIGAMES_LIST[0];

  const handleSelectGame = (id: DuelMinigameId) => {
    sound.playClick();
    setSelectedGameId(id);
    setScoreP1(0);
    setScoreP2(0);
    setGameState('INSTRUCTIONS');
  };

  const handleStartMinigame = () => {
    sound.playSuccess();
    setGameState('PLAYING');
  };

  const handleFinishMinigame = (finalP1: number, finalP2: number) => {
    setScoreP1(finalP1);
    setScoreP2(finalP2);
    setGameState('SUMMARY');

    const winner = finalP1 > finalP2 ? 'p1' : finalP2 > finalP1 ? 'p2' : 'tie';
    if (winner === 'tie') {
      sound.playChime();
    } else {
      sound.playFanfare();
    }
    onRecordDuelMatch(winner);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => {
            sound.playClick();
            if (gameState === 'SELECT') {
              onBackToHub();
            } else {
              setGameState('SELECT');
            }
          }}
          className="flex items-center gap-2 text-sm text-[#BBD9D2] hover:text-[#FFFDF7] px-3.5 py-1.5 rounded-xl bg-[#082F2B] border border-[#17675C] hover:bg-[#104B43] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{gameState === 'SELECT' ? 'Voltar ao Hub' : 'Outros Minijogos'}</span>
        </button>

        {gameState === 'PLAYING' && (
          <div className="flex items-center gap-3 text-xs font-semibold px-3.5 py-1.5 bg-[#082F2B] border border-[#17675C] rounded-xl">
            <span className="text-[#FFD15C] font-bold">{profile.partner1Name}: {scoreP1}</span>
            <span className="text-[#17675C]">vs</span>
            <span className="text-[#F16D7A] font-bold">{profile.partner2Name}: {scoreP2}</span>
          </div>
        )}
      </div>

      {/* STATE 1: Minigame Selector */}
      {gameState === 'SELECT' && (
        <div className="space-y-6">
          <div className="text-center max-w-md mx-auto">
            <span className="text-xs uppercase tracking-wider text-[#FFD15C] font-bold block mb-1">
              Competição Romântica
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#FFFDF7] mb-2">
              Duelo de Casais
            </h2>
            <p className="text-sm text-[#BBD9D2]">
              5 minijogos dinâmicos para duas pessoas no mesmo celular. Testem agilidade, memória e sintonia!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MINIGAMES_LIST.map((game) => {
              const iconsMap: Record<string, React.ReactNode> = {
                Zap: <Zap className="w-6 h-6 text-[#FFD15C]" />,
                Brain: <Brain className="w-6 h-6 text-[#F16D7A]" />,
                Sparkles: <Sparkles className="w-6 h-6 text-[#FFD15C]" />,
                Eye: <Eye className="w-6 h-6 text-[#BBD9D2]" />,
                MessageCircle: <MessageCircle className="w-6 h-6 text-[#FFD15C]" />,
              };
              return (
                <button
                  key={game.id}
                  onClick={() => handleSelectGame(game.id)}
                  className="bg-[#082F2B] hover:bg-[#0E453E] border border-[#17675C] hover:border-[#FFD15C] rounded-3xl p-5 text-left transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer group flex flex-col justify-between shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="p-3 rounded-2xl bg-[#073630] border border-[#17675C] group-hover:scale-105 transition-transform">
                      {iconsMap[game.iconName]}
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#104B43] text-[#FFD15C] border border-[#17675C]">
                      2 Jogadores
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#FFFDF7] group-hover:text-[#FFD15C] transition-colors mb-1">
                      {game.title}
                    </h3>
                    <p className="text-xs text-[#BBD9D2] line-clamp-2">
                      {game.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STATE 2: Instructions Modal/Card */}
      {gameState === 'INSTRUCTIONS' && (
        <div className="bg-[#082F2B] border border-[#17675C] rounded-3xl p-6 sm:p-8 text-center shadow-2xl">
          <span className="text-xs font-bold text-[#FFD15C] uppercase tracking-wider block mb-1">
            Instruções do Duelo
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#FFFDF7] mb-3">
            {activeMinigame.title}
          </h2>
          <p className="text-sm text-[#BBD9D2] max-w-md mx-auto mb-6 leading-relaxed">
            {activeMinigame.description}
          </p>

          <div className="bg-[#073630] border border-[#17675C] rounded-2xl p-4 max-w-sm mx-auto mb-8 text-left space-y-2">
            <div className="flex items-center justify-between text-xs text-[#FFFDF7]">
              <span className="font-semibold text-[#FFD15C]">Jogador 1:</span>
              <span>{profile.partner1Avatar} {profile.partner1Name}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#FFFDF7]">
              <span className="font-semibold text-[#F16D7A]">Jogador 2:</span>
              <span>{profile.partner2Avatar} {profile.partner2Name}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#BBD9D2] pt-2 border-t border-[#17675C]">
              <span>Prêmio da vitória:</span>
              <span className="text-[#FFD15C] font-bold">+15 Moedas 🪙</span>
            </div>
          </div>

          <button
            onClick={handleStartMinigame}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#FFD15C] hover:bg-[#EAB83F] text-[#063F39] font-extrabold text-base rounded-2xl shadow-lg shadow-[#FFD15C]/20 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-[#063F39]" />
            <span>Começar Desafio</span>
          </button>
        </div>
      )}

      {/* STATE 3: Active Playable Minigames */}
      {gameState === 'PLAYING' && selectedGameId === 'reflexos' && (
        <ReflexosMinigame
          profile={profile}
          onFinish={(p1, p2) => handleFinishMinigame(p1, p2)}
        />
      )}

      {gameState === 'PLAYING' && selectedGameId === 'memoria' && (
        <MemoriaMinigame
          profile={profile}
          onFinish={(p1, p2) => handleFinishMinigame(p1, p2)}
        />
      )}

      {gameState === 'PLAYING' && selectedGameId === 'sequencia' && (
        <SequenciaMinigame
          profile={profile}
          onFinish={(p1, p2) => handleFinishMinigame(p1, p2)}
        />
      )}

      {gameState === 'PLAYING' && selectedGameId === 'observacao' && (
        <ObservacaoMinigame
          profile={profile}
          onFinish={(p1, p2) => handleFinishMinigame(p1, p2)}
        />
      )}

      {gameState === 'PLAYING' && selectedGameId === 'adivinhacao' && (
        <AdivinhacaoMinigame
          profile={profile}
          onFinish={(p1, p2) => handleFinishMinigame(p1, p2)}
        />
      )}

      {/* STATE 4: Summary / Victory Screen */}
      {gameState === 'SUMMARY' && (
        <div className="bg-[#082F2B] border border-[#17675C] rounded-3xl p-6 sm:p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#104B43] border border-[#FFD15C] mx-auto flex items-center justify-center text-[#FFD15C] mb-4 shadow-lg">
            <Trophy className="w-8 h-8" />
          </div>

          {(() => {
            const result = evaluateDuelScore(profile.partner1Name, profile.partner2Name, scoreP1, scoreP2);
            return (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#FFFDF7] mb-2">
                  {result.title}
                </h2>
                <p className="text-sm text-[#BBD9D2] max-w-md mx-auto mb-6">
                  {result.message}
                </p>

                {/* Placar final */}
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
                  <div
                    className={`p-4 rounded-2xl border ${
                      result.winner === 'p1'
                        ? 'bg-[#104B43] border-[#FFD15C] text-[#FFD15C]'
                        : 'bg-[#073630] border-[#17675C] text-[#BBD9D2]'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{profile.partner1Avatar}</span>
                    <span className="text-xs font-bold block mb-1">{profile.partner1Name}</span>
                    <span className="text-3xl font-extrabold font-display tabular-nums">
                      {scoreP1}
                    </span>
                  </div>

                  <div
                    className={`p-4 rounded-2xl border ${
                      result.winner === 'p2'
                        ? 'bg-[#104B43] border-[#FFD15C] text-[#FFD15C]'
                        : 'bg-[#073630] border-[#17675C] text-[#BBD9D2]'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{profile.partner2Avatar}</span>
                    <span className="text-xs font-bold block mb-1">{profile.partner2Name}</span>
                    <span className="text-3xl font-extrabold font-display tabular-nums">
                      {scoreP2}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setScoreP1(0);
                      setScoreP2(0);
                      setGameState('PLAYING');
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-[#FFD15C] hover:bg-[#EAB83F] text-[#063F39] font-bold text-sm rounded-xl shadow-lg shadow-[#FFD15C]/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4 text-[#063F39]" />
                    <span>Jogar Novamente</span>
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setGameState('SELECT');
                    }}
                    className="w-full sm:w-auto px-5 py-3 bg-[#104B43] hover:bg-[#17675C] border border-[#17675C] text-[#BBD9D2] hover:text-[#FFFDF7] text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Outros Minijogos
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

/* =========================================================================
 * MINIJOGO 1: TESTE DE REFLEXOS
 * ========================================================================= */
const ReflexosMinigame: React.FC<{
  profile: CoupleProfile;
  onFinish: (p1: number, p2: number) => void;
}> = ({ profile, onFinish }) => {
  const [round, setRound] = useState<number>(1);
  const [state, setState] = useState<'WAIT' | 'READY' | 'FALSE_START' | 'ROUND_OVER'>('WAIT');
  const [winnerThisRound, setWinnerThisRound] = useState<'p1' | 'p2' | null>(null);
  const [p1Points, setP1Points] = useState<number>(0);
  const [p2Points, setP2Points] = useState<number>(0);
  const [reactionMs, setReactionMs] = useState<number>(0);

  const readyTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startRound = () => {
    setState('WAIT');
    setWinnerThisRound(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const delay = Math.random() * 2400 + 1800;
    timeoutRef.current = setTimeout(() => {
      readyTimeRef.current = performance.now();
      setState('READY');
      sound.playChime();
    }, delay);
  };

  useEffect(() => {
    startRound();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [round]);

  const handlePlayerTap = (player: 'p1' | 'p2') => {
    if (state === 'WAIT') {
      sound.playBuzzer();
      setState('FALSE_START');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      const other = player === 'p1' ? 'p2' : 'p1';
      setWinnerThisRound(other);
      if (other === 'p1') setP1Points((p) => p + 1);
      else setP2Points((p) => p + 1);
      return;
    }

    if (state === 'READY') {
      const now = performance.now();
      const elapsed = Math.round(now - readyTimeRef.current);
      setReactionMs(elapsed);
      sound.playSuccess();
      setWinnerThisRound(player);
      setState('ROUND_OVER');

      if (player === 'p1') setP1Points((p) => p + 1);
      else setP2Points((p) => p + 1);
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (round >= 3) {
      onFinish(p1Points, p2Points);
    } else {
      setRound((r) => r + 1);
    }
  };

  return (
    <div className="bg-[#082F2B] border border-[#17675C] rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col justify-between min-h-[460px]">
      {/* Top half: Player 2 */}
      <button
        onClick={() => handlePlayerTap('p2')}
        disabled={state === 'ROUND_OVER' || state === 'FALSE_START'}
        className="w-full h-36 sm:h-40 rounded-2xl bg-[#073630] border-2 border-[#17675C] hover:border-[#F16D7A] active:bg-[#104B43] flex flex-col items-center justify-center cursor-pointer transition-all active:scale-[0.98]"
        aria-label={`Área de toque de ${profile.partner2Name}`}
      >
        <span className="text-xs uppercase tracking-wider text-[#F16D7A] font-bold mb-1">
          {profile.partner2Avatar} {profile.partner2Name}
        </span>
        <span className="text-xl sm:text-2xl font-bold text-[#FFFDF7]">Toque Aqui</span>
        <span className="text-xs text-[#BBD9D2] mt-1">Pontos: {p2Points}</span>
      </button>

      {/* Middle status banner */}
      <div className="py-4 text-center my-2">
        {state === 'WAIT' && (
          <div className="animate-pulse">
            <span className="text-xs text-[#FFD15C] uppercase tracking-widest font-bold block mb-1">
              Aguardem o sinal...
            </span>
            <span className="text-sm text-[#BBD9D2]">
              Não toquem antes da tela brilhar!
            </span>
          </div>
        )}

        {state === 'READY' && (
          <div className="animate-bounce">
            <span className="text-3xl font-extrabold text-[#FFD15C] block mb-1">
              ⚡ TOQUE AGORA! ⚡
            </span>
            <span className="text-xs text-[#FFFDF7]">Mais rápido!</span>
          </div>
        )}

        {state === 'FALSE_START' && (
          <div className="text-center">
            <span className="text-base font-bold text-[#F16D7A] block mb-1">
              Queimou a largada! 😅
            </span>
            <span className="text-xs text-[#BBD9D2]">
              Ponto para quem esperou pacientemente.
            </span>
          </div>
        )}

        {state === 'ROUND_OVER' && (
          <div className="text-center">
            <span className="text-base font-bold text-[#FFD15C] block mb-1">
              {winnerThisRound === 'p1' ? profile.partner1Name : profile.partner2Name} foi mais rápido(a)!
            </span>
            <span className="text-xs text-[#BBD9D2]">
              Tempo de reação: <strong className="text-[#FFFDF7] tabular-nums">{reactionMs}ms</strong>
            </span>
          </div>
        )}

        {(state === 'ROUND_OVER' || state === 'FALSE_START') && (
          <div className="mt-3">
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-[#FFD15C] hover:bg-[#EAB83F] text-[#063F39] font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              {round >= 3 ? 'Ver Resultado Final' : `Próxima Rodada (${round + 1}/3)`}
            </button>
          </div>
        )}
      </div>

      {/* Bottom half: Player 1 */}
      <button
        onClick={() => handlePlayerTap('p1')}
        disabled={state === 'ROUND_OVER' || state === 'FALSE_START'}
        className="w-full h-36 sm:h-40 rounded-2xl bg-[#073630] border-2 border-[#17675C] hover:border-[#FFD15C] active:bg-[#104B43] flex flex-col items-center justify-center cursor-pointer transition-all active:scale-[0.98]"
        aria-label={`Área de toque de ${profile.partner1Name}`}
      >
        <span className="text-xs uppercase tracking-wider text-[#FFD15C] font-bold mb-1">
          {profile.partner1Avatar} {profile.partner1Name}
        </span>
        <span className="text-xl sm:text-2xl font-bold text-[#FFFDF7]">Toque Aqui</span>
        <span className="text-xs text-[#BBD9D2] mt-1">Pontos: {p1Points}</span>
      </button>
    </div>
  );
};

/* =========================================================================
 * MINIJOGO 2: DESAFIO DE MEMÓRIA
 * ========================================================================= */
interface MemoryCard {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoriaMinigame: React.FC<{
  profile: CoupleProfile;
  onFinish: (p1: number, p2: number) => void;
}> = ({ profile, onFinish }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [currentTurn, setCurrentTurn] = useState<1 | 2>(1);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [p1Pairs, setP1Pairs] = useState<number>(0);
  const [p2Pairs, setP2Pairs] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  useEffect(() => {
    const selectedIcons = MEMORY_ICONS.slice(0, 6);
    const deck = [...selectedIcons, ...selectedIcons].map((icon, idx) => ({
      id: idx,
      icon,
      isFlipped: false,
      isMatched: false,
    }));
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    setCards(deck);
  }, []);

  const handleCardClick = (index: number) => {
    if (isLocked) return;
    if (cards[index].isMatched || cards[index].isFlipped) return;
    if (flippedIndices.length >= 2) return;

    sound.playClick();
    const updatedCards = [...cards];
    updatedCards[index].isFlipped = true;
    setCards(updatedCards);

    const nextFlipped = [...flippedIndices, index];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      const [idx1, idx2] = nextFlipped;
      if (cards[idx1].icon === cards[idx2].icon) {
        sound.playSuccess();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) => (i === idx1 || i === idx2 ? { ...c, isMatched: true } : c))
          );
          setFlippedIndices([]);
          if (currentTurn === 1) setP1Pairs((p) => p + 1);
          else setP2Pairs((p) => p + 1);

          const remaining = cards.filter((c, i) => !c.isMatched && i !== idx1 && i !== idx2);
          if (remaining.length === 0) {
            const finalP1 = currentTurn === 1 ? p1Pairs + 1 : p1Pairs;
            const finalP2 = currentTurn === 2 ? p2Pairs + 1 : p2Pairs;
            setTimeout(() => onFinish(finalP1, finalP2), 700);
          }
        }, 500);
      } else {
        setIsLocked(true);
        setTimeout(() => {
          sound.playBuzzer();
          setCards((prev) =>
            prev.map((c, i) => (i === idx1 || i === idx2 ? { ...c, isFlipped: false } : c))
          );
          setFlippedIndices([]);
          setIsLocked(false);
          setCurrentTurn((t) => (t === 1 ? 2 : 1));
        }, 900);
      }
    }
  };

  return (
    <div className="bg-[#082F2B] border border-[#17675C] rounded-3xl p-4 sm:p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <span
          className={`px-3 py-1 rounded-xl text-xs font-bold border ${
            currentTurn === 1
              ? 'bg-[#104B43] text-[#FFD15C] border-[#FFD15C]'
              : 'bg-[#104B43] text-[#F16D7A] border-[#F16D7A]'
          }`}
        >
          Vez de: {currentTurn === 1 ? profile.partner1Name : profile.partner2Name}
        </span>
        <div className="text-xs text-[#BBD9D2] font-semibold space-x-3">
          <span>{profile.partner1Name}: <strong className="text-[#FFD15C]">{p1Pairs}</strong></span>
          <span>{profile.partner2Name}: <strong className="text-[#F16D7A]">{p2Pairs}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 my-4">
        {cards.map((card, idx) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(idx)}
            disabled={card.isMatched || card.isFlipped || isLocked}
            className={`aspect-square rounded-2xl flex items-center justify-center text-3xl font-bold transition-all transform duration-300 cursor-pointer ${
              card.isMatched
                ? 'bg-[#104B43] border border-[#17675C] opacity-50 scale-95'
                : card.isFlipped
                ? 'bg-[#104B43] border-2 border-[#FFD15C] shadow-lg'
                : 'bg-[#073630] border border-[#17675C] hover:border-[#FFD15C] hover:scale-[1.02] active:scale-[0.98]'
            }`}
            aria-label={`Carta ${idx + 1}`}
          >
            {card.isFlipped || card.isMatched ? (
              card.icon
            ) : (
              <span className="text-[#17675C] text-lg">💚</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
 * MINIJOGO 3: SEQUÊNCIAS DE SÍMBOLOS
 * ========================================================================= */
const SequenciaMinigame: React.FC<{
  profile: CoupleProfile;
  onFinish: (p1: number, p2: number) => void;
}> = ({ profile, onFinish }) => {
  const [currentTurn, setCurrentTurn] = useState<1 | 2>(1);
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState<string[]>([]);
  const [isPlayingSeq, setIsPlayingSeq] = useState<boolean>(false);
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const [p1Score, setP1Score] = useState<number>(0);
  const [p2Score, setP2Score] = useState<number>(0);

  const symbols = SEQUENCE_SYMBOLS;

  const playSequence = (seq: string[]) => {
    setIsPlayingSeq(true);
    setPlayerInput([]);

    seq.forEach((symId, index) => {
      setTimeout(() => {
        const item = symbols.find((s) => s.id === symId);
        if (item) {
          sound.playNote(item.freq, 0.2);
          setActiveHighlight(symId);
        }
      }, index * 600 + 400);

      setTimeout(() => {
        setActiveHighlight(null);
        if (index === seq.length - 1) {
          setIsPlayingSeq(false);
        }
      }, index * 600 + 750);
    });
  };

  const startPlayerRound = (newTurn: 1 | 2) => {
    setCurrentTurn(newTurn);
    const ids = symbols.map((s) => s.id);
    const newSeq = [
      ids[Math.floor(Math.random() * ids.length)],
      ids[Math.floor(Math.random() * ids.length)],
      ids[Math.floor(Math.random() * ids.length)],
    ];
    setSequence(newSeq);
    playSequence(newSeq);
  };

  useEffect(() => {
    startPlayerRound(1);
  }, []);

  const handleSymbolClick = (symId: string) => {
    if (isPlayingSeq) return;

    const sym = symbols.find((s) => s.id === symId);
    if (sym) sound.playNote(sym.freq, 0.15);

    const nextInput = [...playerInput, symId];
    setPlayerInput(nextInput);

    const stepIndex = nextInput.length - 1;
    if (nextInput[stepIndex] !== sequence[stepIndex]) {
      sound.playBuzzer();
      if (currentTurn === 1) {
        setTimeout(() => startPlayerRound(2), 1200);
      } else {
        setTimeout(() => onFinish(p1Score, p2Score), 1000);
      }
      return;
    }

    if (nextInput.length === sequence.length) {
      sound.playSuccess();
      if (currentTurn === 1) setP1Score((s) => s + 1);
      else setP2Score((s) => s + 1);

      setTimeout(() => {
        const ids = symbols.map((s) => s.id);
        const nextSeq = [...sequence, ids[Math.floor(Math.random() * ids.length)]];
        setSequence(nextSeq);
        playSequence(nextSeq);
      }, 800);
    }
  };

  const activeName = currentTurn === 1 ? profile.partner1Name : profile.partner2Name;

  return (
    <div className="bg-[#082F2B] border border-[#17675C] rounded-3xl p-6 shadow-2xl text-center">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold px-3 py-1 bg-[#104B43] text-[#FFD15C] rounded-xl border border-[#17675C]">
          Vez de {activeName}
        </span>
        <div className="text-xs font-semibold text-[#BBD9D2] space-x-3">
          <span>{profile.partner1Name}: <strong className="text-[#FFD15C]">{p1Score}</strong></span>
          <span>{profile.partner2Name}: <strong className="text-[#F16D7A]">{p2Score}</strong></span>
        </div>
      </div>

      <p className="text-sm text-[#BBD9D2] mb-6">
        {isPlayingSeq
          ? 'Memorize a sequência que está piscando...'
          : `Sua vez, ${activeName}! Toque na ordem correta (${playerInput.length}/${sequence.length})`}
      </p>

      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-6">
        {symbols.map((sym) => {
          const isHighlighted = activeHighlight === sym.id;
          return (
            <button
              key={sym.id}
              onClick={() => handleSymbolClick(sym.id)}
              disabled={isPlayingSeq}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-4 transition-all duration-150 cursor-pointer ${
                isHighlighted
                  ? 'bg-[#FFD15C] text-[#063F39] scale-105 shadow-xl ring-4 ring-[#FFFDF7]'
                  : 'bg-[#073630] border border-[#17675C] hover:border-[#FFD15C] active:scale-95'
              }`}
              aria-label={sym.label}
            >
              <span className="text-4xl mb-1">{sym.symbol}</span>
              <span className={`text-xs font-bold ${isHighlighted ? 'text-[#063F39]' : 'text-[#BBD9D2]'}`}>{sym.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* =========================================================================
 * MINIJOGO 4: DESAFIO DE OBSERVAÇÃO
 * ========================================================================= */
const ObservacaoMinigame: React.FC<{
  profile: CoupleProfile;
  onFinish: (p1: number, p2: number) => void;
}> = ({ profile, onFinish }) => {
  const [round, setRound] = useState<number>(1);
  const [currentTurn, setCurrentTurn] = useState<1 | 2>(1);
  const [p1Score, setP1Score] = useState<number>(0);
  const [p2Score, setP2Score] = useState<number>(0);
  const [oddIndex, setOddIndex] = useState<number>(0);
  const [gridItems, setGridItems] = useState<string[]>([]);

  const roundsData = [
    { base: '💖', odd: '💗' },
    { base: '🌹', odd: '🌺' },
    { base: '🥂', odd: '🍷' },
    { base: '💍', odd: '💎' },
  ];

  const currentPair = roundsData[(round - 1) % roundsData.length];

  const setupRound = () => {
    const totalCells = 16;
    const oddPos = Math.floor(Math.random() * totalCells);
    setOddIndex(oddPos);
    const cells = Array.from({ length: totalCells }, (_, i) =>
      i === oddPos ? currentPair.odd : currentPair.base
    );
    setGridItems(cells);
  };

  useEffect(() => {
    setupRound();
  }, [round, currentTurn]);

  const handleCellClick = (idx: number) => {
    if (idx === oddIndex) {
      sound.playSuccess();
      if (currentTurn === 1) {
        setP1Score((s) => s + 1);
        setCurrentTurn(2);
      } else {
        setP2Score((s) => s + 1);
        if (round >= 2) {
          onFinish(p1Score, p2Score + 1);
          return;
        } else {
          setRound((r) => r + 1);
          setCurrentTurn(1);
        }
      }
    } else {
      sound.playBuzzer();
    }
  };

  const activeName = currentTurn === 1 ? profile.partner1Name : profile.partner2Name;

  return (
    <div className="bg-[#082F2B] border border-[#17675C] rounded-3xl p-6 shadow-2xl text-center">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold px-3 py-1 bg-[#104B43] text-[#FFD15C] rounded-xl border border-[#17675C]">
          Vez de: {activeName}
        </span>
        <div className="text-xs font-semibold text-[#BBD9D2] space-x-3">
          <span>{profile.partner1Name}: <strong className="text-[#FFD15C]">{p1Score}</strong></span>
          <span>{profile.partner2Name}: <strong className="text-[#F16D7A]">{p2Score}</strong></span>
        </div>
      </div>

      <h3 className="text-lg font-bold text-[#FFFDF7] mb-1">
        Encontre o símbolo intruso!
      </h3>
      <p className="text-xs text-[#BBD9D2] mb-6">
        Apenas um é diferente. Toque nele o mais rápido possível!
      </p>

      <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto mb-6">
        {gridItems.map((symbol, idx) => (
          <button
            key={idx}
            onClick={() => handleCellClick(idx)}
            className="aspect-square rounded-2xl bg-[#073630] hover:bg-[#104B43] border border-[#17675C] hover:border-[#FFD15C] flex items-center justify-center text-3xl cursor-pointer active:scale-95 transition-all"
            aria-label={`Símbolo ${idx + 1}`}
          >
            {symbol}
          </button>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
 * MINIJOGO 5: ADIVINHAÇÃO A DOIS
 * ========================================================================= */
const AdivinhacaoMinigame: React.FC<{
  profile: CoupleProfile;
  onFinish: (p1: number, p2: number) => void;
}> = ({ profile, onFinish }) => {
  const [currentDescriber, setCurrentDescriber] = useState<1 | 2>(1);
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [p1Points, setP1Points] = useState<number>(0);
  const [p2Points, setP2Points] = useState<number>(0);

  const card = GUESSING_CARDS[cardIndex % GUESSING_CARDS.length];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      sound.playBuzzer();
      if (currentDescriber === 1) {
        setCurrentDescriber(2);
        setCardIndex((c) => c + 1);
        setTimeLeft(45);
      } else {
        onFinish(p1Points, p2Points);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, currentDescriber]);

  const handleCorrect = () => {
    sound.playSuccess();
    if (currentDescriber === 1) setP1Points((p) => p + 1);
    else setP2Points((p) => p + 1);
    setCardIndex((c) => c + 1);
  };

  const handleSkip = () => {
    sound.playClick();
    setCardIndex((c) => c + 1);
  };

  const describerName = currentDescriber === 1 ? profile.partner1Name : profile.partner2Name;
  const guesserName = currentDescriber === 1 ? profile.partner2Name : profile.partner1Name;

  return (
    <div className="bg-[#082F2B] border border-[#17675C] rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold px-3 py-1 bg-[#104B43] text-[#FFD15C] rounded-xl border border-[#17675C]">
          {describerName} descreve para {guesserName}
        </span>
        <div className="text-xs font-semibold text-[#BBD9D2] space-x-3">
          <span>{profile.partner1Name}: <strong className="text-[#FFD15C]">{p1Points}</strong></span>
          <span>{profile.partner2Name}: <strong className="text-[#F16D7A]">{p2Points}</strong></span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="text-2xl font-bold font-display text-[#FFFDF7] tabular-nums">
          ⏱️ {timeLeft}s
        </span>
      </div>

      {!isTimerRunning && timeLeft === 45 && (
        <div className="my-8">
          <p className="text-sm text-[#BBD9D2] mb-6">
            Apenas <strong>{describerName}</strong> deve olhar para a tela! Explique a palavra sem falar as palavras proibidas.
          </p>
          <button
            onClick={() => {
              sound.playSuccess();
              setIsTimerRunning(true);
            }}
            className="px-8 py-3.5 bg-[#FFD15C] hover:bg-[#EAB83F] text-[#063F39] font-extrabold text-base rounded-2xl shadow-lg cursor-pointer"
          >
            Iniciar Cronômetro (45s)
          </button>
        </div>
      )}

      {isTimerRunning && (
        <div className="space-y-6">
          <div className="bg-[#073630] border border-[#17675C] rounded-2xl p-6 shadow-inner">
            <span className="text-xs text-[#FFD15C] uppercase tracking-widest font-bold block mb-2">
              Palavra Secreta
            </span>
            <h4 className="text-2xl sm:text-3xl font-extrabold text-[#FFFDF7] tracking-wide mb-6">
              {card.word}
            </h4>

            <div className="pt-4 border-t border-[#17675C]">
              <span className="text-xs text-[#F16D7A] font-bold block mb-2">
                🚫 Palavras Proibidas:
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {card.taboo.map((w, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-[#082F2B] border border-[#F16D7A]/50 text-[#FFFDF7] text-xs font-semibold"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleSkip}
              className="px-5 py-3 rounded-xl bg-[#104B43] border border-[#17675C] text-[#BBD9D2] hover:text-[#FFFDF7] text-sm font-semibold cursor-pointer"
            >
              Pular Palavra
            </button>
            <button
              onClick={handleCorrect}
              className="px-7 py-3 rounded-xl bg-[#FFD15C] hover:bg-[#EAB83F] text-[#063F39] text-sm font-bold shadow-md cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-[#063F39]" />
              <span>Acertou! (+1)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
