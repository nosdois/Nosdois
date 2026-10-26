/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, Volume2, VolumeX, Sparkles, Coins, User } from 'lucide-react';
import { MainTab, CoupleProfile, GameStats } from '../types';
import { sound } from '../utils/audio';
import { formatRelationshipDuration } from '../utils/gameLogic';

interface NavbarProps {
  currentTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  profile: CoupleProfile;
  stats: GameStats;
  onToggleSound: () => void;
  daysTogether: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  profile,
  stats,
  onToggleSound,
  daysTogether,
}) => {
  const durationInfo = formatRelationshipDuration(profile.anniversaryDate);

  return (
    <header className="sticky top-0 z-30 w-full bg-[#063F39]/95 backdrop-blur-md border-b border-[#17675C]/60 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2 sm:pb-3 px-3 sm:px-6 transition-colors shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo & Wordmark */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectTab('inicio');
          }}
          className="flex items-center gap-2 sm:gap-3 group text-left cursor-pointer focus:outline-none shrink-0"
          aria-label="Ir para a página inicial Nós Dois"
        >
          {/* Stylized Yellow Heart Outline */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 flex items-center justify-center">
            <svg
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 sm:w-9 sm:h-9 text-[#FFD15C] group-hover:scale-105 transition-transform"
            >
              <path
                d="M18 7.5C14.5 3 8 3.5 4.5 7.5C1 11.5 1.5 18 5 22.5L18 33L31 22.5C34.5 18 35 11.5 31.5 7.5C28 3.5 21.5 3 18 7.5Z"
                stroke="#FFD15C"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18 13C16 10 12 10.5 10 13C8 15.5 8.5 19 10.5 21.5L18 27.5L25.5 21.5C27.5 19 28 15.5 26 13C24 10.5 20 10 18 13Z"
                stroke="#FFD15C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.85"
              />
            </svg>
          </div>
          <div>
            <span className="text-lg sm:text-2xl font-extrabold tracking-tight text-[#FFFDF7] font-display block leading-none">
              Nós Dois
            </span>
            <span className="hidden xs:block text-[10px] sm:text-[11px] text-[#BBD9D2] tracking-wide font-medium mt-0.5">
              Toda vez juntos, uma nova história.
            </span>
          </div>
        </button>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('inicio');
            }}
            className={`transition-colors whitespace-nowrap cursor-pointer py-1 ${
              currentTab === 'inicio'
                ? 'text-[#FFD15C] font-bold border-b-2 border-[#FFD15C]'
                : 'text-[#BBD9D2] hover:text-[#FFFDF7]'
            }`}
          >
            Início
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('jogos');
            }}
            className={`transition-colors whitespace-nowrap cursor-pointer py-1 ${
              currentTab === 'jogos'
                ? 'text-[#FFD15C] font-bold border-b-2 border-[#FFD15C]'
                : 'text-[#BBD9D2] hover:text-[#FFFDF7]'
            }`}
          >
            Jogos
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('vida-real');
            }}
            className={`transition-colors whitespace-nowrap cursor-pointer py-1 ${
              currentTab === 'vida-real'
                ? 'text-[#FFD15C] font-bold border-b-2 border-[#FFD15C]'
                : 'text-[#BBD9D2] hover:text-[#FFFDF7]'
            }`}
          >
            Vida Real
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('perfil');
            }}
            className={`transition-colors whitespace-nowrap cursor-pointer py-1 ${
              currentTab === 'perfil'
                ? 'text-[#FFD15C] font-bold border-b-2 border-[#FFD15C]'
                : 'text-[#BBD9D2] hover:text-[#FFFDF7]'
            }`}
          >
            Perfil
          </button>
        </nav>

        {/* Right: Relationship Duration Pill + Sound + Profile Avatar Circle */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Elapsed Relationship Duration Pill */}
          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('perfil');
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#073630] border border-[#17675C] hover:border-[#FFD15C] rounded-full text-xs text-[#FFFDF7] cursor-pointer transition-colors shadow-sm max-w-[145px] sm:max-w-none"
            title={durationInfo.hasDate ? `Juntos há ${durationInfo.primary} (${durationInfo.secondary})` : 'Adicionar data de início do relacionamento'}
          >
            <Heart className={`w-3.5 h-3.5 shrink-0 ${durationInfo.hasDate ? 'text-[#FFD15C] fill-[#F16D7A]' : 'text-[#8AAFA7]'}`} />
            <div className="text-left leading-none truncate">
              {durationInfo.hasDate ? (
                <>
                  <span className="font-bold text-[11px] sm:text-xs text-[#FFFDF7] block truncate">
                    {durationInfo.primary}
                  </span>
                  {durationInfo.secondary && (
                    <span className="hidden md:block text-[9px] text-[#BBD9D2] font-medium mt-0.5 truncate">
                      {durationInfo.secondary}
                    </span>
                  )}
                </>
              ) : (
                <span className="font-bold text-[11px] sm:text-xs text-[#FFD15C] block truncate">
                  Adicionar data
                </span>
              )}
            </div>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleSound();
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#073630] hover:bg-[#104B43] border border-[#17675C] hover:border-[#FFD15C] text-[#BBD9D2] hover:text-[#FFFDF7] flex items-center justify-center transition-all cursor-pointer shrink-0"
            aria-label={profile.soundEnabled ? 'Silenciar efeitos sonoros' : 'Ativar efeitos sonoros'}
            title={profile.soundEnabled ? 'Som ativado' : 'Som desativado'}
          >
            {profile.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#FFD15C]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#8AAFA7]" />
            )}
          </button>

          {/* Profile Circle Button */}
          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('perfil');
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#073630] hover:bg-[#104B43] border border-[#17675C] hover:border-[#FFD15C] text-[#FFFDF7] flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0"
            aria-label="Abrir perfil do casal"
            title="Perfil do Casal"
          >
            <User className="w-4 h-4 text-[#FFFDF7]" />
          </button>
        </div>
      </div>
    </header>
  );
};
