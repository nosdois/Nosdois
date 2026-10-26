/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RealLifeChallenge } from '../types';

export const REAL_LIFE_CHALLENGES: RealLifeChallenge[] = [
  // Românticos
  {
    id: 'rl1',
    category: 'romantico',
    categoryLabel: 'Romântico',
    title: 'O Olhar dos 60 Segundos',
    description: 'Um exercício clássico de conexão profunda e intimidade sem palavras.',
    steps: [
      'Sentem-se frente a frente, confortáveis e próximos.',
      'Iniciem o cronômetro de 60 segundos.',
      'Olhem nos olhos um do outro em silêncio absoluto até o alarme tocar.',
      'Se der vontade de rir ou sorrir, tudo bem! Deixem as emoções fluírem.',
      'Ao final, deem um abraço demorado e compartilhem o que sentiram.',
    ],
    durationMinutes: 2,
    hasTimer: true,
  },
  {
    id: 'rl2',
    category: 'romantico',
    categoryLabel: 'Romântico',
    title: 'Três Elogios Incomuns',
    description: 'Surpreenda seu parceiro(a) com detalhes que você repara e que quase ninguém nota.',
    steps: [
      'Jogador 1 diz 3 elogios específicos e profundos para o Jogador 2 (não vale apenas "você é lindo(a)").',
      'Exemplos: o jeito que você ri com os olhos, sua dedicação em ajudar alguém, seu entusiasmo contando uma história.',
      'Depois, invertam os papéis.',
      'Recebam os elogios sem timidez!',
    ],
    durationMinutes: 3,
    hasTimer: false,
  },
  {
    id: 'rl3',
    category: 'romantico',
    categoryLabel: 'Romântico',
    title: 'Dança Lenta na Sala',
    description: 'Transformem a sala num salão de dança particular.',
    steps: [
      'Escolham uma música romântica especial para vocês dois no celular.',
      'Coloquem o som para tocar, fiquem de pé e abracem-se.',
      'Dancem abraçadinhos no ritmo da música até o final da faixa.',
      'Vale sussurrar algo bonito no ouvido do parceiro.',
    ],
    durationMinutes: 4,
    hasTimer: true,
  },
  {
    id: 'rl4',
    category: 'romantico',
    categoryLabel: 'Romântico',
    title: 'Troca de Cafuné & Massagem Express',
    description: 'Alívio da tensão do dia e carinho físico restaurador.',
    steps: [
      'Jogador 1 recebe 2 minutos de massagem nos ombros ou cafuné do Jogador 2.',
      'Depois, troquem de lugar e invertam!',
      'Fechem os olhos e aproveitem o toque afetuoso.',
    ],
    durationMinutes: 4,
    hasTimer: true,
  },

  // Engraçados
  {
    id: 'rl5',
    category: 'engracado',
    categoryLabel: 'Engraçado',
    title: 'Não Pode Rir!',
    description: 'O teste definitivo de autocontrole e caretas hilárias.',
    steps: [
      'Fiquem um de frente para o outro.',
      'Iniciem a contagem regressiva de 45 segundos.',
      'Jogador 1 tenta fazer o Jogador 2 rir usando caretas, imitações e sons (sem tocar no outro).',
      'Se quem estiver aguentando rir ou sorrir, ponto para quem fez a careta!',
      'Em seguida, invertam os papéis para o troco.',
    ],
    durationMinutes: 2,
    hasTimer: true,
  },
  {
    id: 'rl6',
    category: 'engracado',
    categoryLabel: 'Engraçado',
    title: 'Imitação do Parceiro',
    description: 'Uma paródia carinhosa dos hábitos mais engraçados um do outro.',
    steps: [
      'Jogador 1 deve encenar durante 1 minuto o jeito como o Jogador 2 acorda, pede comida ou se arruma para sair.',
      'Depois, Jogador 2 faz a réplica imitando um hábito do Jogador 1.',
      'Riam das próprias manias com muito bom humor.',
    ],
    durationMinutes: 3,
    hasTimer: true,
  },

  // Criativos
  {
    id: 'rl7',
    category: 'criativo',
    categoryLabel: 'Criativo',
    title: 'Retrato Cego em 60 Segundos',
    description: 'Desenhe o amor da sua vida sem poder olhar para o papel!',
    steps: [
      'Peguem uma folha de papel e uma caneta (ou usem um aplicativo de desenho).',
      'Jogador 1 olha fixamente para o rosto do Jogador 2 e desenha seu retrato em 60 segundos SEM olhar para a folha!',
      'Depois, Jogador 2 faz o mesmo desenhando o Jogador 1.',
      'Revelem as "obras de arte" e assinem os quadros.',
    ],
    durationMinutes: 3,
    hasTimer: true,
  },
  {
    id: 'rl8',
    category: 'criativo',
    categoryLabel: 'Criativo',
    title: 'O Aperitivo Surpresa',
    description: 'Criem um lanchinho especial usando apenas o que já existe na cozinha.',
    steps: [
      'Vão até a cozinha juntos por 5 minutos.',
      'Montem um petisco saboroso para dividirem (pão com azeite e ervas, frutas cortadas, pipoca temperada).',
      'Sirvam um na boca do outro como degustação gourmet!',
    ],
    durationMinutes: 5,
    hasTimer: true,
  },

  // Memória & Observação
  {
    id: 'rl9',
    category: 'memoria',
    categoryLabel: 'Memória e Observação',
    title: 'O Teste de Costas',
    description: 'Será que você sabe de cabeça cada detalhe do parceiro agora?',
    steps: [
      'Fiquem de costas um para o outro.',
      'Jogador 1 pergunta: "De que cor é a minha meia?", "Qual acessório estou usando?", "Qual o padrão da minha roupa?".',
      'Jogador 2 tenta responder sem se virar.',
      'Depois, invertam! Quem acertar mais detalhes ganha um mimo.',
    ],
    durationMinutes: 3,
    hasTimer: false,
  },
  {
    id: 'rl10',
    category: 'memoria',
    categoryLabel: 'Memória e Observação',
    title: 'Linha do Tempo das Memórias',
    description: 'Reconstruam a cronologia da história de vocês.',
    steps: [
      'Tentem lembrar em conjunto: onde foi o primeiro encontro? Qual roupa cada um usava?',
      'Quem pediu o telefone de quem? Qual foi a primeira viagem que fizeram?',
      'Relembrem 3 momentos em que caíram na gargalhada juntos.',
    ],
    durationMinutes: 5,
    hasTimer: false,
  },

  // Conhecimento Mútuo
  {
    id: 'rl11',
    category: 'conhecimento',
    categoryLabel: 'Conhecimento Mútuo',
    title: 'O Desejo Secreto do Ano',
    description: 'Compartilhem algo que ainda querem realizar juntos nos próximos meses.',
    steps: [
      'Cada um escreve num papel (ou nas notas do celular) uma coisa simples e divertida que gostaria de fazer a dois nos próximos 6 meses.',
      'Mostrem ao mesmo tempo.',
      'Combinem agora uma data ou o primeiro passo para tirar a ideia do papel.',
    ],
    durationMinutes: 4,
    hasTimer: false,
  },
  {
    id: 'rl12',
    category: 'conhecimento',
    categoryLabel: 'Conhecimento Mútuo',
    title: 'A Lista da Gratidão a Dois',
    description: 'Reconhecer as pequenas vitórias e o suporte mútuo.',
    steps: [
      'Alternadamente, cada um diz 2 coisas pelas quais é muito grato ao parceiro nesta semana.',
      'Pode ser desde um abraço carinhoso até a ajuda com as coisas da casa ou do trabalho.',
      'Finalizem com um brinde ou um beijo carinhoso.',
    ],
    durationMinutes: 3,
    hasTimer: false,
  },

  // Encontros & Atividades
  {
    id: 'rl13',
    category: 'encontros',
    categoryLabel: 'Encontros e Atividades',
    title: 'O Próximo Encontro Secreto',
    description: 'Um de vocês será o mestre de cerimônias do próximo date!',
    steps: [
      'Tirem cara ou coroa ou decidam quem organiza o próximo encontro da semana.',
      'Quem vencer tem a missão de escolher o local ou preparar a noite sem revelar o destino até a hora H!',
      'O outro só precisa comparecer e se deixar surpreender.',
    ],
    durationMinutes: 3,
    hasTimer: false,
  },
  {
    id: 'rl14',
    category: 'encontros',
    categoryLabel: 'Encontros e Atividades',
    title: 'Foto Espontânea do Momento',
    description: 'Registrem o agora sem filtros ou preocupações com pose perfeita.',
    steps: [
      'Peguem a câmera do celular agora.',
      'Tirem uma selfie espontânea fazendo uma careta engraçada ou um beijo carinhoso.',
      'Salvem essa foto num álbum dedicado apenas para memórias dos jogos Nós Dois.',
    ],
    durationMinutes: 2,
    hasTimer: false,
  },
];
