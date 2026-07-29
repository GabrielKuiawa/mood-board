import { publicDemoAccount } from "../constants/publicDemoAccount";

export type SeedPinData = {
  title: string;
  pathImage: string;
  description: string;
};

export const seedUsers = [
  {
    name: "Ana Martins",
    email: publicDemoAccount.email,
    pathImageUser: "https://i.pravatar.cc/160?img=47",
  },
  {
    name: "Bruno Lima",
    email: "bruno.seed@example.com",
    pathImageUser: "https://i.pravatar.cc/160?img=12",
  },
  {
    name: "Clara Oliveira",
    email: "clara.seed@example.com",
    pathImageUser: "https://i.pravatar.cc/160?img=32",
  },
  {
    name: "Diego Santos",
    email: "diego.seed@example.com",
    pathImageUser: "https://i.pravatar.cc/160?img=53",
  },
  {
    name: "Elisa Rocha",
    email: "elisa.seed@example.com",
    pathImageUser: "https://i.pravatar.cc/160?img=25",
  },
  {
    name: "Felipe Costa",
    email: "felipe.seed@example.com",
    pathImageUser: "https://i.pravatar.cc/160?img=68",
  },
  {
    name: "Giovana Alves",
    email: "giovana.seed@example.com",
    pathImageUser: "https://i.pravatar.cc/160?img=44",
  },
  {
    name: "Henrique Melo",
    email: "henrique.seed@example.com",
    pathImageUser: "https://i.pravatar.cc/160?img=11",
  },
  {
    name: "Isabela Nunes",
    email: "isabela.seed@example.com",
    pathImageUser: "https://i.pravatar.cc/160?img=5",
  },
  {
    name: "João Carvalho",
    email: "joao.seed@example.com",
    pathImageUser: "https://i.pravatar.cc/160?img=13",
  },
  {
    name: "Karen Ribeiro",
    email: "karen.seed@example.com",
    pathImageUser: "https://i.pravatar.cc/160?img=16",
  },
  {
    name: "Lucas Ferreira",
    email: "lucas.seed@example.com",
    pathImageUser: "https://i.pravatar.cc/160?img=14",
  },
] as const;

const retiredSeedUserEmails = [
  "marina.seed@example.com",
  "nicolas.seed@example.com",
  "olivia.seed@example.com",
  "paulo.seed@example.com",
  "queila.seed@example.com",
  "rafael.seed@example.com",
  "sofia.seed@example.com",
  "tiago.seed@example.com",
  "ursula.seed@example.com",
  "vitor.seed@example.com",
  "wesley.seed@example.com",
  "yasmin.seed@example.com",
] as const;

export const seedAccountEmails = [
  ...seedUsers.map((user) => user.email),
  ...retiredSeedUserEmails,
];

export const seedFolderNames = [
  "Animais",
  "Arquitetura",
  "Arte abstrata",
  "Arte urbana",
  "Cinema",
  "Comida",
  "Cultura",
  "Design",
  "Editorial",
  "Flores",
  "Fotografia",
  "Ilustração",
  "Interiores",
  "Moda",
  "Música",
  "Natureza",
  "Neon",
  "Paisagens",
  "Retratos",
  "Tecnologia",
  "Tipografia",
  "Tropical",
  "Urbano",
  "Viagem",
  "Astronomia",
  "Bem-estar",
  "Criatividade",
  "Esportes",
  "Jardins",
  "Minimalismo",
  "Oceanos",
  "Projetos",
  "Sabores",
  "Sustentabilidade",
  "Texturas",
  "Trabalho",
] as const;

const SEED_SOURCE_IMAGE_COUNT = 500;
const IMAGE_THEMES = [
  "Arquitetura",
  "Arte",
  "Cidades",
  "Culinária",
  "Design",
  "Fotografia",
  "Interiores",
  "Moda",
  "Natureza",
  "Paisagens",
  "Retratos",
  "Tecnologia",
  "Texturas",
  "Viagens",
] as const;
const IMAGE_STYLES = [
  "atemporal",
  "cinematográfica",
  "colorida",
  "contemporânea",
  "criativa",
  "elegante",
  "experimental",
  "minimalista",
  "orgânica",
  "vibrante",
] as const;
const IMAGE_DIMENSIONS = [
  { width: 720, height: 960 },
  { width: 960, height: 720 },
  { width: 800, height: 800 },
  { width: 720, height: 1_080 },
  { width: 1_080, height: 720 },
  { width: 900, height: 1_200 },
  { width: 1_200, height: 900 },
  { width: 1_080, height: 1_350 },
] as const;

export const seedPins: SeedPinData[] = Array.from(
  { length: SEED_SOURCE_IMAGE_COUNT },
  (_, index) => {
    const number = index + 1;
    const theme = IMAGE_THEMES[index % IMAGE_THEMES.length];
    const style =
      IMAGE_STYLES[
        Math.floor(index / IMAGE_THEMES.length) % IMAGE_STYLES.length
      ];
    const paddedNumber = String(number).padStart(4, "0");
    const dimensions = IMAGE_DIMENSIONS[index % IMAGE_DIMENSIONS.length];

    return {
      title: `${theme}: inspiração ${style} ${paddedNumber}`,
      pathImage: `https://picsum.photos/seed/mood-board-${paddedNumber}/${dimensions.width}/${dimensions.height}`,
      description: `Referência visual ${style} de ${theme.toLowerCase()} para projetos e coleções criativas.`,
    };
  },
);
