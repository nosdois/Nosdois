/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Play,
  Gamepad2,
  ChevronRight,
  Heart,
  Trophy,
  Home as HomeIcon,
  Star,
  Calendar,
  Dices,
} from 'lucide-react';
import { CoupleProfile, GameId, GameStats } from '../types';
import { sound } from '../utils/audio';

import { OnlineHubSection } from './multiplayer/OnlineHubSection';

interface HomeViewProps {
  profile: CoupleProfile;
  stats: GameStats;
  daysTogether?: number;
  onStartPlaying: () => void;
  onSelectGame: (gameId: GameId) => void;
  onOpenVidaReal: () => void;
  onOpenPerfil: () => void;
  onCompleteDailyChallenge: () => void;
  onCreateOnlineRoom: () => void;
  onJoinOnlineRoom: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  stats,
  onStartPlaying,
  onSelectGame,
  onOpenVidaReal,
  onOpenPerfil,
  onCreateOnlineRoom,
  onJoinOnlineRoom,
}) => {
  const handleScrollToGames = () => {
    sound.playSuccess();
    const section = document.getElementById('jogos-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      onStartPlaying();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-3 sm:py-5 pb-28 space-y-4 sm:space-y-7">
      {/* 1. Hero Section */}
      <section className="relative pt-1 sm:pt-2 pb-1 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-8">
          {/* Couple Illustration */}
          <div className="w-full md:w-5/12 flex justify-center md:justify-start shrink-0">
            <div className="relative">
              <img
                src="./assets/ui/hero_couple.png"
                alt="Nós Dois - Casal jogando juntos"
                className="w-full max-w-[200px] sm:max-w-[300px] md:max-w-[340px] h-auto object-cover rounded-3xl drop-shadow-xl"
              />
            </div>
          </div>

          {/* Hero Welcome Text */}
          <div className="w-full md:w-7/12 text-center md:text-left space-y-2.5 sm:space-y-3.5">
            <span className="text-lg sm:text-2xl font-semibold text-[#FFFDF7] block font-display">
              Bem-vindos ao
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-display text-[#FFFDF7] leading-none">
              Nós Dois
            </h1>
            <p className="text-xs sm:text-base text-[#BBD9D2] leading-relaxed max-w-lg mx-auto md:mx-0">
              Um hub de jogos e desafios para casais. Joguem, descubram, riam e construam novas memórias juntos.
            </p>

            {/* Primary Yellow CTA Button */}
            <div className="pt-1 sm:pt-2">
              <button
                onClick={handleScrollToGames}
                className="w-full sm:w-auto px-7 py-3 bg-[#FFD15C] hover:bg-[#EAB83F] text-[#063F39] font-extrabold text-sm sm:text-base rounded-full shadow-lg shadow-[#FFD15C]/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-[#063F39] text-[#063F39]" />
                <span>Começar a jogar</span>
              </button>
            </div>
          </div>
        </div>
      </section>
 
      {/* 2. Jogar Juntos Online Section */}
      <OnlineHubSection
        onCreateRoom={onCreateOnlineRoom}
        onJoinRoom={onJoinOnlineRoom}
      />

      {/* 3. Escolha seu jogo Section */}
      <section id="jogos-section" className="space-y-3.5 scroll-mt-20">
        {/* Header with Gamepad and horizontal bar to "Ver todos >" */}
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <Gamepad2 className="w-6 h-6 sm:w-7 sm:h-7 text-[#FFFDF7]" />
            <h2 className="text-xl sm:text-3xl font-extrabold font-display text-[#FFFDF7]">
              Escolha seu jogo
            </h2>
          </div>

          <div className="hidden sm:block flex-1 h-[1px] bg-[#17675C]/60" />

          <button
            onClick={() => {
              sound.playClick();
              onStartPlaying();
            }}
            className="flex items-center gap-1 text-[11px] sm:text-sm font-semibold text-[#BBD9D2] hover:text-[#FFD15C] px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-[#17675C] hover:border-[#FFD15C] bg-[#073630] cursor-pointer transition-colors shrink-0"
          >
            <span>Ver todos</span>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* 4 Cards Grid - 2 cols on mobile, 4 on desktop for compact viewport */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Quanto Você Me Conhece? */}
          <div className="bg-[#082F2B] border border-[#17675C] hover:border-[#FFD15C] rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex flex-col justify-between shadow-lg transition-all group">
            <div>
              {/* Artwork thumbnail */}
              <div className="w-full h-24 sm:h-36 rounded-xl sm:rounded-2xl overflow-hidden bg-[#073630] border border-[#17675C]/60 mb-2 relative">
                <img
                  src="./assets/ui/card_conhece.png"
                  alt="Quanto Você Me Conhece?"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Yellow Round Badge */}
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#FFD15C] flex items-center justify-center -mt-5 sm:-mt-6 ml-2 sm:ml-3 relative z-10 shadow-md text-[#063F39]">
                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#063F39] text-[#063F39]" />
              </div>

              <div className="pt-1.5 px-0.5">
                <h3 className="font-bold text-xs sm:text-base text-[#FFFDF7] mb-0.5 sm:mb-1 leading-snug line-clamp-1">
                  Quanto Você Me Conhece?
                </h3>
                <p className="text-[11px] sm:text-xs text-[#BBD9D2] leading-tight line-clamp-2 mb-2 sm:mb-3">
                  Descubra o que o outro realmente pensa e sente.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onSelectGame('conhece');
              }}
              className="w-full py-1.5 sm:py-2.5 px-3 rounded-full bg-[#082F2B] hover:bg-[#104B43] border border-[#17675C] hover:border-[#FFD15C] text-[#FFFDF7] font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm active:scale-[0.98]"
            >
              <span>Jogar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Duelo de Casais */}
          <div className="bg-[#082F2B] border border-[#17675C] hover:border-[#FFD15C] rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex flex-col justify-between shadow-lg transition-all group">
            <div>
              <div className="w-full h-24 sm:h-36 rounded-xl sm:rounded-2xl overflow-hidden bg-[#073630] border border-[#17675C]/60 mb-2 relative">
                <img
                  src="./assets/ui/card_duelo.png"
                  alt="Duelo de Casais"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#FFD15C] flex items-center justify-center -mt-5 sm:-mt-6 ml-2 sm:ml-3 relative z-10 shadow-md text-[#063F39]">
                <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#063F39]" />
              </div>

              <div className="pt-1.5 px-0.5">
                <h3 className="font-bold text-xs sm:text-base text-[#FFFDF7] mb-0.5 sm:mb-1 leading-snug line-clamp-1">
                  Duelo de Casais
                </h3>
                <p className="text-[11px] sm:text-xs text-[#BBD9D2] leading-tight line-clamp-2 mb-2 sm:mb-3">
                  Minijogos, reflexos, memória e agilidade.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onSelectGame('duelo');
              }}
              className="w-full py-1.5 sm:py-2.5 px-3 rounded-full bg-[#082F2B] hover:bg-[#104B43] border border-[#17675C] hover:border-[#FFD15C] text-[#FFFDF7] font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm active:scale-[0.98]"
            >
              <span>Jogar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Nosso Mundinho */}
          <div className="bg-[#082F2B] border border-[#17675C] hover:border-[#FFD15C] rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex flex-col justify-between shadow-lg transition-all group">
            <div>
              <div className="w-full h-24 sm:h-36 rounded-xl sm:rounded-2xl overflow-hidden bg-[#073630] border border-[#17675C]/60 mb-2 relative">
                <img
                  src="./assets/ui/card_mundinho.png"
                  alt="Nosso Mundinho"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#FFD15C] flex items-center justify-center -mt-5 sm:-mt-6 ml-2 sm:ml-3 relative z-10 shadow-md text-[#063F39]">
                <HomeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#063F39]" />
              </div>

              <div className="pt-1.5 px-0.5">
                <h3 className="font-bold text-xs sm:text-base text-[#FFFDF7] mb-0.5 sm:mb-1 leading-snug line-clamp-1">
                  Nosso Mundinho
                </h3>
                <p className="text-[11px] sm:text-xs text-[#BBD9D2] leading-tight line-clamp-2 mb-2 sm:mb-3">
                  Construa e decore o seu espaço juntos.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onSelectGame('mundinho');
              }}
              className="w-full py-1.5 sm:py-2.5 px-3 rounded-full bg-[#082F2B] hover:bg-[#104B43] border border-[#17675C] hover:border-[#FFD15C] text-[#FFFDF7] font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm active:scale-[0.98]"
            >
              <span>Jogar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: E Se Nós Dois...? */}
          <div className="bg-[#082F2B] border border-[#17675C] hover:border-[#FFD15C] rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex flex-col justify-between shadow-lg transition-all group">
            <div>
              <div className="w-full h-24 sm:h-36 rounded-xl sm:rounded-2xl overflow-hidden bg-[#073630] border border-[#17675C]/60 mb-2 relative">
                <img
                  src="./assets/ui/card_ese.png"
                  alt="E Se Nós Dois...?"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#FFD15C] flex items-center justify-center -mt-5 sm:-mt-6 ml-2 sm:ml-3 relative z-10 shadow-md text-[#063F39]">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#063F39] fill-[#063F39]" />
              </div>

              <div className="pt-1.5 px-0.5">
                <h3 className="font-bold text-xs sm:text-base text-[#FFFDF7] mb-0.5 sm:mb-1 leading-snug line-clamp-1">
                  E Se Nós Dois...?
                </h3>
                <p className="text-[11px] sm:text-xs text-[#BBD9D2] leading-tight line-clamp-2 mb-2 sm:mb-3">
                  Situações românticas e inesperadas.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onSelectGame('e-se');
              }}
              className="w-full py-1.5 sm:py-2.5 px-3 rounded-full bg-[#082F2B] hover:bg-[#104B43] border border-[#17675C] hover:border-[#FFD15C] text-[#FFFDF7] font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm active:scale-[0.98]"
            >
              <span>Jogar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Middle Section: Jogos de tabuleiro & Desafio do dia */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {/* Card Left: Jogos de tabuleiro */}
        <div className="bg-[#082F2B] border border-[#17675C] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl flex items-center justify-between gap-3 sm:gap-4 relative overflow-hidden">
          <div className="space-y-2 sm:space-y-3 z-10">
            <div className="flex items-center gap-2">
              <Dices className="w-6 h-6 sm:w-7 sm:h-7 text-[#FFFDF7]" />
              <h3 className="text-lg sm:text-xl font-bold font-display text-[#FFFDF7]">
                Jogos de tabuleiro
              </h3>
            </div>
            <p className="text-xs text-[#BBD9D2] leading-relaxed max-w-[210px] sm:max-w-xs">
              Desafios reais para fazer juntos, longe da tela.
            </p>
            <button
              onClick={() => {
                sound.playClick();
                onOpenVidaReal();
              }}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#082F2B] hover:bg-[#104B43] border border-[#17675C] hover:border-[#FFD15C] text-[#FFFDF7] font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer transition-all shadow-sm active:scale-[0.98]"
            >
              <span>Ver desafios</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Post-it Note Graphic */}
          <div className="w-24 sm:w-32 shrink-0 flex items-center justify-center">
            <img
              src="./assets/ui/postit_note.png"
              alt="Mais diversão juntos!"
              className="w-full h-auto drop-shadow-lg rotate-2 hover:rotate-0 transition-transform"
            />
          </div>
        </div>

        {/* Card Right: Desafio do dia */}
        <div className="bg-[#082F2B] border border-[#17675C] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl flex items-center justify-between gap-3 sm:gap-4 relative overflow-hidden">
          <div className="space-y-2 sm:space-y-3 z-10">
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-[#FFFDF7]" />
              <h3 className="text-lg sm:text-xl font-bold font-display text-[#FFFDF7]">
                Desafio do dia
              </h3>
            </div>
            <p className="text-xs text-[#BBD9D2] leading-relaxed max-w-[210px] sm:max-w-xs">
              Uma nova surpresa romântica te espera hoje!
            </p>
            <button
              onClick={() => {
                sound.playClick();
                onOpenVidaReal();
              }}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#082F2B] hover:bg-[#104B43] border border-[#17675C] hover:border-[#FFD15C] text-[#FFFDF7] font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer transition-all shadow-sm active:scale-[0.98]"
            >
              <span>Ver desafio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Gift Box Graphic */}
          <div className="w-24 sm:w-32 shrink-0 flex items-center justify-center">
            <img
              src="./assets/ui/gift_box.png"
              alt="Hoje é especial!"
              className="w-full h-auto drop-shadow-lg hover:scale-105 transition-transform"
            />
          </div>
        </div>
      </section>

      {/* 4. Seu progresso Section */}
      <section className="bg-[#082F2B] border border-[#17675C] rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          {/* Left Title with Yellow Star */}
          <div className="flex items-center gap-2 shrink-0">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFD15C] fill-[#FFD15C]" />
            <h3 className="text-sm sm:text-base font-bold font-display text-[#FFFDF7]">
              Seu progresso
            </h3>
          </div>

          {/* Middle Metric Badges */}
          <div className="flex items-center justify-around sm:justify-center gap-4 sm:gap-8 w-full sm:w-auto">
            {/* Moedas */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#073630] border border-[#17675C] flex items-center justify-center text-xs sm:text-sm">
                🪙
              </div>
              <div className="text-left leading-tight">
                <span className="font-extrabold text-sm sm:text-base text-[#FFFDF7] tabular-nums block">
                  {stats.coins || 120}
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#BBD9D2]">Moedas</span>
              </div>
            </div>

            {/* Conquistas */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#073630] border border-[#17675C] flex items-center justify-center text-xs sm:text-sm">
                🎖️
              </div>
              <div className="text-left leading-tight">
                <span className="font-extrabold text-sm sm:text-base text-[#FFFDF7] tabular-nums block">
                  {stats.unlockedAchievements?.length || 3}
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#BBD9D2]">Conquistas</span>
              </div>
            </div>

            {/* Recordes */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#073630] border border-[#17675C] flex items-center justify-center text-xs sm:text-sm text-[#F16D7A]">
                ❤️
              </div>
              <div className="text-left leading-tight">
                <span className="font-extrabold text-sm sm:text-base text-[#FFFDF7] tabular-nums block">
                  {stats.recordsCount || 1}
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#BBD9D2]">Recordes</span>
              </div>
            </div>
          </div>

          {/* Right Button: Ver meu perfil > */}
          <div className="shrink-0 w-full sm:w-auto">
            <button
              onClick={() => {
                sound.playClick();
                onOpenPerfil();
              }}
              className="w-full sm:w-auto px-4 sm:px-5 py-2 rounded-full bg-[#082F2B] hover:bg-[#104B43] border border-[#17675C] hover:border-[#FFD15C] text-[#FFFDF7] font-bold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm active:scale-[0.98]"
            >
              <span>Ver meu perfil</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
