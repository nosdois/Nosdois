/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Heart,
  Sparkles,
  MessageCircle,
  ArrowRight,
  Trophy,
  RotateCcw,
  User,
  Check,
  Wifi,
  Smartphone,
  EyeOff,
  AlertTriangle,
} from 'lucide-react';
import { CoupleProfile, Question } from '../../types';
import { QUESTIONS_DATA } from '../../data/questions';
import { pickNonRepeating } from '../../utils/gameLogic';
import { sound } from '../../utils/audio';

interface ConheceGameProps {
  profile: CoupleProfile;
  onBackToHub: () => void;
  onRecordRound: (isCorrect: boolean) => void;
  onUpdateProfile?: (updated: CoupleProfile) => void;
  onOpenOnlineMultiplayer?: () => void;
}

type Step =
  | 'INSTRUCTIONS'
  | 'CONFIRM_RESPONDENT'
  | 'RESPONDENT_CHOICE'
  | 'CONFIRM_GUESSER'
  | 'GUESSER_CHOICE'
  | 'REVEAL'
  | 'FINAL_RESULTS';

export const ConheceGame: React.FC<ConheceGameProps> = ({
  profile,
  onBackToHub,
  onRecordRound,
  onUpdateProfile,
  onOpenOnlineMultiplayer,
}) => {
  const [step, setStep] = useState<Step>('INSTRUCTIONS');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [activeRespondent, setActiveRespondent] = useState<1 | 2>(1); // 1 = P1 answers about self, P2 guesses
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(QUESTIONS_DATA[0]);
  const [secretAnswerId, setSecretAnswerId] = useState<string>('');
  const [guessedAnswerId, setGuessedAnswerId] = useState<string>('');
  const [scores, setScores] = useState<{ p1: number; p2: number }>({ p1: 0, p2: 0 });
  const [isEditingNames, setIsEditingNames] = useState<boolean>(false);
  const [isConfirmingTurn, setIsConfirmingTurn] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  const [p1Name, setP1Name] = useState<string>(profile.partner1Name || 'Amor 1');
  const [p2Name, setP2Name] = useState<string>(profile.partner2Name || 'Amor 2');

  useEffect(() => {
    if (profile.partner1Name) setP1Name(profile.partner1Name);
    if (profile.partner2Name) setP2Name(profile.partner2Name);
  }, [profile.partner1Name, profile.partner2Name]);

  const respondentName = activeRespondent === 1 ? p1Name : p2Name;
  const guesserName = activeRespondent === 1 ? p2Name : p1Name;
  const respondentAvatar = activeRespondent === 1 ? profile.partner1Avatar : profile.partner2Avatar;
  const guesserAvatar = activeRespondent === 1 ? profile.partner2Avatar : profile.partner1Avatar;

  const handleSaveNames = () => {
    sound.playSuccess();
    setIsEditingNames(false);
    if (onUpdateProfile) {
      onUpdateProfile({
        ...profile,
        partner1Name: p1Name.trim() || 'Amor 1',
        partner2Name: p2Name.trim() || 'Amor 2',
      });
    }
  };

  const startNewRound = (nextRespondent: 1 | 2) => {
    const { item, updatedRecentIds } = pickNonRepeating(
      QUESTIONS_DATA,
      recentIds,
      categoryFilter === 'todos' ? undefined : categoryFilter
    );
    setCurrentQuestion(item);
    setRecentIds(updatedRecentIds);
    setSecretAnswerId('');
    setGuessedAnswerId('');
    setActiveRespondent(nextRespondent);
    // Crucial requirement: show handover screen BEFORE the question is revealed!
    setStep('CONFIRM_RESPONDENT');
  };

  const handleStartGame = () => {
    sound.playSuccess();
    setRoundNumber(1);
    setScores({ p1: 0, p2: 0 });
    startNewRound(1);
  };

  const handleConfirmReady = () => {
    if (isConfirmingTurn) return;
    setIsConfirmingTurn(true);
    sound.playClick();
    setTimeout(() => {
      if (step === 'CONFIRM_RESPONDENT') {
        setStep('RESPONDENT_CHOICE');
      } else if (step === 'CONFIRM_GUESSER') {
        setStep('GUESSER_CHOICE');
      }
      setIsConfirmingTurn(false);
    }, 120);
  };

  const handleRespondentSubmit = (optId: string) => {
    sound.playClick();
    setSecretAnswerId(optId);
    // Crucial requirement: hide secret answer and prompt handover before guesser sees screen
    setStep('CONFIRM_GUESSER');
  };

  const handleGuesserSubmit = (optId: string) => {
    setGuessedAnswerId(optId);
    const isCorrect = optId === secretAnswerId;

    if (isCorrect) {
      sound.playSuccess();
      setScores((prev) => {
        if (activeRespondent === 1) {
          return { ...prev, p2: prev.p2 + 1 };
        } else {
          return { ...prev, p1: prev.p1 + 1 };
        }
      });
      onRecordRound(true);
    } else {
      sound.playBuzzer();
      onRecordRound(false);
    }

    setStep('REVEAL');
  };

  const handleNextRound = () => {
    sound.playClick();
    if (roundNumber >= 6) {
      sound.playFanfare();
      setStep('FINAL_RESULTS');
      return;
    }
    setRoundNumber((prev) => prev + 1);
    const nextResp: 1 | 2 = activeRespondent === 1 ? 2 : 1;
    startNewRound(nextResp);
  };

  const handlePlayAgain = () => {
    sound.playSuccess();
    setScores({ p1: 0, p2: 0 });
    setRoundNumber(1);
    startNewRound(1);
  };

  const handleAttemptBack = () => {
    sound.playClick();
    if (step !== 'INSTRUCTIONS' && step !== 'FINAL_RESULTS') {
      setShowExitConfirm(true);
    } else {
      onBackToHub();
    }
  };

  const isCorrect = guessedAnswerId === secretAnswerId;
  const secretOption = currentQuestion.options.find((o) => o.id === secretAnswerId);
  const guessedOption = currentQuestion.options.find((o) => o.id === guessedAnswerId);

  // Compatibility evaluation
  const totalCorrect = scores.p1 + scores.p2;
  const compatibilityTitle =
    totalCorrect >= 5
      ? 'Almas Gêmeas Conectadas! ✨'
      : totalCorrect >= 3
      ? 'Sintonia Maravilhosa! 💕'
      : 'Muitos Segredos a Descobrir! 💖';

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-3 sm:py-6 pb-24">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <button
          onClick={handleAttemptBack}
          className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#BBD9D2] hover:text-[#FFFDF7] px-3 py-1.5 rounded-xl bg-[#082F2B] border border-[#17675C] hover:bg-[#104B43] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Voltar ao Hub</span>
        </button>

        {step !== 'INSTRUCTIONS' && step !== 'FINAL_RESULTS' && (
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-semibold">
            <span className="px-2.5 py-1 rounded-xl bg-[#104B43] border border-[#17675C] text-[#FFD15C] font-bold">
              Rodada <span className="tabular-nums">#{roundNumber}</span>/6
            </span>
            <div className="flex items-center gap-2 px-2.5 py-1 bg-[#082F2B] border border-[#17675C] rounded-xl text-[#FFFDF7]">
              <span>{profile.partner1Avatar} {scores.p1}</span>
              <span className="text-[#17675C]">·</span>
              <span>{profile.partner2Avatar} {scores.p2}</span>
            </div>
          </div>
        )}
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#082F2B] border border-[#17675C] rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#3A1E24] border border-[#F16D7A] text-[#F16D7A] mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#FFFDF7]">
              Sair da partida em andamento?
            </h3>
            <p className="text-xs text-[#BBD9D2] leading-relaxed">
              O progresso da partida atual não será salvo se você retornar ao catálogo agora.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 bg-[#073630] border border-[#17675C] text-[#FFFDF7] font-semibold text-xs rounded-xl cursor-pointer"
              >
                Continuar Jogando
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onBackToHub();
                }}
                className="flex-1 py-2.5 bg-[#F16D7A] hover:bg-[#D95360] text-[#FFFDF7] font-bold text-xs rounded-xl cursor-pointer"
              >
                Sim, Sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== STEP 1: INSTRUCTIONS & SETUP ===================== */}
      {step === 'INSTRUCTIONS' && (
        <div className="bg-[#082F2B] border border-[#17675C] rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-center shadow-2xl">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#104B43] border border-[#17675C] mx-auto flex items-center justify-center text-[#F16D7A] shadow-md mb-3">
            <Heart className="w-7 h-7 sm:w-8 sm:h-8 fill-[#F16D7A]" />
          </div>

          <h2 className="text-xl sm:text-3xl font-bold font-display text-[#FFFDF7] mb-1.5">
            Quanto Você Me Conhece?
          </h2>
          <p className="text-xs sm:text-sm text-[#BBD9D2] max-w-md mx-auto mb-5 sm:mb-6">
            Um teste leve e divertido de afinidade. Um responde em segredo, o outro tenta adivinhar, e vocês descobrem o quanto conhecem os detalhes um do outro!
          </p>

          {/* Participant Names Card */}
          <div className="bg-[#073630] border border-[#17675C] rounded-2xl p-3.5 sm:p-4 max-w-md mx-auto mb-6 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#FFD15C] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Participantes da Partida
              </span>
              <button
                onClick={() => {
                  sound.playClick();
                  if (isEditingNames) handleSaveNames();
                  else setIsEditingNames(true);
                }}
                className="text-[11px] font-semibold text-[#BBD9D2] hover:text-[#FFD15C] underline cursor-pointer"
              >
                {isEditingNames ? 'Salvar Nomes' : 'Editar Nomes'}
              </button>
            </div>

            {isEditingNames ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="text-[10px] text-[#BBD9D2] block mb-0.5">Jogador 1:</label>
                  <input
                    type="text"
                    value={p1Name}
                    onChange={(e) => setP1Name(e.target.value)}
                    className="w-full bg-[#082F2B] border border-[#17675C] rounded-lg px-2.5 py-1.5 text-xs text-[#FFFDF7] focus:outline-none focus:border-[#FFD15C]"
                    placeholder="Nome Jogador 1"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#BBD9D2] block mb-0.5">Jogador 2:</label>
                  <input
                    type="text"
                    value={p2Name}
                    onChange={(e) => setP2Name(e.target.value)}
                    className="w-full bg-[#082F2B] border border-[#17675C] rounded-lg px-2.5 py-1.5 text-xs text-[#FFFDF7] focus:outline-none focus:border-[#FFD15C]"
                    placeholder="Nome Jogador 2"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-around py-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{profile.partner1Avatar}</span>
                  <span className="font-bold text-[#FFFDF7]">{p1Name}</span>
                </div>
                <span className="text-[#17675C]">❤️</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{profile.partner2Avatar}</span>
                  <span className="font-bold text-[#FFFDF7]">{p2Name}</span>
                </div>
              </div>
            )}
          </div>

          {/* How to play summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-left mb-6">
            <div className="bg-[#073630] border border-[#17675C] rounded-2xl p-3 sm:p-4">
              <span className="text-[11px] sm:text-xs font-bold text-[#FFD15C] block mb-0.5">1. Resposta Privada</span>
              <p className="text-[11px] sm:text-xs text-[#BBD9D2] leading-relaxed">
                {p1Name} confirma que está com o celular e responde em segredo.
              </p>
            </div>
            <div className="bg-[#073630] border border-[#17675C] rounded-2xl p-3 sm:p-4">
              <span className="text-[11px] sm:text-xs font-bold text-[#FFD15C] block mb-0.5">2. Passagem de Vez</span>
              <p className="text-[11px] sm:text-xs text-[#BBD9D2] leading-relaxed">
                O celular passa para {p2Name}, que confirma antes de ver as opções.
              </p>
            </div>
            <div className="bg-[#073630] border border-[#17675C] rounded-2xl p-3 sm:p-4">
              <span className="text-[11px] sm:text-xs font-bold text-[#FFD15C] block mb-0.5">3. Revelação & Papo</span>
              <p className="text-[11px] sm:text-xs text-[#BBD9D2] leading-relaxed">
                O app revela os votos, soma os pontos e propõe uma reflexão a dois.
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6 sm:mb-8">
            <span className="text-xs font-semibold text-[#BBD9D2] block mb-2">
              Escolher Categoria:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              {[
                { id: 'todos', label: 'Todas as Categorias' },
                { id: 'romantico', label: 'Românticas' },
                { id: 'cotidiano', label: 'Cotidiano' },
                { id: 'engracado', label: 'Engraçadas' },
                { id: 'personalidade', label: 'Personalidade' },
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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleStartGame}
              className="w-full sm:w-auto px-7 py-3 bg-[#FFD15C] hover:bg-[#EAB83F] text-[#063F39] font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-[#FFD15C]/20 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <span>Começar no Mesmo Celular</span>
              <ArrowRight className="w-4 h-4 text-[#063F39]" />
            </button>

            {onOpenOnlineMultiplayer && (
              <button
                onClick={() => {
                  sound.playSuccess();
                  onOpenOnlineMultiplayer();
                }}
                className="w-full sm:w-auto px-6 py-3 bg-[#073630] hover:bg-[#104B43] border border-[#17675C] hover:border-[#FFD15C] text-[#FFFDF7] font-bold text-sm rounded-2xl transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <Wifi className="w-4 h-4 text-[#FFD15C]" />
                <span>Jogar Online (Celulares Separados)</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================= STEP 2: CONFIRM RESPONDENT (BEFORE QUESTION) ================= */}
      {step === 'CONFIRM_RESPONDENT' && (
        <div className="bg-[#082F2B] border border-[#17675C] rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center shadow-2xl animate-fade-in">
          {/* Privacy & Handover Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#104B43] border border-[#17675C] text-[#FFD15C] text-xs font-bold mb-4">
            <EyeOff className="w-3.5 h-3.5" />
            <span>Etapa Privada — Resposta Secreta</span>
          </div>

          {/* Big Player Avatar */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#073630] border-2 border-[#FFD15C] mx-auto flex items-center justify-center text-4xl sm:text-5xl shadow-xl mb-4">
            {respondentAvatar}
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#FFFDF7] mb-2">
            Vez de {respondentName}
          </h2>

          <p className="text-xs sm:text-sm text-[#BBD9D2] max-w-md mx-auto mb-7 leading-relaxed">
            Passe o celular para <strong>{respondentName}</strong>. A outra pessoa não deve olhar a tela enquanto a resposta é escolhida.
          </p>

          <button
            onClick={handleConfirmReady}
            disabled={isConfirmingTurn}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#FFD15C] hover:bg-[#EAB83F] disabled:opacity-50 text-[#063F39] font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-[#FFD15C]/20 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <span>Estou pronto</span>
            <ArrowRight className="w-4 h-4 text-[#063F39]" />
          </button>
        </div>
      )}

      {/* ================= STEP 3: RESPONDENT CHOICE (PRIVATE QUESTION) ================= */}
      {step === 'RESPONDENT_CHOICE' && (
        <div className="bg-[#082F2B] border border-[#17675C] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-[#17675C]">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl p-1.5 bg-[#104B43] border border-[#17675C] rounded-xl">
                {respondentAvatar}
              </span>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#FFD15C] font-bold block">
                  Sua vez de responder em segredo
                </span>
                <span className="text-sm sm:text-base font-bold text-[#FFFDF7]">
                  {respondentName}
                </span>
              </div>
            </div>
            <span className="text-[11px] px-2.5 py-1 bg-[#104B43] border border-[#17675C] rounded-lg text-[#BBD9D2]">
              {currentQuestion.categoryLabel}
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-lg sm:text-2xl font-bold font-display text-[#FFFDF7] leading-snug">
              {currentQuestion.text}
            </h3>
            <p className="text-xs text-[#BBD9D2] mt-1">
              Selecione sua resposta verdadeira. {guesserName} tentará adivinhar a seguir!
            </p>
          </div>

          <div className="space-y-2.5">
            {currentQuestion.options.map((opt) => (
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
      )}

      {/* ================= STEP 4: CONFIRM GUESSER (HANDOVER BEFORE GUESS) ================= */}
      {step === 'CONFIRM_GUESSER' && (
        <div className="bg-[#082F2B] border border-[#17675C] rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center shadow-2xl animate-fade-in">
          {/* Privacy badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#104B43] border border-[#17675C] text-[#FFD15C] text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Resposta gravada em segredo!</span>
          </div>

          {/* Big Guesser Avatar */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#073630] border-2 border-[#FFD15C] mx-auto flex items-center justify-center text-4xl sm:text-5xl shadow-xl mb-4">
            {guesserAvatar}
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#FFFDF7] mb-2">
            Vez de {guesserName}
          </h2>

          <p className="text-xs sm:text-sm text-[#BBD9D2] max-w-md mx-auto mb-7 leading-relaxed">
            Passe o celular para <strong>{guesserName}</strong>. A outra pessoa não deve olhar a tela enquanto o palpite é realizado.
          </p>

          <button
            onClick={handleConfirmReady}
            disabled={isConfirmingTurn}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#FFD15C] hover:bg-[#EAB83F] disabled:opacity-50 text-[#063F39] font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-[#FFD15C]/20 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <span>Estou pronto</span>
            <ArrowRight className="w-4 h-4 text-[#063F39]" />
          </button>
        </div>
      )}

      {/* ================= STEP 5: GUESSER CHOICE ================= */}
      {step === 'GUESSER_CHOICE' && (
        <div className="bg-[#082F2B] border border-[#17675C] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-[#17675C]">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl p-1.5 bg-[#104B43] border border-[#17675C] rounded-xl">
                {guesserAvatar}
              </span>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#FFD15C] font-bold block">
                  Qual foi a escolha de {respondentName}?
                </span>
                <span className="text-sm sm:text-base font-bold text-[#FFFDF7]">
                  {guesserName}
                </span>
              </div>
            </div>
            <span className="text-[11px] px-2.5 py-1 bg-[#104B43] border border-[#17675C] rounded-lg text-[#BBD9D2]">
              {currentQuestion.categoryLabel}
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-lg sm:text-2xl font-bold font-display text-[#FFFDF7] leading-snug">
              {currentQuestion.text}
            </h3>
            <p className="text-xs text-[#BBD9D2] mt-1">
              Dê seu palpite sobre o que {respondentName} marcou:
            </p>
          </div>

          <div className="space-y-2.5">
            {currentQuestion.options.map((opt) => (
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
      )}

      {/* ================= STEP 6: REVEAL ================= */}
      {step === 'REVEAL' && (
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
              ? `${guesserName} conhece muito bem as preferências de ${respondentName}!`
              : `Boa tentativa! Momentos como esse servem para descobrir novos detalhes um do outro.`}
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

            {!isCorrect && (
              <div className="flex items-start gap-2.5 pt-2 border-t border-[#17675C]">
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded bg-[#063F39] text-[#BBD9D2] shrink-0 mt-0.5">
                  Palpite de {guesserName}:
                </span>
                <span className="text-xs sm:text-sm text-[#BBD9D2]">
                  {guessedOption?.text}
                </span>
              </div>
            )}
          </div>

          {/* Spark Conversation Prompt */}
          {currentQuestion.chatPrompt && (
            <div className="bg-[#104B43] border border-[#17675C] rounded-2xl p-3.5 sm:p-4 mb-6 text-left">
              <div className="flex items-center gap-1.5 text-[#FFD15C] text-xs font-bold mb-1">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Papo de Casal:</span>
              </div>
              <p className="text-xs sm:text-sm text-[#FFFDF7] font-medium italic">
                "{currentQuestion.chatPrompt}"
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
            <button
              onClick={handleNextRound}
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-[#FFD15C] hover:bg-[#EAB83F] text-[#063F39] font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#FFD15C]/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>
                {roundNumber >= 6
                  ? 'Ver Resultado Final 🏆'
                  : `Próxima Rodada (Vez de ${activeRespondent === 1 ? p2Name : p1Name})`}
              </span>
              <ArrowRight className="w-4 h-4 text-[#063F39]" />
            </button>
            <button
              onClick={() => {
                sound.playFanfare();
                setStep('FINAL_RESULTS');
              }}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-3 bg-[#104B43] hover:bg-[#17675C] border border-[#17675C] text-[#BBD9D2] hover:text-[#FFFDF7] text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Finalizar Partida
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 7: FINAL RESULTS ================= */}
      {step === 'FINAL_RESULTS' && (
        <div className="bg-[#082F2B] border border-[#17675C] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-2xl animate-fade-in">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#104B43] border border-[#FFD15C] mx-auto flex items-center justify-center text-3xl shadow-md mb-4 text-[#FFD15C]">
            <Trophy className="w-9 h-9 sm:w-10 sm:h-10 text-[#FFD15C]" />
          </div>

          <span className="text-[10px] uppercase tracking-wider text-[#FFD15C] font-bold block mb-1">
            Fim de Jogo!
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#FFFDF7] mb-2">
            {compatibilityTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#BBD9D2] max-w-sm mx-auto mb-6">
            Vocês completaram a partida com muito carinho e novas descobertas!
          </p>

          {/* Scores comparison */}
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-6">
            <div className="bg-[#073630] border border-[#17675C] rounded-2xl p-4 text-center">
              <span className="text-2xl block mb-1">{profile.partner1Avatar}</span>
              <span className="font-bold text-xs sm:text-sm text-[#FFFDF7] block truncate">{p1Name}</span>
              <span className="text-2xl font-extrabold text-[#FFD15C] block mt-1">{scores.p1}</span>
              <span className="text-[10px] text-[#BBD9D2]">acertos</span>
            </div>
            <div className="bg-[#073630] border border-[#17675C] rounded-2xl p-4 text-center">
              <span className="text-2xl block mb-1">{profile.partner2Avatar}</span>
              <span className="font-bold text-xs sm:text-sm text-[#FFFDF7] block truncate">{p2Name}</span>
              <span className="text-2xl font-extrabold text-[#FFD15C] block mt-1">{scores.p2}</span>
              <span className="text-[10px] text-[#BBD9D2]">acertos</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handlePlayAgain}
              className="w-full sm:w-auto px-6 py-3 bg-[#FFD15C] hover:bg-[#EAB83F] text-[#063F39] font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#FFD15C]/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-[#063F39]" />
              <span>Jogar Novamente com Novas Perguntas</span>
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
