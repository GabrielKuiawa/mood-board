import { publicDemoAccount } from "../constants/publicDemoAccount";

export type SeedPinData = {
  title: string;
  pathImage: string;
  description: string;
};

type SeedPinWithoutTitle = Omit<SeedPinData, "title">;

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
] as const;

const seedPinsWithoutTitles: SeedPinWithoutTitle[] = [
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1679756099018-32b9fec91606?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8c3BhY2UlMjBhc3Ryb25vbXl8ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a view of the earth from space",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1701690775399-07b302a83f8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8c3BhY2UlMjBhc3Ryb25vbXl8ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "stylized illustration of a ringed planet",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1677186467121-165786171a5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8c3BhY2UlMjBhc3Ryb25vbXl8ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a group of planets in the dark sky",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1604423203943-54721eff418a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8c3BhY2UlMjBhc3Ryb25vbXl8ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "starry night sky over starry night",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1676607444703-9e3beacc94a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8c3BhY2UlMjBhc3Ryb25vbXl8ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a group of stars that are in the sky",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1647118762210-393b52e96fbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fHNwYWNlJTIwYXN0cm9ub215fGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a night sky filled with lots of stars",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1681399977843-3efee572acd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTN8fHNwYWNlJTIwYXN0cm9ub215fGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Abstract space background with stars, starfield and fictional planets",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1611180260562-efe3176407b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTV8fHNwYWNlJTIwYXN0cm9ub215fGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "black and gray starry night",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1663047540698-12e93c082dda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTd8fHNwYWNlJTIwYXN0cm9ub215fGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "High definition star field, colorful night sky space. Nebula and galaxies in space. Astronomy concept background.",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1693388962349-1ca117c3d991?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fHNwYWNlJTIwYXN0cm9ub215fGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "A night sky with a star trail in the middle of it",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1669725687150-15c603ac6a73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8d2lsZGxpZmUlMjBhbmltYWxzfGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a tiger with its tongue out",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8d2lsZGxpZmUlMjBhbmltYWxzfGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "orange and silver fox",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1669740462444-ba6e0c316b59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8d2lsZGxpZmUlMjBhbmltYWxzfGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a giraffe eating leaves",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1570463662416-7d8e39fc67e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8d2lsZGxpZmUlMjBhbmltYWxzfGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "brown leopard sleeping during daytime",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1669740462316-60cf425ba319?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8d2lsZGxpZmUlMjBhbmltYWxzfGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "an elephant with tusks",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1647202321530-dd3f0c1b1be0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fHdpbGRsaWZlJTIwYW5pbWFsc3xlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a couple of deer standing on top of a lush green field",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1669725687152-498e152687ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTN8fHdpbGRsaWZlJTIwYW5pbWFsc3xlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a deer with antlers",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1623743424601-12be3807f99b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTV8fHdpbGRsaWZlJTIwYW5pbWFsc3xlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "zebra on brown grass field during daytime",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1711343703103-ba64040ce43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTd8fHdpbGRsaWZlJTIwYW5pbWFsc3xlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a peacock displaying its feathers in front of a tree",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1701368533954-f0dc06ebfbed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fHdpbGRsaWZlJTIwYW5pbWFsc3xlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a couple of tigers standing next to a body of water",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1669842162407-abfc5f9e981e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8b2NlYW4lMjB1bmRlcndhdGVyfGVufDB8fHx8MTc4NDM0NDgxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a turtle swimming in the water",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1559825481-12a05cc00344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8b2NlYW4lMjB1bmRlcndhdGVyfGVufDB8fHx8MTc4NDM0NDgxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "blue and clear body of water",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1661812071978-771a70ca1516?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8b2NlYW4lMjB1bmRlcndhdGVyfGVufDB8fHx8MTc4NDM0NDgxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "A school of fish in Komodo",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1559825477-6f38d6332bb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8b2NlYW4lMjB1bmRlcndhdGVyfGVufDB8fHx8MTc4NDM0NDgxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "grey sand under blue clear water",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1682690777032-d3404f78025f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8b2NlYW4lMjB1bmRlcndhdGVyfGVufDB8fHx8MTc4NDM0NDgxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a man riding a surfboard under water",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1514907283155-ea5f4094c70c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fG9jZWFuJTIwdW5kZXJ3YXRlcnxlbnwwfHx8fDE3ODQzNDQ4MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "blue and gray fish near corrals",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1671211318187-7f9cbbd88603?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTN8fG9jZWFuJTIwdW5kZXJ3YXRlcnxlbnwwfHx8fDE3ODQzNDQ4MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a body of water with a sky in the background",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1560364897-91578ff41817?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTV8fG9jZWFuJTIwdW5kZXJ3YXRlcnxlbnwwfHx8fDE3ODQzNDQ4MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "body of water",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1680103200497-3e5107407bde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTd8fG9jZWFuJTIwdW5kZXJ3YXRlcnxlbnwwfHx8fDE3ODQzNDQ4MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "an underwater scene of a coral and seaweed",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1591025207163-942350e47db2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fG9jZWFuJTIwdW5kZXJ3YXRlcnxlbnwwfHx8fDE3ODQzNDQ4MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "brown turtle in water during daytime",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1672115680958-54438df0ab82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8bW91bnRhaW4lMjBhZHZlbnR1cmV8ZW58MHx8fHwxNzg0MzQ0ODExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a mountain range covered in snow under a blue sky",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1643903096045-07741be1f245?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8bW91bnRhaW4lMjBhZHZlbnR1cmV8ZW58MHx8fHwxNzg0MzQ0ODExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a man climbing up the side of a snow covered mountain",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1688645554172-d3aef5f837ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8bW91bnRhaW4lMjBhZHZlbnR1cmV8ZW58MHx8fHwxNzg0MzQ0ODExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a very tall mountain covered in snow under a cloudy sky",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1598858715214-3d0f6219e267?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8bW91bnRhaW4lMjBhZHZlbnR1cmV8ZW58MHx8fHwxNzg0MzQ0ODExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "green and brown mountain under blue sky during daytime",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1664300545826-2b1c30409ad4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8bW91bnRhaW4lMjBhZHZlbnR1cmV8ZW58MHx8fHwxNzg0MzQ0ODExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Mountaineer with backpack using climbing rope to climb rocky mountain summit.",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1531322804667-8d2907f41406?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fG1vdW50YWluJTIwYWR2ZW50dXJlfGVufDB8fHx8MTc4NDM0NDgxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "person walking on rock mountain",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1667530527025-0dbeb1777692?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTN8fG1vdW50YWluJTIwYWR2ZW50dXJlfGVufDB8fHx8MTc4NDM0NDgxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a view of a mountain range from the top of a mountain",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1580122468928-0e9940385cb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTV8fG1vdW50YWluJTIwYWR2ZW50dXJlfGVufDB8fHx8MTc4NDM0NDgxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "snow covered mountain during daytime",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1661814278311-d59ab0b4a676?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTd8fG1vdW50YWluJTIwYWR2ZW50dXJlfGVufDB8fHx8MTc4NDM0NDgxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "hikers with backpacks on the trail in the Apls mountains. Trek near Matterhorn mount",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1530738270955-2ed78de5c2a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fG1vdW50YWluJTIwYWR2ZW50dXJlfGVufDB8fHx8MTc4NDM0NDgxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "people on ridge covered with snow",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1661884049104-9d79c968a64c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y2FycyUyMG1vdG9yY3ljbGVzfGVufDB8fHx8MTc4NDM0NDgxMnww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Row of scooters for sale and rental on the streets",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1625811485537-af2c05a0232d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8Y2FycyUyMG1vdG9yY3ljbGVzfGVufDB8fHx8MTc4NDM0NDgxMnww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "red and black sports bike",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1661304703836-e149eaad1ebd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8Y2FycyUyMG1vdG9yY3ljbGVzfGVufDB8fHx8MTc4NDM0NDgxMnww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Young man doing hard job in car and motorcycle repair shop.",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1634024047090-adf7e8a3fa16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8Y2FycyUyMG1vdG9yY3ljbGVzfGVufDB8fHx8MTc4NDM0NDgxMnww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a person riding a motorcycle on a highway",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1739358648380-f829e5084554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8Y2FycyUyMG1vdG9yY3ljbGVzfGVufDB8fHx8MTc4NDM0NDgxMnww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "A blurry photo of two motorcyclists racing on a track",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1783786645526-36ba1b0fd405?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fGNhcnMlMjBtb3RvcmN5Y2xlc3xlbnwwfHx8fDE3ODQzNDQ4MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Red and black motorcycles parked under a clear blue sky.",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1731751940562-0ee5d6110943?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTN8fGNhcnMlMjBtb3RvcmN5Y2xlc3xlbnwwfHx8fDE3ODQzNDQ4MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "A pink and black motorcycle with a yellow eye",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1717046635188-d9f2f1b47bc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTV8fGNhcnMlMjBtb3RvcmN5Y2xlc3xlbnwwfHx8fDE3ODQzNDQ4MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "A motorcycle parked on the grass next to a white car",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1693894132279-061f4716304e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTd8fGNhcnMlMjBtb3RvcmN5Y2xlc3xlbnwwfHx8fDE3ODQzNDQ4MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a close up of the tail lights of a car",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1660504661385-3d53fb32a175?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGNhcnMlMjBtb3RvcmN5Y2xlc3xlbnwwfHx8fDE3ODQzNDQ4MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a man riding a motorcycle",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1661963212517-830bbb7d76fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8dGVjaG5vbG9neSUyMGNvZGluZ3xlbnwwfHx8fDE3ODQzNDQ4MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "digital code number abstract background, represent  coding technology and programming languages.",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8dGVjaG5vbG9neSUyMGNvZGluZ3xlbnwwfHx8fDE3ODQzNDQ4MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "monitor showing Java programming",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1661877737564-3dfd7282efcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8dGVjaG5vbG9neSUyMGNvZGluZ3xlbnwwfHx8fDE3ODQzNDQ4MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Programming code abstract technology background of software developer and  Computer script",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8dGVjaG5vbG9neSUyMGNvZGluZ3xlbnwwfHx8fDE3ODQzNDQ4MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a computer screen with a bunch of code on it",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1720287601920-ee8c503af775?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8dGVjaG5vbG9neSUyMGNvZGluZ3xlbnwwfHx8fDE3ODQzNDQ4MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "A laptop computer with a bunch of different screens on top of it",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fHRlY2hub2xvZ3klMjBjb2Rpbmd8ZW58MHx8fHwxNzg0MzQ0ODEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "black flat screen computer monitor turned on displaying website",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1678566111481-8e275550b700?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTN8fHRlY2hub2xvZ3klMjBjb2Rpbmd8ZW58MHx8fHwxNzg0MzQ0ODEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a close up of a laptop computer with code on the screen",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1484417894907-623942c8ee29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTV8fHRlY2hub2xvZ3klMjBjb2Rpbmd8ZW58MHx8fHwxNzg0MzQ0ODEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "MacBook Pro showing programming language",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1663040543387-cb7c78c4f012?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTd8fHRlY2hub2xvZ3klMjBjb2Rpbmd8ZW58MHx8fHwxNzg0MzQ0ODEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Female programmer writing programming code on laptops and desktop computer at cozy home workplace. Close-up on hands and keyboard",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fHRlY2hub2xvZ3klMjBjb2Rpbmd8ZW58MHx8fHwxNzg0MzQ0ODEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "turned-on laptop computer",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1677870728119-52aef052d7ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Z2FtaW5nJTIwc2V0dXB8ZW58MHx8fHwxNzg0MzQ0ODA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a game zone sign sitting on top of a computer desk",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8Z2FtaW5nJTIwc2V0dXB8ZW58MHx8fHwxNzg0MzQ0ODA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "black flat screen tv turned on near white wall",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1687854992749-e15cba89631d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8Z2FtaW5nJTIwc2V0dXB8ZW58MHx8fHwxNzg0MzQ0ODA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a pile of video game controllers sitting next to each other",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8Z2FtaW5nJTIwc2V0dXB8ZW58MHx8fHwxNzg0MzQ0ODA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a computer screen with a video game on it",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1682141878168-5dace8e1785d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8Z2FtaW5nJTIwc2V0dXB8ZW58MHx8fHwxNzg0MzQ0ODA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "PC at home with shooter game launched on. FPS experience virtual reality.",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fGdhbWluZyUyMHNldHVwfGVufDB8fHx8MTc4NDM0NDgwOXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "person holding black game controller",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1682141882061-c7676602e111?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTN8fGdhbWluZyUyMHNldHVwfGVufDB8fHx8MTc4NDM0NDgwOXww&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "PC at home with shooter game launched on. FPS experience virtual reality.",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTV8fGdhbWluZyUyMHNldHVwfGVufDB8fHx8MTc4NDM0NDgwOXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "black flat screen computer monitor on brown wooden desk",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1677870728110-3b3b41677a9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTd8fGdhbWluZyUyMHNldHVwfGVufDB8fHx8MTc4NDM0NDgwOXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a person typing on a keyboard in front of a game zone sign",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1630201129622-a8e8ef3f7245?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGdhbWluZyUyMHNldHVwfGVufDB8fHx8MTc4NDM0NDgwOXww&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "black flat screen computer monitor turned on with black computer keyboard",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1661286678499-211423a9ff5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8bGl2ZSUyMG11c2ljJTIwY29uY2VydHxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Silhouettes of festival concert crowd in front of bright stage lights. Unrecognizable people and colorful effects.",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1563841930606-67e2bce48b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8bGl2ZSUyMG11c2ljJTIwY29uY2VydHxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "crowd and stage",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1661299213170-6ca8f722f906?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8bGl2ZSUyMG11c2ljJTIwY29uY2VydHxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "People dancing at concert and partying at festival",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1565035010268-a3816f98589a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8bGl2ZSUyMG11c2ljJTIwY29uY2VydHxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "people watching band on the stage",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1681682668713-635b82742cc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8bGl2ZSUyMG11c2ljJTIwY29uY2VydHxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a group of people playing instruments on a stage",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1522158637959-30385a09e0da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fGxpdmUlMjBtdXNpYyUyMGNvbmNlcnR8ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "group of people watching concert",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1664303674394-157511e7085d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTN8fGxpdmUlMjBtdXNpYyUyMGNvbmNlcnR8ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Silhouettes of festival concert crowd in front of bright stage lights. Unrecognizable people and colorful effects.",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1450044804117-534ccd6e6a3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTV8fGxpdmUlMjBtdXNpYyUyMGNvbmNlcnR8ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "crowd of people at concert",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1664303684636-77e29786329b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTd8fGxpdmUlMjBtdXNpYyUyMGNvbmNlcnR8ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Silhouettes of festival concert crowd in front of bright stage lights. Unrecognizable people and colorful effects.",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1488036106564-87ecb155bb15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGxpdmUlMjBtdXNpYyUyMGNvbmNlcnR8ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "people watching concert",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1677567996070-68fa4181775a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Ym9va3MlMjBsaWJyYXJ5fGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a long row of books in a library",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8Ym9va3MlMjBsaWJyYXJ5fGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "book lot on table",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1681488394409-5614ef55488c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8Ym9va3MlMjBsaWJyYXJ5fGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "elegant reading room with library and armchair for relaxing. space for text. 3d rendering",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1603058817990-2b9a9abbce86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8Ym9va3MlMjBsaWJyYXJ5fGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "brown wooden book shelf with books",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1669652639356-f5cb1a086976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8Ym9va3MlMjBsaWJyYXJ5fGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a stack of books",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1722182877533-7378b60bf1e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fGJvb2tzJTIwbGlicmFyeXxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "A room with a lot of books in it",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1703701579660-8481915a7991?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTN8fGJvb2tzJTIwbGlicmFyeXxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Cozy library interior with bookshelves and seating area",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1544185310-0b3cf501672b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTV8fGJvb2tzJTIwbGlicmFyeXxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "woman standing on bookstore",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1664300897489-fd98eee64faf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTd8fGJvb2tzJTIwbGlicmFyeXxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Young people choosing books and reading them in the library",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1535058489223-1331b20fa114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGJvb2tzJTIwbGlicmFyeXxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "low angle photography of pile of books",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1727730053198-4059d4f7e72f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y29mZmVlJTIwZm9vZHxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Roasted coffee grains and a cup of coffee and cookies on a brown wooden background. Robusta, Arabica. top view",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1528699633788-424224dc89b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8Y29mZmVlJTIwZm9vZHxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "assorted bread with coffee and drinks",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1678715022988-417bbb94e3df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8Y29mZmVlJTIwZm9vZHxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a piece of cheesecake on a plate with a cup of coffee",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1530174883092-c2a7aa3f1cfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8Y29mZmVlJTIwZm9vZHxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "espresso on table",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1679486569841-95697c33a216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8Y29mZmVlJTIwZm9vZHxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a piece of cake on a plate next to a cup of coffee",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1500353391678-d7b57979d6d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fGNvZmZlZSUyMGZvb2R8ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "coffee and succulent plants",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1695132236644-1cc276ec81f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTN8fGNvZmZlZSUyMGZvb2R8ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a plate with a sandwich on it next to a cup of coffee",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1529942458412-eda69f76291d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTV8fGNvZmZlZSUyMGZvb2R8ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "sliced cake on square ceramic plate beside of window",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1679486569733-42105abcb10f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTd8fGNvZmZlZSUyMGZvb2R8ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a piece of cake and a cup of coffee on a table",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1564327367587-8808ebf012fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGNvZmZlZSUyMGZvb2R8ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "sliced cake near cappuccino cactus plant on white table",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1673826949034-18367fc03955?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8c3RyZWV0d2VhciUyMGZhc2hpb258ZW58MHx8fHwxNzg0MzQ0ODExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a man walking down the middle of a road",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1588117260148-b47818741c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8c3RyZWV0d2VhciUyMGZhc2hpb258ZW58MHx8fHwxNzg0MzQ0ODExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "woman in gray t-shirt and gray pants sitting on gray concrete bench during daytime",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1688497831535-120bd47d9f9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8c3RyZWV0d2VhciUyMGZhc2hpb258ZW58MHx8fHwxNzg0MzQ0ODExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a man leaning against a wall with his hand on his hip",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1635650804263-1a1941e14df5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8c3RyZWV0d2VhciUyMGZhc2hpb258ZW58MHx8fHwxNzg0MzQ0ODExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a young man with a hat on his head",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1695575593603-1f42ca27bb6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8c3RyZWV0d2VhciUyMGZhc2hpb258ZW58MHx8fHwxNzg0MzQ0ODExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a woman leaning against a wall with a hat on her head",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1660486044177-45cd45bb5e99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fHN0cmVldHdlYXIlMjBmYXNoaW9ufGVufDB8fHx8MTc4NDM0NDgxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a man wearing a hat and a black jacket",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1666183671860-077b028339ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTN8fHN0cmVldHdlYXIlMjBmYXNoaW9ufGVufDB8fHx8MTc4NDM0NDgxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a woman sitting on the ground next to a skateboard",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1602078019624-f4355d0687fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTV8fHN0cmVldHdlYXIlMjBmYXNoaW9ufGVufDB8fHx8MTc4NDM0NDgxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "white and black nike air force 1 high",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1664882424563-2c0cd50215a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTd8fHN0cmVldHdlYXIlMjBmYXNoaW9ufGVufDB8fHx8MTc4NDM0NDgxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a group of people standing next to each other",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1510853851847-5c02796e8c8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fHN0cmVldHdlYXIlMjBmYXNoaW9ufGVufDB8fHx8MTc4NDM0NDgxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "woman standing beside store",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1681550097108-187abe10d445?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8bW9kZXJuJTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a city skyline with tall buildings and a crane",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8bW9kZXJuJTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "white concrete building",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1666805690051-134cd145fd24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8bW9kZXJuJTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a room with a skylight and a white ceiling",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8bW9kZXJuJTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "white concrete building during daytime",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8bW9kZXJuJTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "3D RENDER MODERN BUILDING EXTERIOR",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1486718448742-163732cd1544?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fG1vZGVybiUyMGFyY2hpdGVjdHVyZXxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "minimalist photography of brown wavy structure",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1709678337824-adc29e1b6b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTN8fG1vZGVybiUyMGFyY2hpdGVjdHVyZXxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a row of multicolored buildings against a blue sky",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTV8fG1vZGVybiUyMGFyY2hpdGVjdHVyZXxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "black and white cocnrete building low-angle photography",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1661963433067-4a65227d83d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTd8fG1vZGVybiUyMGFyY2hpdGVjdHVyZXxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "White stripe architectural futuristic pattern background. 3d render illustration",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1496865534669-25ec2a3a0fd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fG1vZGVybiUyMGFyY2hpdGVjdHVyZXxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "woman standing in front of white building",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1670360414483-64e6d9ba9038?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8aW50ZXJpb3IlMjBkZXNpZ258ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a living room with a large window",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8aW50ZXJpb3IlMjBkZXNpZ258ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "green plant on white ceramic pot",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1676968002767-1f6a09891350?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8aW50ZXJpb3IlMjBkZXNpZ258ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a living room filled with furniture and a fire place",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8aW50ZXJpb3IlMjBkZXNpZ258ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "brown wooden table with chairs",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1681113076872-c74b8926e70c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8aW50ZXJpb3IlMjBkZXNpZ258ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a chair and ottoman in front of a picture frame",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1664711942326-2c3351e215e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fGludGVyaW9yJTIwZGVzaWdufGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a room with a couch and a table",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1671269941569-7841144ee4e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTN8fGludGVyaW9yJTIwZGVzaWdufGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a living room filled with furniture and decor",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8bWluaW1hbCUyMGRlc2lnbnxlbnwwfHx8fDE3ODQzNDQ4MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "black and brown leather padded tub sofa",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1684348962314-64fa628992f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTd8fGludGVyaW9yJTIwZGVzaWdufGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a living room with a couch a table and chairs",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1622372738946-62e02505feb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGludGVyaW9yJTIwZGVzaWdufGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "modern kitchen with wood cabinet teal stool",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1664537975122-9c598d85816e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8YWN0aW9uJTIwc3BvcnRzfGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a woman running down a street next to a ramp",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8YWN0aW9uJTIwc3BvcnRzfGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "silhouettes playing beach volleyball at sunset",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1661868906940-5d8443acf49e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8YWN0aW9uJTIwc3BvcnRzfGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a woman standing on top of a tennis court holding a racquet",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8YWN0aW9uJTIwc3BvcnRzfGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "white and blue soccer ball on green grass field",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1684820878202-52781d8e0ea9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8YWN0aW9uJTIwc3BvcnRzfGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a man riding a bike down a street",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1549896869-ca27eeffe4fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fGFjdGlvbiUyMHNwb3J0c3xlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "red running track lane markings",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1664303119944-4cf5302bb701?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTN8fGFjdGlvbiUyMHNwb3J0c3xlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a man holding a tennis racquet on a tennis court",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTV8fGFjdGlvbiUyMHNwb3J0c3xlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "man in black t-shirt and black shorts running on road during daytime",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1676634832558-6654a134e920?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTd8fGFjdGlvbiUyMHNwb3J0c3xlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a group of men playing a game of basketball",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1474546652694-a33dd8161d66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGFjdGlvbiUyMHNwb3J0c3xlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "running field during daytime",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1681487924146-c091598b7e8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8d29ybGQlMjB0cmF2ZWwlMjBjdWx0dXJlfGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Airplane take off and suitcase, bag with books and eyeglasses. Earth sphere, international worldwide flight, blue background. Concept of trip and travel. 3D rendering",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8d29ybGQlMjB0cmF2ZWwlMjBjdWx0dXJlfGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "black DSLR camera near passport",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1663088923485-58685ba14d5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8d29ybGQlMjB0cmF2ZWwlMjBjdWx0dXJlfGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Flat lay top view desktop travel concept with laptop, maps and other travel essentials, wooden background.",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1504542982118-59308b40fe0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8d29ybGQlMjB0cmF2ZWwlMjBjdWx0dXJlfGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "travel the world",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1723629817274-5408105f3a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8d29ybGQlMjB0cmF2ZWwlMjBjdWx0dXJlfGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "trip planning with map",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1655722723663-75b47de17a31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fHdvcmxkJTIwdHJhdmVsJTIwY3VsdHVyZXxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a person with their hands up",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1663099746128-34ea20ac094d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTN8fHdvcmxkJTIwdHJhdmVsJTIwY3VsdHVyZXxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Top view of unrecognizable young couple with maps planning vacation trip holiday, desktop travel concept.",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1538061879026-7703d25d483c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTV8fHdvcmxkJTIwdHJhdmVsJTIwY3VsdHVyZXxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "flat lay photography of person holding pen in front of world map",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1684407617236-9baf926474ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTd8fHdvcmxkJTIwdHJhdmVsJTIwY3VsdHVyZXxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a passport sitting on top of a passport case",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1571648393873-29bad2324860?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fHdvcmxkJTIwdHJhdmVsJTIwY3VsdHVyZXxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "brown-framed eyeglasses",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1666700698946-fbf7baa0134a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8c3RyZWV0JTIwcGhvdG9ncmFwaHl8ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a busy city street at night with neon signs",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1488034976201-ffbaa99cbf5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8c3RyZWV0JTIwcGhvdG9ncmFwaHl8ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "man using umbrella crossing the street during daytime",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1712171185603-c8cc8f0e9a7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8c3RyZWV0JTIwcGhvdG9ncmFwaHl8ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a building with a tree in front of it",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1598966835412-6de6f92c243d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8c3RyZWV0JTIwcGhvdG9ncmFwaHl8ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "white and gray concrete building beside green trees during daytime",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1715030289409-5e81652149e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8c3RyZWV0JTIwcGhvdG9ncmFwaHl8ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "a group of people crossing a street in front of a tall building",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1534847004764-b93737310da1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fHN0cmVldCUyMHBob3RvZ3JhcGh5fGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "people walking on street near building during nighttime",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1689974468141-1411d3211a27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTN8fHN0cmVldCUyMHBob3RvZ3JhcGh5fGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a row of black poles sitting on the side of a road",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1610247948543-28d438fd094b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTV8fHN0cmVldCUyMHBob3RvZ3JhcGh5fGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "cars parked beside brown concrete building during daytime",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1672097247804-add051dcd682?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTd8fHN0cmVldCUyMHBob3RvZ3JhcGh5fGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a city street with a traffic light and buildings",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1487452066049-a710f7296400?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fHN0cmVldCUyMHBob3RvZ3JhcGh5fGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "empty tunnel pathway with graffiti walls",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1674389991678-0836ca77c7f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y2luZW1hdGljJTIwcGhvdG9ncmFwaHl8ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a man holding a camera up to take a picture",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8Y2luZW1hdGljJTIwcGhvdG9ncmFwaHl8ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "black Canon DSLR camera beside camera lens",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1709311450621-6ce6545e2564?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8Y2luZW1hdGljJTIwcGhvdG9ncmFwaHl8ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a person standing in a field of tall grass",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1575876402495-fe202e1d3732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8Y2luZW1hdGljJTIwcGhvdG9ncmFwaHl8ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "person holding black DSLR camera",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1748035806808-80c32ffc7430?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8Y2luZW1hdGljJTIwcGhvdG9ncmFwaHl8ZW58MHx8fHwxNzg0MzQ0ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "A figure stands in front of a bright building.",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1560217930-ed5820aea22a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fGNpbmVtYXRpYyUyMHBob3RvZ3JhcGh5fGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "person holding black DSLR camera",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1682146739433-5926577acb7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTN8fGNpbmVtYXRpYyUyMHBob3RvZ3JhcGh5fGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Serious young cameraman with steadicam standing against spotlight in studio lit by blue light and full of smoke during video shooting",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1491796014055-e6835cdcd4c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTV8fGNpbmVtYXRpYyUyMHBob3RvZ3JhcGh5fGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "black and gray Canon AE-1 camera on gray sand under brown dock near body of water at daytime",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1698584002823-96e5c157d9ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTd8fGNpbmVtYXRpYyUyMHBob3RvZ3JhcGh5fGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a film strip with a blue sky in the background",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1628657485319-5865d0f2791d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGNpbmVtYXRpYyUyMHBob3RvZ3JhcGh5fGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "woman holding black and silver camera",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1682125169807-351f1561a2ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8aWxsdXN0cmF0aW9uJTIwYXJ0fGVufDB8fHx8MTc4NDM0NDgxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Contemporary art collage. Creative design in retro style. Little house in mountain for border guard. Concept of creativity, surrealism, imagination, futuristic landscape. Poster",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1700605295478-2478ac29d2ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8aWxsdXN0cmF0aW9uJTIwYXJ0fGVufDB8fHx8MTc4NDM0NDgxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a painting of a woman with a flower in her hair",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1682125334416-95933a2a9fb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8aWxsdXN0cmF0aW9uJTIwYXJ0fGVufDB8fHx8MTc4NDM0NDgxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Contemporary art collage. Creative design in retro style. Image of snowy mountains on sunset. Fresh air. Concept of creativity, surrealism, imagination, futuristic landscape. Poster",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1770319676134-0068896fd0d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8aWxsdXN0cmF0aW9uJTIwYXJ0fGVufDB8fHx8MTc4NDM0NDgxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Framed artwork of a stylized figure on a wooden wall",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1682308242283-f1084c2c138e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8aWxsdXN0cmF0aW9uJTIwYXJ0fGVufDB8fHx8MTc4NDM0NDgxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "illustration of surreal landscape, solitude of nature, happiness and dream concept painting, fantasy hill with river, travel art, imagination lake, dreamlike mountain",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1657584942205-c34fec47404d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fGlsbHVzdHJhdGlvbiUyMGFydHxlbnwwfHx8fDE3ODQzNDQ4MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a person in a yoga pose",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1711987545192-83e4a7a089f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTN8fGlsbHVzdHJhdGlvbiUyMGFydHxlbnwwfHx8fDE3ODQzNDQ4MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Watercolor drawings with lemon tree motifs",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1769431209424-386d2d6e42d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTV8fGlsbHVzdHJhdGlvbiUyMGFydHxlbnwwfHx8fDE3ODQzNDQ4MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Colored pencils arranged on a textured, artistic background.",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1682308336208-7f3c19e6a96b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTd8fGlsbHVzdHJhdGlvbiUyMGFydHxlbnwwfHx8fDE3ODQzNDQ4MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "A girl and a monster of a book of imagination. concept idea art of dream education and reading. surreal painting. fantasy artwork. cute kid cartoon.",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1775201010557-734cec3a6f9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGlsbHVzdHJhdGlvbiUyMGFydHxlbnwwfHx8fDE3ODQzNDQ4MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Collage of black and white drawings and illustrations.",
  },
  {
    pathImage:
      "https://plus.unsplash.com/premium_photo-1686064771021-fbd6e301a0e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8bWluaW1hbCUyMGRlc2lnbnxlbnwwfHx8fDE3ODQzNDQ4MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a black background with a rainbow in the middle",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1626427223333-183395267453?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8bWluaW1hbCUyMGRlc2lnbnxlbnwwfHx8fDE3ODQzNDQ4MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "floating white disc shapes wallpaper",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1653875842174-429c1b467548?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8bWluaW1hbCUyMGRlc2lnbnxlbnwwfHx8fDE3ODQzNDQ4MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a woman wearing a hat and a coat",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1511389290465-d11bafd4c1df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8bWluaW1hbCUyMGRlc2lnbnxlbnwwfHx8fDE3ODQzNDQ4MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "black Marshal speaker on white table",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1511389026070-a14ae610a1be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fG1pbmltYWwlMjBkZXNpZ258ZW58MHx8fHwxNzg0MzQ0ODExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "green plant on white cabinet",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1638305983770-0acfc6791878?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTJ8fG1pbmltYWwlMjBkZXNpZ258ZW58MHx8fHwxNzg0MzQ0ODExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a view of a building through a window",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1513361159116-51e589abc801?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTR8fG1pbmltYWwlMjBkZXNpZ258ZW58MHx8fHwxNzg0MzQ0ODExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "grey concrete surface",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1633497545412-a1523b3bb114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTZ8fG1pbmltYWwlMjBkZXNpZ258ZW58MHx8fHwxNzg0MzQ0ODExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "two chairs and a table in front of a window",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1616397325279-e7bb752d0e28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTh8fG1pbmltYWwlMjBkZXNpZ258ZW58MHx8fHwxNzg0MzQ0ODExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "gray concrete building under blue sky during daytime",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1635236796520-68dd8df87895?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MjB8fG1pbmltYWwlMjBkZXNpZ258ZW58MHx8fHwxNzg0MzQ0ODExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a table and two stools in a room",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8bmF0dXJlJTIwbGFuZHNjYXBlfGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "green and gray rock formation beside body of water under cloudy sky during daytime",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1563216368-5b6a40648062?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8bmF0dXJlJTIwbGFuZHNjYXBlfGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "purple-petaled flowers growing at the mountain during sunrise",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1500622944204-b135684e99fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8bmF0dXJlJTIwbGFuZHNjYXBlfGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "aerial photography of mountains and near trees during daytime",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1526239187794-f8c27c7872ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8bmF0dXJlJTIwbGFuZHNjYXBlfGVufDB8fHx8MTc4NDM0NDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "a view of a mountain range with trees in the foreground",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1530569673472-307dc017a82d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fG5hdHVyZSUyMGxhbmRzY2FwZXxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "mountains",
  },
  {
    pathImage:
      "https://images.unsplash.com/39/wdXqHcTwSTmLuKOGz92L_Landscape.jpg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTJ8fG5hdHVyZSUyMGxhbmRzY2FwZXxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "blue body of water",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1621846846625-f0bde2eb7c3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTR8fG5hdHVyZSUyMGxhbmRzY2FwZXxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "brown rock formation beside body of water during daytime",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1610552050890-fe99536c2615?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTZ8fG5hdHVyZSUyMGxhbmRzY2FwZXxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "green grass field and mountains under white clouds and blue sky during daytime",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1617194369222-af8a7e682365?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTh8fG5hdHVyZSUyMGxhbmRzY2FwZXxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "green grass field near green mountains under blue sky during daytime",
  },
  {
    pathImage:
      "https://images.unsplash.com/photo-1593714011419-91b10cd8a3a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MjB8fG5hdHVyZSUyMGxhbmRzY2FwZXxlbnwwfHx8fDE3ODQzNDQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "green mountain under cloudy sky during daytime",
  },
];

const createTitle = (description: string): string => {
  const normalizedDescription = description.trim();
  const title =
    normalizedDescription.charAt(0).toUpperCase() +
    normalizedDescription.slice(1);

  return title.length <= 150 ? title : `${title.slice(0, 147)}...`;
};

export const seedPins: SeedPinData[] = seedPinsWithoutTitles.map((pin) => ({
  ...pin,
  title: createTitle(pin.description),
}));
