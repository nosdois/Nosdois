/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Coins, Check, Lock, Heart, Star, Plus } from 'lucide-react';
import { CoupleProfile, GameStats } from '../../types';
import { sound } from '../../utils/audio';

interface MundinhoGameProps {
  profile: CoupleProfile;
  stats: GameStats;
  onBackToHub: () => void;
  onUpdateCoinsAndItems: (newCoins: number, newItems: string[]) => void;
}

interface IslandItem {
  id: string;
  name: string;
  cost: number;
  icon: string;
  description: string;
  romancePrompt: string;
}

const ALL_ITEMS: IslandItem[] = [
  {
    id: 'casinha',
    name: 'Casinha dos Sonhos',
    cost: 0,
    icon: '🏠',
    description: 'O início do nosso cantinho. Telhado quentinho e paredes cheias de amor.',
    romancePrompt: 'Nosso lar é onde a gente estiver junto.',
  },
  {
    id: 'fogueira',
    name: 'Fogueira Romântica',
    cost: 30,
    icon: '🪵',
    description: 'Noites aconchegantes com marshmallows e conversas até tarde.',
    romancePrompt: 'Histórias contadas sob o luar aquecem a alma.',
  },
  {
    id: 'jardim',
    name: 'Jardim das Promessas',
    cost: 45,
    icon: '🌻',
    description: 'Canteiro com girassóis e rosas que florescem com a nossa sintonia.',
    romancePrompt: 'O amor floresce quando cultivado todos os dias.',
  },
  {
    id: 'banco',
    name: 'Bancinho dos Apaixonados',
    cost: 60,
    icon: '🪑',
    description: 'Um banco de madeira perfeito para sentar de mãos dadas.',
    romancePrompt: 'O melhor lugar do mundo é ao seu lado.',
  },
  {
    id: 'barquinho',
    name: 'Barquinho no Lago',
    cost: 80,
    icon: '⛵',
    description: 'Passeios calmos pelas águas doces com vista para as colinas.',
    romancePrompt: 'Navegando juntos por qualquer tempestade ou calmaria.',
  },
  {
    id: 'varal_luzes',
    name: 'Varal de Luzinhas & Fotos',
    cost: 100,
    icon: '🌟',
    description: 'Luzes cintilantes iluminando memórias inesquecíveis do casal.',
    romancePrompt: 'Cada foto é um momento que guardamos no peito.',
  },
  {
    id: 'piquenique',
    name: 'Piquenique à Luz de Velas',
    cost: 120,
    icon: '🧺',
    description: 'Toalha xadrez, cesta de frutas e olhares apaixonados.',
    romancePrompt: 'Comemorações simples são as mais especiais.',
  },
  {
    id: 'telescopio',
    name: 'Telescópio das Estrelas',
    cost: 150,
    icon: '🔭',
    description: 'Observatório para encontrar a nossa estrela da sorte no céu.',
    romancePrompt: 'Até as estrelas têm inveja do nosso brilho juntos.',
  },
];

export const MundinhoGame: React.FC<MundinhoGameProps> = ({
  profile,
  stats,
  onBackToHub,
  onUpdateCoinsAndItems,
}) => {
  const currentCoins = stats.coins || 0;
  const ownedItems = new Set(stats.mundinhoItems || ['casinha']);
  const [selectedItem, setSelectedItem] = useState<IslandItem>(ALL_ITEMS[0]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const unlockedCount = ownedItems.size;
  const levelTitle =
    unlockedCount >= 7
      ? 'Nível 4 — Paraíso Eterno do Casal 🏰'
      : unlockedCount >= 5
      ? 'Nível 3 — Santuário dos Sonhos 💖'
      : unlockedCount >= 3
      ? 'Nível 2 — Ilha Aconchegante 🌿'
      : 'Nível 1 — Cantinho Inicial 🏕️';

  const handleUnlockItem = (item: IslandItem) => {
    if (ownedItems.has(item.id)) return;
    if (currentCoins < item.cost) {
      sound.playBuzzer();
      setToastMessage(`Faltam ${item.cost - currentCoins} moedas! Joguem mais partidas para conquistar.`);
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    sound.playFanfare();
    const newCoins = currentCoins - item.cost;
    const newItems = [...Array.from(ownedItems), item.id];
    onUpdateCoinsAndItems(newCoins, newItems);
    setToastMessage(`✨ ${item.name} desbloqueado com sucesso para o Nosso Mundinho!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            sound.playClick();
            onBackToHub();
          }}
          className="flex items-center gap-2 text-sm text-[#BBD9D2] hover:text-[#FFFDF7] px-3.5 py-1.5 rounded-full bg-[#082F2B] border border-[#17675C] hover:bg-[#104B43] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Hub</span>
        </button>

        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#082F2B] border border-[#17675C] rounded-full text-xs text-[#FFD15C] font-bold shadow-sm">
          <Coins className="w-4 h-4 text-[#FFD15C]" />
          <span>{currentCoins} Moedas</span>
        </div>
      </div>

      {/* Main Island Showcase Card */}
      <div className="bg-[#082F2B] border border-[#17675C] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#104B43] border border-[#17675C] rounded-full text-xs text-[#FFD15C] font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#FFD15C]" />
          <span>{levelTitle}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#FFFDF7] mb-1">
          Nosso Mundinho
        </h2>
        <p className="text-sm text-[#BBD9D2] max-w-md mx-auto mb-6">
          O cantinho especial de {profile.partner1Name} e {profile.partner2Name}. Usem suas Moedas do Amor para construir e evoluir o espaço a dois!
        </p>

        {/* Floating Island Art */}
        <div className="relative max-w-sm mx-auto mb-6">
          <div className="p-3 bg-[#073630] rounded-3xl border border-[#17675C] shadow-inner relative group">
            <img
              src="./assets/ui/card_mundinho.png"
              alt="Nosso Mundinho - Ilha Flutuante"
              className="w-full h-auto rounded-2xl object-cover shadow-md hover:scale-[1.02] transition-transform"
            />
            {/* Soft ambient badge */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#082F2B]/90 backdrop-blur-md border border-[#17675C] rounded-full text-xs font-bold text-[#FFD15C] shadow-lg whitespace-nowrap">
              {unlockedCount} de {ALL_ITEMS.length} Itens Desbloqueados
            </div>
          </div>
        </div>

        {/* Owned Items Tag Cloud */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {ALL_ITEMS.filter((i) => ownedItems.has(i.id)).map((item) => (
            <span
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="px-3 py-1 bg-[#104B43] border border-[#17675C] hover:border-[#FFD15C] rounded-full text-xs text-[#FFFDF7] font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Item Catalog & Customizer */}
      <div className="bg-[#082F2B] border border-[#17675C] rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#17675C]">
          <div>
            <h3 className="text-lg font-bold text-[#FFFDF7]">
              Decorações & Conquistas da Ilha
            </h3>
            <p className="text-xs text-[#BBD9D2]">
              Desbloqueie com as Moedas acumuladas nas partidas
            </p>
          </div>
          <span className="text-xs text-[#FFD15C] font-bold">
            Saldo: {currentCoins} 🪙
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ALL_ITEMS.map((item) => {
            const isOwned = ownedItems.has(item.id);
            const canAfford = currentCoins >= item.cost;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                  selectedItem.id === item.id
                    ? 'bg-[#104B43] border-[#FFD15C] shadow-md'
                    : isOwned
                    ? 'bg-[#073630] border-[#17675C] hover:border-[#BBD9D2]'
                    : 'bg-[#063F39] border-[#17675C]/50 opacity-90 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="font-bold text-sm text-[#FFFDF7]">{item.name}</span>
                    </div>
                    {isOwned ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#082F2B] border border-[#17675C] text-[#FFD15C] flex items-center gap-1">
                        <Check className="w-3 h-3 text-[#FFD15C]" />
                        <span>Na Ilha</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-extrabold text-[#FFD15C] px-2 py-0.5 bg-[#082F2B] border border-[#17675C] rounded-full">
                        {item.cost} 🪙
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#BBD9D2] mb-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#17675C]/60 flex items-center justify-between">
                  <span className="text-[11px] text-[#8AAFA7] italic">
                    "{item.romancePrompt}"
                  </span>
                  {!isOwned && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnlockItem(item);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        canAfford
                          ? 'bg-[#FFD15C] hover:bg-[#EAB83F] text-[#063F39] shadow-sm'
                          : 'bg-[#104B43] text-[#8AAFA7] border border-[#17675C] cursor-not-allowed'
                      }`}
                    >
                      Desbloquear
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <aside
          role="status"
          className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-[#082F2B] text-[#FFFDF7] px-5 py-3 rounded-2xl shadow-2xl border border-[#FFD15C] animate-bounce text-sm font-semibold max-w-sm text-center"
        >
          {toastMessage}
        </aside>
      )}
    </div>
  );
};
