export type Category = "todos" | "natureza" | "praia" | "cultura";
export type Region = "todas" | "europa" | "asia" | "americas";
export type Destination = {
  id: string;
  name: string;
  country: string;
  image: string;
  alt: string;
  category: Exclude<Category, "todos">;
  region: Exclude<Region, "todas">;
  days: number;
  tagline: string;
  description: string;
  highlights: string[];
  bestTime: string;
  itinerary: { day: string; title: string; description: string }[];
};
export type Guide = {
  id: string;
  title: string;
  kicker: string;
  readTime: string;
  image: string;
  alt: string;
  paragraphs: string[];
};
export const categories: {
  id: Category;
  label: string;
  icon: "globe" | "mountain" | "wave" | "compass";
}[] = [
  { id: "todos", label: "Sugestões de viagem", icon: "globe" },
  { id: "natureza", label: "Na natureza", icon: "mountain" },
  { id: "praia", label: "Perto do mar", icon: "wave" },
  { id: "cultura", label: "Novas culturas", icon: "compass" },
];
export const destinations: Destination[] = [
  {
    id: "alpes",
    name: "Alpes suíços",
    country: "Suíça",
    image: "/images/travel/alpine.webp",
    alt: "Lago alpino turquesa cercado por montanhas na Suíça",
    category: "natureza",
    region: "europa",
    days: 7,
    tagline: "Lagos que parecem impossíveis.",
    bestTime: "Junho a setembro",
    description:
      "Trilhas sem pressa, vilarejos de madeira e lagos de um azul que a foto não explica. Uma viagem para trocar o barulho da cidade pelo som da água.",
    highlights: [
      "Lago Oeschinen",
      "Trilhas nos Alpes",
      "Vilarejos de montanha",
    ],
    itinerary: [
      {
        day: "01–02",
        title: "Chegar e desacelerar",
        description:
          "Conheça Interlaken, caminhe às margens dos lagos e se acostume ao ritmo da montanha.",
      },
      {
        day: "03–05",
        title: "Dias lá em cima",
        description:
          "Explore Oeschinen e as trilhas da região. Reserve tempo para o clima mudar e para simplesmente ficar.",
      },
      {
        day: "06–07",
        title: "Um último olhar",
        description:
          "Passe por Lauterbrunnen, suas cachoeiras e vilarejos antes de voltar.",
      },
    ],
  },
  {
    id: "lisboa",
    name: "Lisboa",
    country: "Portugal",
    image: "/images/travel/lisbon.webp",
    alt: "Bonde amarelo em uma rua tradicional de Lisboa",
    category: "cultura",
    region: "europa",
    days: 5,
    tagline: "A cidade que se descobre a pé.",
    bestTime: "Abril a junho · setembro a outubro",
    description:
      "Entre uma ladeira e um café, Lisboa revela azulejos, miradouros e mesas cheias de histórias. Vá sem um mapa rígido: os desvios fazem parte.",
    highlights: [
      "Alfama e seus miradouros",
      "Sabores portugueses",
      "Um dia em Sintra",
    ],
    itinerary: [
      {
        day: "01–02",
        title: "Entre bairros e miradouros",
        description:
          "Explore Alfama, Graça e Baixa, parando para um café quando a cidade pedir.",
      },
      {
        day: "03",
        title: "O dia de Sintra",
        description:
          "Conheça os jardins e palácios de Sintra. Reserve as entradas e vá de trem.",
      },
      {
        day: "04–05",
        title: "À beira do Tejo",
        description:
          "Passe por Belém, prove os sabores locais e termine com um pôr do sol junto ao rio.",
      },
    ],
  },
  {
    id: "kyoto",
    name: "Kyoto",
    country: "Japão",
    image: "/images/travel/kyoto.webp",
    alt: "Pagode japonês entre as ruas tradicionais de Kyoto",
    category: "cultura",
    region: "asia",
    days: 8,
    tagline: "Beleza nos pequenos rituais.",
    bestTime: "Março a maio · outubro a novembro",
    description:
      "Jardins silenciosos, casas de chá e caminhos que guardam séculos. Em Kyoto, os detalhes merecem tempo — e a viagem ganha outro ritmo.",
    highlights: [
      "Templos e jardins",
      "Caminhos de Higashiyama",
      "Cultura do chá",
    ],
    itinerary: [
      {
        day: "01–03",
        title: "O Japão dos detalhes",
        description:
          "Caminhe por Higashiyama e Gion. Faça as visitas mais populares cedo e respeite as áreas privadas.",
      },
      {
        day: "04–06",
        title: "Verde e contemplação",
        description:
          "Descubra Arashiyama, jardins de templo e uma experiência de chá.",
      },
      {
        day: "07–08",
        title: "Além de Kyoto",
        description:
          "Explore Nara em uma viagem de um dia e deixe a última tarde livre para seu lugar favorito.",
      },
    ],
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonésia",
    image: "/images/travel/bali.webp",
    alt: "Paisagem costeira de Bali com falésias e mar azul",
    category: "praia",
    region: "asia",
    days: 10,
    tagline: "Um encontro com o lado de fora.",
    bestTime: "Maio a setembro",
    description:
      "Acordar com luz bonita, cruzar arrozais e terminar o dia perto do mar. Bali é um convite para escolher menos lugares e viver mais cada um deles.",
    highlights: ["Arrozais de Ubud", "Costa de Uluwatu", "Templos e culinária"],
    itinerary: [
      {
        day: "01–04",
        title: "O verde de Ubud",
        description:
          "Explore os arrozais, os mercados e os templos. Reserve dias com tempo para descansar.",
      },
      {
        day: "05–07",
        title: "Caminhos da ilha",
        description:
          "Conheça o interior com um guia local e faça uma pausa para descobrir a cozinha balinesa.",
      },
      {
        day: "08–10",
        title: "Dias de mar",
        description:
          "Termine em Uluwatu, entre falésias, praias e o pôr do sol. Observe as condições do mar.",
      },
    ],
  },
  {
    id: "islandia",
    name: "Islândia",
    country: "Islândia",
    image: "/images/travel/iceland.webp",
    alt: "Cachoeira Skógafoss cercada por uma paisagem verde na Islândia",
    category: "natureza",
    region: "europa",
    days: 9,
    tagline: "A natureza escreve as regras.",
    bestTime: "Junho a agosto · inverno para auroras",
    description:
      "Cachoeiras, praias negras e horizontes enormes. Um roteiro de estrada com margem para o clima, os encontros e aquelas paradas que não estavam no plano.",
    highlights: ["Costa sul", "Cachoeiras e vulcões", "Estradas panorâmicas"],
    itinerary: [
      {
        day: "01–03",
        title: "Começar pelo sul",
        description:
          "Saia de Reykjavík rumo às cachoeiras e à costa sul, conferindo as condições da estrada.",
      },
      {
        day: "04–06",
        title: "Entre gelo e mar",
        description:
          "Explore Vík e a lagoa glacial. Mantenha distância segura das ondas nas praias.",
      },
      {
        day: "07–09",
        title: "Voltar por outros caminhos",
        description:
          "Dedique os últimos dias ao Círculo Dourado e às piscinas termais.",
      },
    ],
  },
  {
    id: "rio",
    name: "Rio de Janeiro",
    country: "Brasil",
    image: "/images/travel/rio.webp",
    alt: "Praia de Ipanema e o Morro Dois Irmãos no Rio de Janeiro",
    category: "praia",
    region: "americas",
    days: 5,
    tagline: "A cidade encontra o mar.",
    bestTime: "Abril a junho · agosto a outubro",
    description:
      "Um café depois da praia, um caminho com vista e o pôr do sol que vira programa. No Rio, a paisagem se mistura com a vida da cidade.",
    highlights: ["Praias da zona sul", "Trilhas com vista", "Santa Teresa"],
    itinerary: [
      {
        day: "01–02",
        title: "O ritmo da praia",
        description:
          "Conheça Ipanema e Copacabana, caminhe pela orla e veja o pôr do sol no Arpoador.",
      },
      {
        day: "03",
        title: "A cidade lá de cima",
        description:
          "Visite o Pão de Açúcar e escolha uma trilha guiada adequada ao seu nível.",
      },
      {
        day: "04–05",
        title: "Entre arte e sabores",
        description:
          "Explore Santa Teresa, os museus e a culinária carioca. Termine com um dia livre.",
      },
    ],
  },
];
export const guides: Guide[] = [
  {
    id: "leve",
    title: "O que levar. E o que deixar.",
    kicker: "NA BAGAGEM",
    readTime: "4 min de leitura",
    image: "/images/travel/coast.webp",
    alt: "Vista aérea de um barco no mar azul da costa de Amalfi",
    paragraphs: [
      "Uma boa mala começa com uma pergunta: como você quer passar seus dias? Trilhas, cidades e praia pedem escolhas diferentes. Pense no roteiro antes de pensar no número de peças.",
      "Prefira camadas, peças que combinam entre si e um calçado já usado. Uma pequena bolsa para os passeios ajuda a deixar o restante na hospedagem. O espaço vazio é tão útil quanto o que você leva.",
      "Documentos, medicamentos de uso pessoal e uma muda de roupa ficam na bagagem de mão. Confira as regras da companhia e os requisitos do destino antes de sair.",
      "Deixe um pouco da pressa em casa. Nem toda hora precisa de um plano e nem todo lugar precisa de uma foto. A melhor lembrança pode ser justamente o que você viveu sem registrar.",
    ],
  },
  {
    id: "tempo",
    title: "Viajar devagar muda tudo.",
    kicker: "OUTRO RITMO",
    readTime: "5 min de leitura",
    image: "/images/travel/kyoto.webp",
    alt: "Rua tradicional de Kyoto para explorar a pé",
    paragraphs: [
      "É tentador transformar uma viagem em uma lista de lugares. Mas ficar um pouco mais muda a relação com um destino: você encontra uma padaria favorita, reconhece uma rua e descobre como o bairro acorda.",
      "Escolha menos bases e reduza os deslocamentos. Um dia livre no meio do roteiro abre espaço para o clima, o cansaço e os encontros. A viagem deixa de ser uma corrida entre reservas.",
      "Caminhe, use transporte local e experimente lugares fora dos horários mais cheios. Pergunte, observe e respeite os costumes. Seu tempo pode ajudar a fazer escolhas mais conscientes.",
      "Viajar devagar não exige uma viagem longa. Exige decidir o que merece atenção. Às vezes, uma tarde no mesmo lugar conta mais do que três destinos no mesmo dia.",
    ],
  },
];
export const faqs = [
  {
    question: "Como começar a planejar?",
    answer:
      "Escolha um destino e abra o roteiro para conhecer a proposta. Em “Planejar minha viagem”, você monta um resumo com época, duração e interesses e pode baixar esse ponto de partida.",
  },
  {
    question: "Posso adaptar os roteiros?",
    answer:
      "Sim. As sugestões são um ponto de partida, com espaço para mudar a duração, o ritmo e os interesses. O planejador organiza suas escolhas em um resumo que fica com você.",
  },
  {
    question: "Preciso escolher a data agora?",
    answer:
      "Não. Você pode deixar a época em aberto no planejador e consultar a previsão atual de cada lugar para conhecer o clima da região.",
  },
  {
    question: "Consigo reservar ou pagar pelo site?",
    answer:
      "Este é um projeto de portfólio com experiências e roteiros ilustrativos. Não há reservas, pagamentos ou envio de dados para uma agência. Você pode explorar destinos, salvar favoritos no navegador e baixar seu planejamento.",
  },
];
