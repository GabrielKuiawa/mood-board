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
  {
    name: "Marina Gomes",
    email: "marina.seed@example.com",
    pathImageUser: "https://i.pravatar.cc/160?img=23",
  },
  {
    name: "Nicolas Barros",
    email: "nicolas.seed@example.com",
    pathImageUser: "https://i.pravatar.cc/160?img=15",
  },
  {
    name: "Olívia Cardoso",
    email: "olivia.seed@example.com",
    pathImageUser: "https://i.pravatar.cc/160?img=29",
  },
  {
    name: "Paulo Mendes",
    email: "paulo.seed@example.com",
    pathImageUser: "https://i.pravatar.cc/160?img=33",
  },
  {
    name: "Queila Teixeira",
    email: "queila.seed@example.com",
    pathImageUser: "https://i.pravatar.cc/160?img=45",
  },
  {
    name: "Rafael Moreira",
    email: "rafael.seed@example.com",
    pathImageUser: "https://i.pravatar.cc/160?img=52",
  },
  {
    name: "Sofia Campos",
    email: "sofia.seed@example.com",
    pathImageUser: "https://i.pravatar.cc/160?img=49",
  },
  {
    name: "Tiago Freitas",
    email: "tiago.seed@example.com",
    pathImageUser: "https://i.pravatar.cc/160?img=56",
  },
  {
    name: "Úrsula Duarte",
    email: "ursula.seed@example.com",
    pathImageUser: "https://i.pravatar.cc/160?img=48",
  },
  {
    name: "Vitor Peixoto",
    email: "vitor.seed@example.com",
    pathImageUser: "https://i.pravatar.cc/160?img=59",
  },
  {
    name: "Wesley Correia",
    email: "wesley.seed@example.com",
    pathImageUser: "https://i.pravatar.cc/160?img=65",
  },
  {
    name: "Yasmin Araújo",
    email: "yasmin.seed@example.com",
    pathImageUser: "https://i.pravatar.cc/160?img=41",
  },
] as const;

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

const SEED_SOURCE_IMAGE_COUNT = 1_000;
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

    return {
      title: `${theme}: inspiração ${style} ${paddedNumber}`,
      pathImage: `https://picsum.photos/seed/mood-board-${paddedNumber}/1080/1350`,
      description: `Referência visual ${style} de ${theme.toLowerCase()} para projetos e coleções criativas.`,
    };
  },
);
