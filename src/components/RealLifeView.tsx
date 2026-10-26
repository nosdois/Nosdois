/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  Shuffle,
  SkipForward,
  Play,
  Pause,
  RotateCcw,
  Heart,
  Award,
  ArrowLeft,
  Coins,
  History,
  Check,
} from 'lucide-react';
import { CoupleProfile, RealLifeChallenge, RealLifeHistoryRecord } from '../types';
import { REAL_LIFE_CHALLENGES } from '../data/realLifeChallenges';
import { pickNonRepeating } from '../utils/gameLogic';
import { sound } from '../utils/audio';

interface RealLifeViewProps {
  profile: CoupleProfile;
  onBackToHome?: () => void;
  onChallengeCompleted: (challenge: RealLifeChallenge) => void;
}

export const RealLifeView: React.FC<RealLifeViewProps> = ({
  profile,
  onBackToHome,
  onChallengeCompleted,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<RealLifeChallenge>(REAL_LIFE_CHALLENGES[0]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [completedHistory, setCompletedHistory] = useState<RealLifeHistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem('nos_dois_reallife_history');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  // Timer states
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  const drawChallenge = (cat?: string) => {
    sound.playClick();
    setIsCompleted(false);
    setIsTimerActive(false);

    const activeCat = cat !== undefined ? cat : categoryFilter;
    const { item, updatedRecentIds } = pickNonRepeating(
      REAL_LIFE_CHALLENGES,
      recentIds,
      activeCat === 'todos' ? undefined : activeCat
    );

    setCurrentChallenge(item);
    setRecentIds(updatedRecentIds);
    setTimerSeconds((item.durationMinutes || 2) * 60);
  };

  useEffect(() => {
    drawChallenge('todos');
  }, []);

  // Timer countdown hook
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerActive) {
      setIsTimerActive(false);
      sound.playFanfare();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timerSeconds]);

  const handleComplete = () => {
    sound.playFanfare();
    setIsCompleted(true);
    setIsTimerActive(false);

    const newRecord: RealLifeHistoryRecord = {
      id: `rl_${Date.now()}`,
      challengeId: currentChallenge.id,
      title: currentChallenge.title,
      categoryLabel: currentChallenge.categoryLabel,
      completedAt: Date.now(),
    };

    const updated = [newRecord, ...completedHistory].slice(0, 30);
    setCompletedHistory(updated);
    try {
      localStorage.setItem('nos_dois_reallife_history', JSON.stringify(updated));
    } catch (_) {}

    onChallengeCompleted(currentChallenge);
  };

  const handleResetTimer = () => {
    sound.playClick();
    setIsTimerActive(false);
    setTimerSeconds((currentChallenge.durationMinutes || 2) * 60);
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-28">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        {onBackToHome ? (
          <button
            onClick={() => {
              sound.playClick();
              onBackToHome();
            }}
            className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#BBD9D2] hover:text-[#FFFDF7] px-3 py-1.5 rounded-xl bg-[#082F2B] border border-[#17675C] hover:bg-[#104B43] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Voltar ao Início</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-[#082F2B] border border-[#17675C] text-[#FFD15C]">
            <Heart className="w-3.5 h-3.5 fill-[#F16D7A] text-[#F16D7A]" />
            <span>Desafios Presenciais</span>
          </div>
        )}

        <button
          onClick={() => {
            sound.playClick();
            setShowHistoryModal(!showHistoryModal);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#082F2B] hover:bg-[#104B43] border border-[#17675C] rounded-xl text-xs font-bold text-[#FFD15C] transition-colors cursor-pointer"
        >
          <History className="w-3.5 h-3.5 text-[#FFD15C]" />
          <span>{completedHistory.length} cumpridos</span>
        </button>
      </div>

      {/* Intro title */}
      <div className="text-center mb-6">
        <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#FFD15C] font-bold block mb-1">
          Ações Fora da Tela
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#FFFDF7] mb-1.5">
          Vida Real: Desafios para Dois
        </h2>
        <p className="text-xs sm:text-sm text-[#BBD9D2] max-w-md mx-auto">
          Tarefas românticas, criativas e divertidas para fazerem juntos agora mesmo. Usem o celular como sorteador e cronômetro!
        </p>
      </div>

      {/* Category selector */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'romantico', label: 'Românticos' },
            { id: 'engracado', label: 'Engraçados' },
            { id: 'criativo', label: 'Criativos' },
            { id: 'memoria', label: 'Memória' },
            { id: 'conhecimento', label: 'Conhecimento' },
            { id: 'encontros', label: 'Encontros' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCategoryFilter(cat.id);
                drawChallenge(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-[#FFD15C] text-[#063F39] shadow-md shadow-[#FFD15C]/20 font-bold'
                  : 'bg-[#082F2B] text-[#BBD9D2] border border-[#17675C] hover:border-[#FFD15C]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge Card */}
      <div className="bg-[#082F2B] border border-[#17675C] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden mb-6">
        {/* Category & Duration Badge */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#17675C]">
          <span className="px-3 py-1 rounded-full bg-[#104B43] border border-[#17675C] text-[#FFD15C] text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentChallenge.categoryLabel}</span>
          </span>
          <span className="text-xs text-[#BBD9D2] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{currentChallenge.durationMinutes} min</span>
          </span>
        </div>

        {/* Challenge Title */}
        <h3 className="text-xl sm:text-2xl font-bold font-display text-[#FFFDF7] mb-2 leading-tight">
          {currentChallenge.title}
        </h3>
        <p className="text-xs sm:text-sm text-[#BBD9D2] mb-5 leading-relaxed">
          {currentChallenge.description}
        </p>

        {/* Steps */}
        <div className="bg-[#073630] border border-[#17675C] rounded-2xl p-4 mb-6 space-y-2">
          <span className="text-[11px] font-bold text-[#FFD15C] block uppercase tracking-wider mb-2">
            Como Realizar:
          </span>
          {currentChallenge.steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-[#FFFDF7]">
              <span className="w-5 h-5 rounded-full bg-[#104B43] text-[#FFD15C] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </div>
          ))}
        </div>

        {/* Functional Timer Widget */}
        <div className="bg-[#073630] border border-[#17675C] rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#104B43] border border-[#17675C] flex items-center justify-center text-[#FFD15C]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#FFD15C] block">
                Cronômetro do Desafio
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#FFFDF7] tabular-nums">
                {formatTimer(timerSeconds)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setIsTimerActive(!isTimerActive);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isTimerActive
                  ? 'bg-[#F16D7A] text-[#FFFDF7]'
                  : 'bg-[#FFD15C] text-[#063F39] hover:bg-[#EAB83F]'
              }`}
            >
              {isTimerActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Iniciar Tempo</span>
                </>
              )}
            </button>
            <button
              onClick={handleResetTimer}
              className="p-2 bg-[#104B43] hover:bg-[#17675C] border border-[#17675C] rounded-xl text-[#BBD9D2] hover:text-[#FFFDF7] transition-colors cursor-pointer"
              title="Resetar tempo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={() => drawChallenge()}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#073630] hover:bg-[#104B43] border border-[#17675C] text-[#BBD9D2] hover:text-[#FFFDF7] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Shuffle className="w-4 h-4 text-[#FFD15C]" />
            <span>Sortear Outro Desafio</span>
          </button>

          <button
            onClick={handleComplete}
            disabled={isCompleted}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
              isCompleted
                ? 'bg-[#104B43] border border-[#10B981] text-[#10B981]'
                : 'bg-[#FFD15C] hover:bg-[#EAB83F] text-[#063F39] shadow-[#FFD15C]/20 active:scale-[0.98]'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>Desafio Cumprido! (+15 🪙)</span>
              </>
            ) : (
              <>
                <Award className="w-4 h-4 text-[#063F39]" />
                <span>Cumprir Desafio (+15 🪙)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Completed History List */}
      {completedHistory.length > 0 && (
        <div className="bg-[#082F2B] border border-[#17675C] rounded-2xl sm:rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#17675C] pb-2">
            <span className="text-xs font-bold text-[#FFD15C] flex items-center gap-1.5">
              <History className="w-4 h-4" />
              <span>Desafios Cumpridos Recentemente</span>
            </span>
            <span className="text-[11px] text-[#BBD9D2]">
              {completedHistory.length} total
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {completedHistory.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-[#073630] border border-[#17675C] rounded-xl flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-5 h-5 rounded-full bg-[#104B43] flex items-center justify-center text-[#10B981] shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-[#FFFDF7] block truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-[#FFD15C]">
                      {item.categoryLabel}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-[#8AAFA7] shrink-0">
                  {new Date(item.completedAt).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
