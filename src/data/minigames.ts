/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MinigameInfo } from '../types';

export const MINIGAMES_LIST: MinigameInfo[] = [
  {
    id: 'reflexos',
    title: 'Teste de Reflexos',
    subtitle: 'Quem reage mais rápido ao toque?',
    description: 'Aguarde o sinal visual mudar para o coração brilhante. Quem tocar na sua metade da tela primeiro vence a rodada!',
    iconName: 'Zap',
    roundsCount: 3,
  },
  {
    id: 'memoria',
    title: 'Desafio de Memória',
    subtitle: 'Encontre os pares românticos',
    description: 'Virem as cartas e encontrem os pares de símbolos românticos. Cada par correto soma pontos para o jogador da vez.',
    iconName: 'Brain',
    roundsCount: 6,
  },
  {
    id: 'sequencia',
    title: 'Sequências de Símbolos',
    subtitle: 'Quem tem a melhor memória visual?',
    description: 'Observe a ordem em que os 4 símbolos iluminam e emitem sons. Repita a sequência exata. A sequência aumenta a cada acerto!',
    iconName: 'Sparkles',
    roundsCount: 4,
  },
  {
    id: 'observacao',
    title: 'Desafio de Observação',
    subtitle: 'Ache o símbolo intruso na tela',
    description: 'Uma grade cheia de ícones quase idênticos. Apenas UM é diferente! Quem encontrar mais rápido pontua.',
    iconName: 'Eye',
    roundsCount: 3,
  },
  {
    id: 'adivinhacao',
    title: 'Adivinhação a Dois',
    subtitle: 'Explique sem falar as palavras proibidas',
    description: 'Um jogador descreve uma palavra para o parceiro adivinhar em 45 segundos, sem usar as 3 palavras proibidas listadas na carta!',
    iconName: 'MessageCircle',
    roundsCount: 4,
  },
];

export const GUESSING_CARDS = [
  {
    word: 'PRIMEIRO BEIJO',
    taboo: ['Boca', 'Lábios', 'Encontro'],
  },
  {
    word: 'ALIANÇA',
    taboo: ['Dedo', 'Ouro', 'Casamento'],
  },
  {
    word: 'JANTAR ROMÂNTICO',
    taboo: ['Vela', 'Comida', 'Restaurante'],
  },
  {
    word: 'CAFÉ NA CAMA',
    taboo: ['Manhã', 'Acordar', 'Bandeja'],
  },
  {
    word: 'LUA DE MEL',
    taboo: ['Viagem', 'Casal', 'Hotel'],
  },
  {
    word: 'PIQUE-NIQUE',
    taboo: ['Parque', 'Toalha', 'Cesta'],
  },
  {
    word: 'SERENATA',
    taboo: ['Música', 'Violão', 'Janela'],
  },
  {
    word: 'MASSAGEM',
    taboo: ['Costas', 'Óleo', 'Relaxar'],
  },
];

export const MEMORY_ICONS = ['💖', '🌹', '✨', '🥂', '💌', '🎁', '🍫', '💍'];

export const SEQUENCE_SYMBOLS = [
  { id: 'heart', symbol: '💖', label: 'Coração', color: 'from-pink-500 to-rose-500', freq: 440 },
  { id: 'star', symbol: '⭐', label: 'Estrela', color: 'from-amber-400 to-yellow-500', freq: 554.37 },
  { id: 'rose', symbol: '🌹', label: 'Rosa', color: 'from-red-500 to-rose-600', freq: 659.25 },
  { id: 'sparkle', symbol: '✨', label: 'Brilho', color: 'from-purple-500 to-indigo-500', freq: 880 },
];
