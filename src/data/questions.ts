/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question } from '../types';

export const QUESTIONS_DATA: Question[] = [
  // Romântico
  {
    id: 'q1',
    category: 'romantico',
    categoryLabel: 'Romântico',
    text: 'Qual seria o nosso encontro perfeito dos sonhos?',
    options: [
      { id: 'a', text: 'Jantar à luz de velas num restaurante sofisticado' },
      { id: 'b', text: 'Piquenique no pôr do sol com vinho e queijos' },
      { id: 'c', text: 'Noite de filmes, mantinha e pizza no sofá' },
      { id: 'd', text: 'Passeio espontâneo numa cidadezinha de serra' },
    ],
    chatPrompt: 'Qual é a lembrança mais marcante de um encontro que já tivemos?',
  },
  {
    id: 'q2',
    category: 'romantico',
    categoryLabel: 'Romântico',
    text: 'Qual é a minha linguagem do amor preferida para receber carinho?',
    options: [
      { id: 'a', text: 'Toque físico (abraços, cafuné, beijos)' },
      { id: 'b', text: 'Palavras de afirmação e elogios sinceros' },
      { id: 'c', text: 'Tempo de qualidade sem celular por perto' },
      { id: 'd', text: 'Atos de serviço e pequenos cuidados no dia a dia' },
    ],
    chatPrompt: 'Você sente que expressamos carinho do jeito que o outro mais gosta?',
  },
  {
    id: 'q3',
    category: 'romantico',
    categoryLabel: 'Romântico',
    text: 'O que mais me chamou a atenção em você quando nos conhecemos?',
    options: [
      { id: 'a', text: 'O seu sorriso e o jeito de olhar' },
      { id: 'b', text: 'O senso de humor e a risada solta' },
      { id: 'c', text: 'A inteligência e o assunto gostoso' },
      { id: 'd', text: 'A energia acolhedora e a leveza' },
    ],
    chatPrompt: 'Você lembra qual foi a primeira frase exata que dissemos um ao outro?',
  },
  {
    id: 'q4',
    category: 'romantico',
    categoryLabel: 'Romântico',
    text: 'Se fôssemos viajar amanhã sem pensar em orçamento, para onde eu escolheria?',
    options: [
      { id: 'a', text: 'Bangalô sobre a água nas Maldivas' },
      { id: 'b', text: 'Chalé com lareira e neve nos Alpes Suíços' },
      { id: 'c', text: 'Roteiro gastronômico e histórico pela Itália' },
      { id: 'd', text: 'Praia paradisíaca e tranquila no Nordeste' },
    ],
    chatPrompt: 'Vamos planejar um final de semana especial nos próximos meses?',
  },
  {
    id: 'q5',
    category: 'romantico',
    categoryLabel: 'Romântico',
    text: 'Qual música ou estilo musical melhor descreve a nossa história juntos?',
    options: [
      { id: 'a', text: 'Uma MPB suave e apaixonada' },
      { id: 'b', text: 'Um pop ou indie animado e solar' },
      { id: 'c', text: 'Um clássico acústico nostálgico' },
      { id: 'd', text: 'Um pagode ou sertanejo cheio de sentimento' },
    ],
    chatPrompt: 'Existe uma música que quando toca você imediatamente lembra de mim?',
  },
  {
    id: 'q6',
    category: 'romantico',
    categoryLabel: 'Romântico',
    text: 'Qual pequeno gesto seu sempre derrete meu coração?',
    options: [
      { id: 'a', text: 'Trazer um café ou docinho de surpresa' },
      { id: 'b', text: 'Me abraçar por trás enquanto faço algo' },
      { id: 'c', text: 'Mandar mensagem no meio do dia só pra dizer que me ama' },
      { id: 'd', text: 'Fazer cafuné até eu pegar no sono' },
    ],
    chatPrompt: 'Qual gesto você gostaria que eu fizesse mais vezes para você?',
  },

  // Cotidiano
  {
    id: 'q7',
    category: 'cotidiano',
    categoryLabel: 'Cotidiano',
    text: 'Num domingo chuvoso, o que eu prefiro fazer?',
    options: [
      { id: 'a', text: 'Maratonar uma série debaixo do cobertor' },
      { id: 'b', text: 'Cozinhar uma receita caprichada juntos' },
      { id: 'c', text: 'Tirar uma soneca daquelas que acorda sem saber o ano' },
      { id: 'd', text: 'Ler um livro ou jogar ouvindo o som da chuva' },
    ],
    chatPrompt: 'Qual é o nosso domingo ideal juntos quando a semana foi pesada?',
  },
  {
    id: 'q8',
    category: 'cotidiano',
    categoryLabel: 'Cotidiano',
    text: 'Qual é a minha comida afetiva número 1 no mundo?',
    options: [
      { id: 'a', text: 'Pizza quentinha de massa artesanal' },
      { id: 'b', text: 'Hambúrguer suculento com batata frita' },
      { id: 'c', text: 'Comida japonesa (sushi e sashimi)' },
      { id: 'd', text: 'Massa caseira com bastante queijo' },
    ],
    chatPrompt: 'Qual prato eu preparo que você mais gosta de comer?',
  },
  {
    id: 'q9',
    category: 'cotidiano',
    categoryLabel: 'Cotidiano',
    text: 'Ao acordar pela manhã, qual é o meu primeiro hábito?',
    options: [
      { id: 'a', text: 'Ficar uns minutinhos na cama checando o celular' },
      { id: 'b', text: 'Levantar direto e ir preparar um café' },
      { id: 'c', text: 'Procurar você para dar um abraço de bom dia' },
      { id: 'd', text: 'Apertar a soneca pelo menos duas vezes' },
    ],
    chatPrompt: 'Como podemos deixar as nossas manhãs mais leves e gostosas?',
  },
  {
    id: 'q10',
    category: 'cotidiano',
    categoryLabel: 'Cotidiano',
    text: 'Qual tarefa doméstica eu prefiro evitar a todo custo?',
    options: [
      { id: 'a', text: 'Lavar uma pia cheia de louça engordurada' },
      { id: 'b', text: 'Passar roupa ou dobrar lençol de elástico' },
      { id: 'c', text: 'Tirar pó e varrer cantos da casa' },
      { id: 'd', text: 'Limpar o banheiro detalhadamente' },
    ],
    chatPrompt: 'Como está nossa divisão de tarefas hoje? Tem algo que podemos ajustar?',
  },
  {
    id: 'q11',
    category: 'cotidiano',
    categoryLabel: 'Cotidiano',
    text: 'Quando fico estressado(a) com a rotina, o que mais me acalma?',
    options: [
      { id: 'a', text: 'Um abraço longo em silêncio' },
      { id: 'b', text: 'Desabafar tudo e ser ouvido(a) com atenção' },
      { id: 'c', text: 'Um momento sozinho(a) para respirar e reiniciar' },
      { id: 'd', text: 'Comer algo muito gostoso e rir de bobagens' },
    ],
    chatPrompt: 'O que eu posso fazer quando perceber que você está num dia difícil?',
  },

  // Engraçado
  {
    id: 'q12',
    category: 'engracado',
    categoryLabel: 'Engraçado',
    text: 'Qual é a minha maior mania ou maniazinha esquisita?',
    options: [
      { id: 'a', text: 'Organizar as coisas de um jeito muito específico' },
      { id: 'b', text: 'Falar com animais como se fossem bebês' },
      { id: 'c', text: 'Cantar inventando letras malucas para músicas' },
      { id: 'd', text: 'Fazer barulhinhos ou danças do nada em casa' },
    ],
    chatPrompt: 'Qual é uma mania minha que você acha fofa mesmo sendo boba?',
  },
  {
    id: 'q13',
    category: 'engracado',
    categoryLabel: 'Engraçado',
    text: 'Se eu pudesse escolher um superpoder inútil, qual seria?',
    options: [
      { id: 'a', text: 'Sempre acertar de primeira qual lado conectar o cabo USB' },
      { id: 'b', text: 'A comida nunca esfriar antes de terminar o prato' },
      { id: 'c', text: 'Fazer o parceiro rir instantaneamente em qualquer DR' },
      { id: 'd', text: 'Nunca esquecer onde deixei a chave, óculos ou celular' },
    ],
    chatPrompt: 'Quem de nós dois perde mais coisas pela casa?',
  },
  {
    id: 'q14',
    category: 'engracado',
    categoryLabel: 'Engraçado',
    text: 'Num apocalipse zumbi, qual seria o meu destino mais provável?',
    options: [
      { id: 'a', text: 'O cérebro estratégico que monta a base secreta' },
      { id: 'b', text: 'A primeira pessoa a ser mordida por tentar acariciar um zumbi fofo' },
      { id: 'c', text: 'O sobrevivente implacável que cuida de nós dois' },
      { id: 'd', text: 'Aquele que reclama que o apocalipse não tem café com leite' },
    ],
    chatPrompt: 'Se o mundo acabasse hoje, qual seria o nosso último banquete?',
  },
  {
    id: 'q15',
    category: 'engracado',
    categoryLabel: 'Engraçado',
    text: 'Quem demora mais tempo para se arrumar antes de sair?',
    options: [
      { id: 'a', text: 'Com certeza eu, gosto de cada detalhe impecável' },
      { id: 'b', text: 'Claramente você, sempre diz que são 5 minutos e passam 30' },
      { id: 'c', text: 'Empate técnico: os dois enrolam no mesmo nível' },
      { id: 'd', text: 'Nenhum dos dois, somos rápidos e práticos' },
    ],
    chatPrompt: 'Lembra de alguma vez que nos atrasamos por um motivo cômico?',
  },

  // Personalidade
  {
    id: 'q16',
    category: 'personalidade',
    categoryLabel: 'Personalidade',
    text: 'Em situações de decisão rápida, qual é a minha postura?',
    options: [
      { id: 'a', text: 'Totalmente racional, peso prós e contras na hora' },
      { id: 'b', text: 'Intuitivo(a), sigo meu pressentimento do estômago' },
      { id: 'c', text: 'Gosto de consultar você antes de bater o martelo' },
      { id: 'd', text: 'Adio a decisão até o último minuto possível' },
    ],
    chatPrompt: 'Qual foi a decisão mais acertada que tomamos juntos até hoje?',
  },
  {
    id: 'q17',
    category: 'personalidade',
    categoryLabel: 'Personalidade',
    text: 'Qual qualidade sua eu mais admiro no fundo do peito?',
    options: [
      { id: 'a', text: 'Sua determinação e garra para conquistar seus sonhos' },
      { id: 'b', text: 'Sua empatia e carinho genuíno com as pessoas' },
      { id: 'c', text: 'Sua lealdade e a sensação de segurança que me traz' },
      { id: 'd', text: 'Sua leveza e capacidade de transformar qualquer dia num bom momento' },
    ],
    chatPrompt: 'Olhando nos olhos agora: o que você mais admira em mim?',
  },
  {
    id: 'q18',
    category: 'personalidade',
    categoryLabel: 'Personalidade',
    text: 'Qual é o meu maior sonho pessoal para os próximos anos?',
    options: [
      { id: 'a', text: 'Conquistar nossa estabilidade financeira e casa própria' },
      { id: 'b', text: 'Viajar o mundo e colecionar carimbos no passaporte' },
      { id: 'c', text: 'Ter sucesso profissional naquilo que realmente amo' },
      { id: 'd', text: 'Construir uma família com muita paz, saúde e união' },
    ],
    chatPrompt: 'Como podemos nos apoiar ainda mais nesse sonho neste ano?',
  },
  {
    id: 'q19',
    category: 'personalidade',
    categoryLabel: 'Personalidade',
    text: 'Como eu reajo quando sou surpreendido(a) com algo bom?',
    options: [
      { id: 'a', text: 'Fico com um sorriso tímido e bochechas coradas' },
      { id: 'b', text: 'Dou pulinhos de alegria e abraço forte' },
      { id: 'c', text: 'Fico sem palavras e emocionado(a)' },
      { id: 'd', text: 'Quero compartilhar a história com todo mundo' },
    ],
    chatPrompt: 'Qual foi a surpresa que eu fiz que você mais gostou?',
  },
  {
    id: 'q20',
    category: 'personalidade',
    categoryLabel: 'Personalidade',
    text: 'O que mais me faz sentir orgulho da nossa relação?',
    options: [
      { id: 'a', text: 'A nossa cumplicidade e amizade profunda' },
      { id: 'b', text: 'A forma como superamos desafios sem nos machucar' },
      { id: 'c', text: 'O carinho que não esfria com o passar do tempo' },
      { id: 'd', text: 'A liberdade de sermos 100% nós mesmos um com o outro' },
    ],
    chatPrompt: 'O que nós dois aprendemos de mais valioso um com o outro?',
  },
];
