/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Gamepad2, Dices, Heart } from 'lucide-react';
import { MainTab } from '../types';
import { sound } from '../utils/audio';

interface BottomNavProps {
  currentTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'inicio' as MainTab, label: 'Início', icon: Home },
    { id: 'jogos' as MainTab, label: 'Jogos', icon: Gamepad2 },
    { id: 'vida-real' as MainTab, label: 'Vida Real', icon: Dices },
    { id: 'perfil' as MainTab, label: 'Perfil', icon: Heart },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#073630]/98 backdrop-blur-md border-t border-[#17675C]/70 pb-[env(safe-area-inset-bottom)] shadow-2xl"
      aria-label="Navegação inferior"
    >
      <div className="grid grid-cols-4 items-center h-14 sm:h-16 max-w-lg mx-auto px-2 sm:px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                onSelectTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all cursor-pointer relative ${
                isActive ? 'text-[#FFD15C] font-bold' : 'text-[#BBD9D2] hover:text-[#FFFDF7]'
              }`}
              aria-label={`Aba ${tab.label}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.6]' : 'stroke-[1.8]'}`} />
              <span className="text-[11px] font-medium tracking-tight">{tab.label}</span>
              {isActive && (
                <div className="w-8 h-1 bg-[#FFD15C] rounded-full mt-0.5 animate-fade-in" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
