/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Wifi, Plus, LogIn, Users, Smartphone, Sparkles, Heart } from 'lucide-react';
import { sound } from '../../utils/audio';

interface OnlineHubSectionProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

export const OnlineHubSection: React.FC<OnlineHubSectionProps> = ({
  onCreateRoom,
  onJoinRoom,
}) => {
  return (
    <section className="bg-gradient-to-br from-[#082F2B] to-[#0A3D36] border-2 border-[#17675C] hover:border-[#FFD15C]/60 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden transition-all">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FFD15C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-[#F16D7A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Top badge & title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#104B43] border border-[#FFD15C]/50 text-[#FFD15C] text-[11px] font-bold tracking-wide uppercase shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#FFD15C] animate-pulse" />
              Multiplayer em Tempo Real
            </span>
            <span className="text-xs text-[#BBD9D2] hidden md:inline">
              Conexão via Cloud Firestore
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#BBD9D2]">
            <Smartphone className="w-3.5 h-3.5 text-[#FFD15C]" />
            <span>Dois celulares sincronizados</span>
          </div>
        </div>

        <div className="max-w-2xl">
          <div className="flex items-center gap-2.5 mb-1.5">
            <Wifi className="w-6 h-6 text-[#FFD15C] shrink-0" />
            <h3 className="text-xl sm:text-2xl font-extrabold font-display text-[#FFFDF7]">
              Jogar Juntos Online
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#BBD9D2] leading-relaxed">
            Distância não é problema! Crie uma sala exclusiva ou digite o código do seu amor para jogarem sincronizados em tempo real, cada um no seu celular.
          </p>
        </div>

        {/* Action Buttons: Criar Sala & Entrar em Sala */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Option 1: Criar Sala */}
          <button
            onClick={() => {
              sound.playSuccess();
              onCreateRoom();
            }}
            className="p-4 rounded-2xl bg-[#063F39] hover:bg-[#104B43] border border-[#17675C] hover:border-[#FFD15C] transition-all text-left flex items-start gap-3.5 cursor-pointer group shadow-lg active:scale-[0.98]"
          >
            <div className="w-11 h-11 rounded-xl bg-[#FFD15C] text-[#063F39] flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base text-[#FFFDF7] group-hover:text-[#FFD15C] transition-colors block">
                Criar Nova Sala
              </span>
              <span className="text-[11px] sm:text-xs text-[#BBD9D2] leading-snug block mt-0.5">
                Gere um código de 6 dígitos e envie o convite para o parceiro.
              </span>
            </div>
          </button>

          {/* Option 2: Entrar em Sala */}
          <button
            onClick={() => {
              sound.playClick();
              onJoinRoom();
            }}
            className="p-4 rounded-2xl bg-[#063F39] hover:bg-[#104B43] border border-[#17675C] hover:border-[#FFD15C] transition-all text-left flex items-start gap-3.5 cursor-pointer group shadow-lg active:scale-[0.98]"
          >
            <div className="w-11 h-11 rounded-xl bg-[#073630] border border-[#17675C] group-hover:border-[#FFD15C] text-[#FFD15C] flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
              <LogIn className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base text-[#FFFDF7] group-hover:text-[#FFD15C] transition-colors block">
                Entrar em uma Sala
              </span>
              <span className="text-[11px] sm:text-xs text-[#BBD9D2] leading-snug block mt-0.5">
                Já recebeu um código? Digite para conectar imediatamente.
              </span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
