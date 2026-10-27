/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, ChevronRight, Heart, Trophy, Home as HomeIcon, Star, Dices } from 'lucide-react';
import { CoupleProfile, GameId } from '../types';
import { sound } from '../utils/audio';

import { OnlineHubSection } from './multiplayer/OnlineHubSection';

interface GamesHubViewProps {
  profile: CoupleProfile;
  onSelectGame: (gameId: GameId) => void;
  onCreateOnlineRoom: () => void;
  onJoinOnlineRoom: () => void;
}

export const GamesHubView: React.FC<GamesHubViewProps> = ({
  onSelectGame,
  onCreateOnlineRoom,
  onJoinOnlineRoom,
}) => {
  const games = [
    {
      id: 'conhece' as GameId,
      title: 'Quanto Você Me Conhece?',
      category: 'Afinidade & Segredos',
      description: 'Um responde em segredo sobre si mesmo, o outro tenta adivinhar. Descubra o quanto vocês conhecem os detalhes um do outro.',
      imageSrc: './assets/ui/card_conhece.png',
      icon: Heart,
      badge: 'Perguntas e Respostas',
      playerMode: 'Alternando turnos',
    },
    {
      id: 'duelo' as GameId,
      title: 'Duelo de Casais',
      category: '5 Minijogos Dinâmicos',
      description: 'Competição leve e divertida: Teste de Reflexos, Desafio de Memória, Sequências de Símbolos, Adivinhação Tabu e Observação.',
      imageSrc: './assets/ui/card_duelo.png',
      icon: Trophy,
      badge: 'Ação & Agilidade',
      playerMode: 'Mesmo celular',
    },
    {
      id: 'mundinho' as GameId,
      title: 'Nosso Mundinho',
      category: 'Construção & Decoração',
      description: 'Construam, decorem e evoluam a sua ilha flutuante juntos, usando as Moedas do Amor conquistadas em cada partida.',
      imageSrc: './assets/ui/card_mundinho.png',
      icon: HomeIcon,
      badge: 'Espaço do Casal',
      playerMode: 'Conquistas & Decoração',
    },
    {
      id: 'e-se' as GameId,
      title: 'E Se Nós Dois...?',
      category: 'Dilemas & Sintonia',
      description: 'Cenários hipotéticos inesperados, viagens imaginárias e situações cômicas. Escolhas secretas e uma revelação divertida da sintonia.',
      imageSrc: './assets/ui/card_ese.png',
      icon: Star,
      badge: 'Conversa & Conexão',
      playerMode: 'Votação secreta',
    },
    {
      id: 'vida-real' as GameId,
      title: 'Vida Real: Desafios para Dois',
      category: 'Ações Presenciais',
      description: 'Desafios românticos, engraçados e criativos para cumprir fora da tela: desenhos vendados, troca de carinho, conexões olho no olho.',
      imageSrc: './assets/ui/postit_note.png',
      icon: Dices,
      badge: 'Missões no Mundo Real',
      playerMode: 'Juntos agora',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-28">
      {/* Title Header */}
      <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
        <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#FFD15C] font-bold block mb-1">
          Catálogo Completo
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#FFFDF7] mb-1.5">
          Escolha Seu Jogo
        </h2>
        <p className="text-xs sm:text-sm text-[#BBD9D2]">
          Cinco experiências completas e jogáveis para transformar qualquer momento a dois numa memória inesquecível.
        </p>
      </div>

      {/* Online Multiplayer Section */}
      <div className="mb-6">
        <OnlineHubSection
          onCreateRoom={onCreateOnlineRoom}
          onJoinRoom={onJoinOnlineRoom}
        />
      </div>

      {/* Grid of Games */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <div
              key={game.id}
              className="bg-[#082F2B] hover:bg-[#0E453E] border border-[#17675C] hover:border-[#FFD15C] rounded-2xl sm:rounded-3xl p-4 sm:p-5 transition-all flex flex-col justify-between shadow-xl group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#073630] border border-[#17675C]/60 shrink-0">
                    <img
                      src={game.imageSrc}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#104B43] text-[#FFD15C] border border-[#17675C] inline-block">
                      {game.badge}
                    </span>
                    <span className="text-[10px] text-[#BBD9D2] block mt-0.5">
                      {game.playerMode}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#FFD15C] flex items-center justify-center shrink-0 text-[#063F39]">
                    <Icon className="w-3.5 h-3.5 fill-[#063F39] text-[#063F39]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold font-display text-[#FFFDF7] group-hover:text-[#FFD15C] transition-colors">
                    {game.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-[#BBD9D2] leading-relaxed mb-4">
                  {game.description}
                </p>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onSelectGame(game.id);
                }}
                className="w-full py-2.5 px-4 rounded-xl sm:rounded-2xl bg-[#FFD15C] hover:bg-[#EAB83F] text-[#063F39] font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#FFD15C]/15 active:scale-[0.98]"
              >
                <Play className="w-3.5 h-3.5 fill-[#063F39]" />
                <span>Jogar Agora</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
