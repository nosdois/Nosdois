/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Dilemma } from '../types';

export const DILEMMAS_DATA: Dilemma[] = [
  {
    id: 'd1',
    category: 'viagens',
    categoryLabel: 'Viagens & Aventuras',
    title: 'A Viagem Inesperada',
    description: 'Ganhamos duas passagens de primeira classe para embarcar amanhã cedo, com tudo pago por duas semanas!',
    options: [
      { id: 'opt1', text: 'Tóquio, Japão: modernidade, gastronomia de rua e cultura fascinante' },
      { id: 'opt2', text: 'Costa Amalfitana, Itália: passeios de barco, massas frescas e pôr do sol no Mediterrâneo' },
      { id: 'opt3', text: 'Safári no Quênia: natureza selvagem, céu estrelado e cabana de luxo' },
    ],
    insightComment: 'Viajar juntos revela como o casal lida com o desconhecido e o inesperado.',
  },
  {
    id: 'd2',
    category: 'decisoes',
    categoryLabel: 'Decisões & Fortuna',
    title: 'A Loteria dos Sonhos',
    description: 'Acordamos e descobrimos que nosso bilhete da Mega da Virada foi o único premiado com R$ 50 milhões!',
    options: [
      { id: 'opt1', text: 'Comprar uma casa espetacular na praia ou campo e parar de trabalhar imediatamente' },
      { id: 'opt2', text: 'Passar um ano inteiro viajando o mundo sem itinerário fixo antes de qualquer compra' },
      { id: 'opt3', text: 'Investir 90% em silêncio e continuar a vida normal por um ano, sem contar pra ninguém' },
    ],
    insightComment: 'O dinheiro é um amplificador: o que mais importa é o plano que vocês constroem a dois.',
  },
  {
    id: 'd3',
    category: 'rotina',
    categoryLabel: 'Rotina & Convivência',
    title: 'O Domingo das Precatórias',
    description: 'Uma tempestade sem fim cortou a internet e a energia por 12 horas seguidas num domingo.',
    options: [
      { id: 'opt1', text: 'Acender velas, abrir um bom vinho e inventar jogos de tabuleiro ou cartas' },
      { id: 'opt2', text: 'Ficar no quarto conversando sobre a vida, planos futuros e trocando massagens' },
      { id: 'opt3', text: 'Inventar receitas na cozinha com o que tem na geladeira antes que descongele' },
    ],
    insightComment: 'Sem telas, a presença real se torna o melhor entretenimento.',
  },
  {
    id: 'd4',
    category: 'encontros',
    categoryLabel: 'Encontros & Romance',
    title: 'O Encontro Espontâneo',
    description: 'Sexta-feira, 19h: os dois estão cansados do trabalho, mas com vontade de ficar juntos.',
    options: [
      { id: 'opt1', text: 'Banho quente, pijama confortável e pedir a comida favorita no delivery' },
      { id: 'opt2', text: 'Sair arrumados para um barzinho charmoso com música ao vivo para espairecer' },
      { id: 'opt3', text: 'Comprar ingredientes no mercado e cozinhar juntos ouvindo jazz' },
    ],
    insightComment: 'A intimidade é saber quando o corpo pede descanso e quando pede celebração.',
  },
  {
    id: 'd5',
    category: 'engracado',
    categoryLabel: 'Situações Engraçadas',
    title: 'O Dilema da Sobremesa',
    description: 'Sobrou apenas UM pedaço da melhor torta de chocolate na geladeira às 23h.',
    options: [
      { id: 'opt1', text: 'Dividir religiosamente ao meio com régua milimétrica' },
      { id: 'opt2', text: 'Ceder gentilmente o pedaço inteiro para o parceiro' },
      { id: 'opt3', text: 'Disputar num pedra, papel e tesoura emocionante valendo tudo' },
    ],
    insightComment: 'O amor verdadeiro é medido na divisão da última fatia de pizza ou sobremesa!',
  },
  {
    id: 'd6',
    category: 'viagens',
    categoryLabel: 'Viagens & Aventuras',
    title: 'A Cabana Isolada',
    description: 'Recebemos um convite para passar um mês inteiro numa cabana isolada na montanha, cercada por floresta.',
    options: [
      { id: 'opt1', text: 'Topamos na hora! Desconectar do mundo e viver só nós dois é um sonho' },
      { id: 'opt2', text: 'Topamos com uma condição: um final de semana sim, outro voltando pra civilização' },
      { id: 'opt3', text: 'Passamos a vez: a gente ama a agitação, amigos e comodidades urbanas' },
    ],
    insightComment: 'O equilíbrio entre a bolha do casal e a conexão com o mundo social.',
  },
  {
    id: 'd7',
    category: 'decisoes',
    categoryLabel: 'Decisões & Futuro',
    title: 'O Pet Novo',
    description: 'Apareceu um filhote super dócil na nossa porta num dia de chuva.',
    options: [
      { id: 'opt1', text: 'Adotar imediatamente e já escolher o nome mais fofo do mundo' },
      { id: 'opt2', text: 'Cuidar por alguns dias até achar um lar confiável, pois nossa rotina é corrida' },
      { id: 'opt3', text: 'Consultar nossas finanças e espaço antes de tomar qualquer decisão' },
    ],
    insightComment: 'Animais de estimação trazem alegria e exigem alinhamento sobre responsabilidades.',
  },
  {
    id: 'd8',
    category: 'rotina',
    categoryLabel: 'Rotina & Convivência',
    title: 'A Mansão dos Sonhos',
    description: 'Podemos escolher um cômodo ou espaço de luxo na nossa casa ideal:',
    options: [
      { id: 'opt1', text: 'Um cinema particular com poltronas reclináveis e som de alta fidelidade' },
      { id: 'opt2', text: 'Uma área gourmet dos sonhos com piscina aquecida e jardim de inverno' },
      { id: 'opt3', text: 'Um spa privativo com hidromassagem gigante e sauna' },
    ],
    insightComment: 'Sonhar com o espaço ideal revela o que vocês mais valorizam no descanso.',
  },
  {
    id: 'd9',
    category: 'encontros',
    categoryLabel: 'Encontros & Romance',
    title: 'A Máquina do Tempo',
    description: 'Temos uma viagem no tempo garantida para reviver um momento juntos:',
    options: [
      { id: 'opt1', text: 'O exato dia em que nos vimos ou conversamos pela primeira vez' },
      { id: 'opt2', text: 'O nosso primeiro beijo de tirar o fôlego' },
      { id: 'opt3', text: 'A viagem mais divertida e inesquecível que já fizemos' },
    ],
    insightComment: 'Revisitar memórias reacende as mesmas faíscas que juntaram vocês.',
  },
  {
    id: 'd10',
    category: 'engracado',
    categoryLabel: 'Situações Engraçadas',
    title: 'O Reality Show',
    description: 'Fomos selecionados para um reality show de casais com prêmio milionário na TV aberta!',
    options: [
      { id: 'opt1', text: 'Aceitamos! Somos o casal mais carismático e vamos nos divertir muito' },
      { id: 'opt2', text: 'Nem pensar! Preservar nossa privacidade e sanidade mental vale ouro' },
      { id: 'opt3', text: 'Só se o cachê for pago antes da estreia ir ao ar' },
    ],
    insightComment: 'Rir das pressões externas é um dos melhores escudos de um relacionamento.',
  },
];
