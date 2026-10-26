/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  MessageCircle,
  Heart,
  ArrowRight,
  Shuffle,
  Trophy,
  RotateCcw,
} from 'lucide-react';
import { CoupleProfile, Dilemma } from '../../types';
import { DILEMMAS_DATA } from '../../data/dilemmas';
import { pickNonRepeating, evaluateDilemmaMatch } from '../../utils/gameLogic';
import { sound } from '../../utils/audio';

interface ESeGameProps {
  profile: CoupleProfile;
  onBackToHub: () => void;
  onRecordMatch: (isMatch: boolean) => void;
}

type Step = 'INSTRUCTIONS' | 'P1_CHOICE' | 'HANDOVER' | 'P2_CHOICE' | 'REVEAL' | 'FINAL_RESULTS';

export const ESeGame: React.FC<ESeGameProps> = ({
  profile,
  onBackToHub,
  onRecordMatch,
}) => {
  const [step, setStep] = useState<Step>('INSTRUCTIONS');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [currentDilemma, setCurrentDilemma] = useState<Dilemma>(DILEMMAS_DATA[0]);
  const [p1ChoiceId, setP1ChoiceId] = useState<string>('');
  const [p2ChoiceId, setP2ChoiceId] = useState<string>('');
  const [matchCount, setMatchCount] = useState<number>(0);

  const startNewDilemma = () => {
    const { item, updatedRecentIds } = pickNonRepeating(
      DILEMMAS_DATA,
      recentIds,
      categoryFilter === 'todos' ? undefined : categoryFilter
    );
    setCurrentDilemma(item);
    setRecentIds(updatedRecentIds);
    setP1ChoiceId('');
    setP2ChoiceId('');
    setStep('P1_CHOICE');
  };

  const handleStartGame = () => {
    sound.playSuccess();
    setRoundNumber(1);
    setMatchCount(0);
    startNewDilemma();
  };

  const handleP1Select = (optId: string) => {
    sound.playClick();
    setP1ChoiceId(optId);
    setStep('HANDOVER');
  };

  const handleP2Select = (optId: string) => {
    setP2ChoiceId(optId);
    const isMatch = optId === p1ChoiceId;
    if (isMatch) {
      sound.playSuccess();
      setMatchCount((m) => m + 1);
    } else {
      sound.playChime();
    }
    onRecordMatch(isMatch);
    setStep('REVEAL');
  };

  const handleNextDilemma = () => {
    sound.playClick();
    if (roundNumber >= 5) {
      sound.playFanfare();
      setStep('FINAL_RESULTS');
      return;
    }
    setRoundNumber((r) => r + 1);
    startNewDilemma();
  };

  const handlePlayAgain = () => {
    sound.playSuccess();
    setRoundNumber(1);
    setMatchCount(0);
    startNewDilemma();
  };

  const p1SelectedOption = currentDilemma.options.find((o) => o.id === p1ChoiceId);
  const p2SelectedOption = currentDilemma.options.find((o) => o.id === p2ChoiceId);
  const evaluation = evaluateDilemmaMatch(
    p1ChoiceId,
    p2ChoiceId,
    profile.partner1Name,
    profile.partner2Name
  );

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-24">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <button
          onClick={() => {
            sound.playClick();
            onBackToHub();
          }}
          className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#BBD9D2] hover:text-[#FFFDF7] px-3 py-1.5 rounded-xl bg-[#082F2B] border border-[#17675C] hover:bg-[#104B43] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Voltar ao Hub</span>
        </button>

        {step !== 'INSTRUCTIONS' && step !== 'FINAL_RESULTS' && (
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-semibold">
            <span className="px-2.5 py-1 rounded-xl bg-[#104B43] border border-[#17675C] text-[#FFD15C] font-bold">
              Dilema <span className="tabular-nums">#{roundNumber}</span>/5
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#082F2B] border border-[#17675C] rounded-xl text-[#FFD15C]">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD15C]" />
              <span>{matchCount} sintonias</span>
            </div>
          </div>
        )}
      </div>

      {/* STEP 1: Instructions & Category selector */}
      {step === 'INSTRUCTIONS' && (
        <div className="bg-[#082F2B] border border-[#17675C] rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-center shadow-2xl">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#104B43] border border-[#17675C] mx-auto flex items-center justify-center text-[#FFD15C] shadow-md mb-3 sm:mb-4">
            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 fill-[#FFD15C]" />
          </div>

          <h2 className="text-xl sm:text-3xl font-bold font-display text-[#FFFDF7] mb-1.5">
            E Se Nós Dois...?
          </h2>
          <p className="text-xs sm:text-sm text-[#BBD9D2] max-w-md mx-auto mb-5 sm:mb-6">
            Situações hipotéticas, engraçadas e surpreendentes. Cada um escolhe sua resposta em segredo e depois revelamos a sintonia do casal!
          </p>

          <div className="bg-[#073630] border border-[#17675C] rounded-2xl p-3.5 sm:p-4 max-w-md mx-auto mb-6 text-left space-y-2">
            <div className="flex items-start gap-2 text-xs text-[#BBD9D2]">
              <span className="text-[#FFD15C] font-bold">1.</span>
              <span>Apresentamos um cenário inusitado com alternativas.</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-[#BBD9D2]">
              <span className="text-[#FFD15C] font-bold">2.</span>
              <span>{profile.partner1Name} escolhe primeiro em segredo.</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-[#BBD9D2]">
              <span className="text-[#FFD15C] font-bold">3.</span>
              <span>Passam o celular para {profile.partner2Name} fazer sua escolha.</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-[#BBD9D2]">
              <span className="text-[#FFD15C] font-bold">4.</span>
              <span>Não existem respostas certas ou erradas: o objetivo é rir e conversar!</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6 sm:mb-8">
            <span className="text-xs font-semibold text-[#BBD9D2] block mb-2">
              Escolher Categoria:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              {[
                { id: 'todos', label: 'Todos os Dilemas' },
                { id: 'viagens', label: 'Viagens' },
                { id: 'decisoes', label: 'Decisões & Fortuna' },
                { id: 'rotina', label: 'Rotina' },
                { id: 'encontros', label: 'Encontros' },
                { id: 'engracado', label: 'Engraçados' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    sound.playClick();
                    setCategoryFilter(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    categoryFilter === cat.id
                      ? 'bg-[#FFD15C] text-[#063F39] shadow-md shadow-[#FFD15C]/20 font-bold'
                      : 'bg-[#073630] text-[#BBD9D2] border border-[#17675C] hover:border-[#FFD15C]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full sm:w-auto px-8 py-3 bg-[#FFD15C] hover:bg-[#EAB83F] text-[#063F39] font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-[#FFD15C]/20 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <span>Descobrir Sintonia</span>
            <ArrowRight className="w-4 h-4 text-[#063F39]" />
          </button>
        </div>
      )}

      {/* STEP 2: Player 1 Choice */}
      {step === 'P1_CHOICE' && (
        <div className="bg-[#082F2B] border border-[#17675C] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#17675C]">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl p-1.5 bg-[#104B43] border border-[#17675C] rounded-xl">
                {profile.partner1Avatar}
              </span>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#FFD15C] font-bold block">
                  Sua escolha secreta
                </span>
                <span className="text-sm sm:text-base font-bold text-[#FFFDF7]">
                  {profile.partner1Name}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2.5 py-1 bg-[#104B43] border border-[#17675C] rounded-lg text-[#BBD9D2]">
                {currentDilemma.categoryLabel}
              </span>
            </div>
          </div>

          {/* Dilemma Title & Description */}
          <div className="mb-5">
            <h3 className="text-lg sm:text-2xl font-bold font-display text-[#FFFDF7] mb-1.5 leading-snug">
              {currentDilemma.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#BBD9D2] leading-relaxed">
              {currentDilemma.description}
            </p>
          </div>

          {/* Redraw Option */}
          <div className="flex justify-end mb-3">
            <button
              onClick={() => {
                sound.playClick();
                startNewDilemma();
              }}
              className="inline-flex items-center gap-1.5 text-xs text-[#BBD9D2] hover:text-[#FFD15C] px-3 py-1 rounded-xl bg-[#073630] border border-[#17675C] hover:border-[#FFD15C] transition-colors cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5 text-[#FFD15C]" />
              <span>Sortear outra situação</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {currentDilemma.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleP1Select(opt.id)}
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
      )}

      {/* STEP 3: Handover */}
      {step === 'HANDOVER' && (
        <div className="bg-[#082F2B] border border-[#17675C] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-2xl animate-fade-in">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#104B43] border border-[#FFD15C] mx-auto flex items-center justify-center text-3xl shadow-inner mb-4 sm:mb-6 animate-pulse">
            {profile.partner2Avatar}
          </div>

          <span className="text-[10px] uppercase tracking-widest text-[#FFD15C] font-bold block mb-1">
            Passe o Celular
          </span>
          <h2 className="text-xl sm:text-3xl font-bold font-display text-[#FFFDF7] mb-2 sm:mb-3">
            Vez de {profile.partner2Name}!
          </h2>
          <p className="text-xs sm:text-sm text-[#BBD9D2] max-w-sm mx-auto mb-6 sm:mb-8 leading-relaxed">
            {profile.partner1Name} já fez a escolha. Agora responda o mesmo dilema sem saber o que o outro marcou!
          </p>

          <button
            onClick={() => {
              sound.playSuccess();
              setStep('P2_CHOICE');
            }}
            className="w-full sm:w-auto px-8 py-3 bg-[#FFD15C] hover:bg-[#EAB83F] text-[#063F39] font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-[#FFD15C]/20 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <span>Ver o Dilema e Escolher</span>
            <ArrowRight className="w-4 h-4 text-[#063F39]" />
          </button>
        </div>
      )}

      {/* STEP 4: Player 2 Choice */}
      {step === 'P2_CHOICE' && (
        <div className="bg-[#082F2B] border border-[#17675C] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#17675C]">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl p-1.5 bg-[#104B43] border border-[#17675C] rounded-xl">
                {profile.partner2Avatar}
              </span>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#FFD15C] font-bold block">
                  Sua escolha secreta
                </span>
                <span className="text-sm sm:text-base font-bold text-[#FFFDF7]">
                  {profile.partner2Name}
                </span>
              </div>
            </div>
            <span className="text-[11px] px-2.5 py-1 bg-[#104B43] border border-[#17675C] rounded-lg text-[#BBD9D2]">
              {currentDilemma.categoryLabel}
            </span>
          </div>

          <div className="mb-5">
            <h3 className="text-lg sm:text-2xl font-bold font-display text-[#FFFDF7] mb-1.5 leading-snug">
              {currentDilemma.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#BBD9D2] leading-relaxed">
              {currentDilemma.description}
            </p>
          </div>

          <div className="space-y-2.5">
            {currentDilemma.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleP2Select(opt.id)}
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
      )}

      {/* STEP 5: Big Reveal Screen */}
      {step === 'REVEAL' && (
        <div className="bg-[#082F2B] border border-[#17675C] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#104B43] border border-[#FFD15C] mx-auto flex items-center justify-center text-3xl mb-3">
            {evaluation.isMatch ? '💖' : '☯️'}
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-display text-[#FFFDF7] mb-1.5">
            {evaluation.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#BBD9D2] max-w-md mx-auto mb-5">
            {evaluation.banter}
          </p>

          {/* Cards with both choices side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mb-5">
            <div
              className={`p-3.5 rounded-2xl border ${
                evaluation.isMatch
                  ? 'bg-[#104B43] border-[#FFD15C]'
                  : 'bg-[#073630] border-[#17675C]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span>{profile.partner1Avatar}</span>
                <span className="text-xs font-bold text-[#FFD15C]">
                  {profile.partner1Name} escolheu:
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#FFFDF7] font-medium">
                {p1SelectedOption?.text}
              </p>
            </div>

            <div
              className={`p-3.5 rounded-2xl border ${
                evaluation.isMatch
                  ? 'bg-[#104B43] border-[#FFD15C]'
                  : 'bg-[#073630] border-[#17675C]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span>{profile.partner2Avatar}</span>
                <span className="text-xs font-bold text-[#FFD15C]">
                  {profile.partner2Name} escolheu:
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#FFFDF7] font-medium">
                {p2SelectedOption?.text}
              </p>
            </div>
          </div>

          {/* Insight commentary */}
          <div className="bg-[#104B43] border border-[#17675C] rounded-2xl p-3.5 sm:p-4 mb-6 text-left">
            <div className="flex items-center gap-1.5 text-[#FFD15C] text-xs font-bold mb-1">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Para Refletir & Conversar:</span>
            </div>
            <p className="text-xs sm:text-sm text-[#FFFDF7] font-medium italic">
              "{currentDilemma.insightComment}"
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
            <button
              onClick={handleNextDilemma}
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-[#FFD15C] hover:bg-[#EAB83F] text-[#063F39] font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#FFD15C]/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{roundNumber >= 5 ? 'Ver Resultado Final 🏆' : 'Próximo Dilema'}</span>
              <ArrowRight className="w-4 h-4 text-[#063F39]" />
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setStep('FINAL_RESULTS');
              }}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-3 bg-[#104B43] hover:bg-[#17675C] border border-[#17675C] text-[#BBD9D2] hover:text-[#FFFDF7] text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Finalizar Partida
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: Final Results Screen */}
      {step === 'FINAL_RESULTS' && (
        <div className="bg-[#082F2B] border border-[#17675C] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-2xl animate-fade-in">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#104B43] border border-[#FFD15C] mx-auto flex items-center justify-center text-3xl shadow-md mb-4 text-[#FFD15C]">
            <Trophy className="w-9 h-9 sm:w-10 sm:h-10 text-[#FFD15C]" />
          </div>

          <span className="text-[10px] uppercase tracking-wider text-[#FFD15C] font-bold block mb-1">
            Resumo dos Dilemas
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#FFFDF7] mb-2">
            {matchCount >= 4
              ? 'Telepatia de Casal! 🔮'
              : matchCount >= 2
              ? 'Equilíbrio Perfeito! ⚖️'
              : 'Os Opostos se Atraem! 💫'}
          </h2>
          <p className="text-xs sm:text-sm text-[#BBD9D2] max-w-sm mx-auto mb-6">
            Vocês tiveram {matchCount} sintonias exatas em {roundNumber} dilemas. O melhor de tudo foram as risadas e conversas pelo caminho!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handlePlayAgain}
              className="w-full sm:w-auto px-6 py-3 bg-[#FFD15C] hover:bg-[#EAB83F] text-[#063F39] font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#FFD15C]/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-[#063F39]" />
              <span>Jogar Novamente com Novos Dilemas</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onBackToHub();
              }}
              className="w-full sm:w-auto px-5 py-3 bg-[#104B43] hover:bg-[#17675C] border border-[#17675C] text-[#BBD9D2] hover:text-[#FFFDF7] text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Voltar ao Hub
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
