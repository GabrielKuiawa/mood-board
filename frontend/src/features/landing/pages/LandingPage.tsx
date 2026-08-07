import {
  ArrowDownRight,
  ArrowRight,
  Bookmark,
  Layers3,
  Search,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Brand } from "@/components/shared/Brand";
import { Button } from "@/components/ui/button";

const artwork = {
  abstractBlue: {
    src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=88",
    alt: "Pintura abstrata com camadas de azul, vermelho e amarelo",
  },
  gallery: {
    src: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=88",
    alt: "Obra de arte contemporânea em uma galeria",
  },
  painter: {
    src: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1000&q=88",
    alt: "Artista trabalhando em uma tela colorida",
  },
  portrait: {
    src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1000&q=88",
    alt: "Retrato pintado com cores expressivas",
  },
  studio: {
    src: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=88",
    alt: "Pincéis, tintas e materiais espalhados em um ateliê",
  },
  museum: {
    src: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1200&q=88",
    alt: "Visitante observando obras em um museu de arte",
  },
} as const;

const responsiveImageWidths = [320, 640, 900, 1200] as const;

function createResponsiveSrcSet(src: string): string {
  return responsiveImageWidths
    .map((width) => `${src.replace(/w=\d+/, `w=${width}`)} ${width}w`)
    .join(", ");
}

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Descubra",
    description:
      "Passeie por referências que despertam uma ideia, uma sensação ou uma nova pergunta.",
  },
  {
    number: "02",
    icon: Bookmark,
    title: "Guarde",
    description:
      "Salve o que merece um segundo olhar sem interromper o seu fluxo criativo.",
  },
  {
    number: "03",
    icon: Layers3,
    title: "Dê forma",
    description:
      "Aproxime imagens, encontre relações e transforme referências em direção.",
  },
] as const;

export function LandingPage() {
  return (
    <main className="min-h-dvh overflow-hidden bg-slate-50 text-zinc-950">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-370 items-center px-4 sm:h-20 sm:px-8 lg:px-12">
          <Brand
            className="gap-2 text-lg sm:gap-2.5 sm:text-xl"
            labelClassName="sr-only sm:not-sr-only"
            logoClassName="size-8 sm:size-10"
          />

          <nav
            aria-label="Navegação da landing page"
            className="ml-12 hidden items-center gap-8 text-sm font-semibold lg:flex"
          >
            <a
              href="#arte"
              className="underline-offset-8 transition-colors hover:text-red-600 hover:underline"
            >
              Arte
            </a>
            <a
              href="#processo"
              className="underline-offset-8 transition-colors hover:text-red-600 hover:underline"
            >
              Como funciona
            </a>
            <a
              href="#manifesto"
              className="underline-offset-8 transition-colors hover:text-red-600 hover:underline"
            >
              Manifesto
            </a>
          </nav>

          <nav
            aria-label="Acesso à conta"
            className="ml-auto flex items-center gap-2 sm:gap-3"
          >
            <Button
              asChild
              variant="ghost"
              className="h-10 bg-transparent px-3 text-xs hover:bg-black/5 sm:h-11 sm:px-5 sm:text-sm"
            >
              <Link to="/login">Entrar</Link>
            </Button>
            <Button
              asChild
              className="h-10 bg-red-600 px-4 text-xs text-white shadow-none hover:bg-red-700 sm:h-11 sm:px-6 sm:text-sm"
            >
              <Link to="/signup">
                <span className="sm:hidden">Criar</span>
                <span className="hidden sm:inline">Criar conta</span>
                <ArrowRight aria-hidden="true" className="hidden sm:block" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="relative flex flex-col border-b border-black/10 pt-16 sm:pt-20 md:min-h-dvh">
        <div className="mx-auto grid w-full max-w-370 flex-1 md:grid-cols-2">
          <div className="relative flex flex-col justify-center px-4 py-12 sm:px-8 sm:py-16 md:py-14 lg:px-12 lg:py-20 xl:py-24">
            <p className="mb-5 flex items-center gap-3 text-xs font-extrabold tracking-widest uppercase sm:mb-6">
              <span className="h-px w-9 bg-red-600" />
              seu repertório visual
            </p>
            <h1 className="m-0 max-w-3xl font-display text-5xl leading-none font-extrabold tracking-tighter text-balance sm:text-7xl md:text-6xl lg:text-7xl xl:text-8xl">
              Guarde o que faz você <span className="text-red-600">parar.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-zinc-600 sm:mt-8 sm:text-lg sm:leading-8 xl:text-xl">
              Crie seu mood board, encontre referências visuais e organize as
              imagens que dizem alguma coisa — antes mesmo de você saber
              explicar o quê.
            </p>
            <div className="mt-8 flex flex-col gap-2 sm:mt-10 sm:flex-row sm:gap-3">
              <Button
                asChild
                size="lg"
                className="h-13 w-full bg-blue-700 px-6 text-sm text-white shadow-none hover:bg-blue-800 sm:h-14 sm:w-auto sm:px-8 sm:text-base"
              >
                <Link to="/signup">
                  Comece seu board
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <a
                href="#arte"
                className="inline-flex h-12 items-center justify-center gap-2 px-5 text-sm font-bold underline decoration-2 underline-offset-8 transition-colors hover:text-red-600 sm:h-14"
              >
                Ver inspirações
                <ArrowDownRight aria-hidden="true" className="size-4" />
              </a>
            </div>
          </div>

          <div className="relative hidden overflow-hidden bg-blue-700 p-6 md:block lg:min-h-0 lg:p-10 xl:p-12">
            <div className="absolute top-0 right-0 h-20 w-20 bg-white/90 sm:h-36 sm:w-36" />
            <div className="absolute bottom-0 left-0 h-16 w-1/3 bg-red-600 sm:h-24" />
            <div className="relative h-full min-h-136 border-8 border-zinc-950 bg-white lg:min-h-148 lg:border-10">
              <img
                src={`${import.meta.env.BASE_URL}art-hero-v2.webp`}
                alt="Colagem original com pinceladas azuis, círculo vermelho e recortes de papel"
                width="1122"
                height="1402"
                className="h-full w-full object-cover"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="arte"
        aria-labelledby="arte-title"
        className="scroll-mt-16 bg-zinc-950 px-4 py-16 text-white sm:scroll-mt-20 sm:px-8 sm:py-28 lg:px-12"
      >
        <div className="mx-auto max-w-345">
          <div className="grid gap-7 border-t border-white/25 pt-7 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="mb-4 text-xs font-extrabold tracking-widest text-red-400 uppercase">
                arte para olhar sem pressa
              </p>
              <h2
                id="arte-title"
                className="max-w-3xl font-display text-4xl leading-none font-bold tracking-tighter sm:text-6xl"
              >
                Uma imagem pode mudar o rumo de uma ideia.
              </h2>
            </div>
            <p className="max-w-xl self-end text-base leading-7 text-white/65 sm:text-lg sm:leading-8 lg:justify-self-end">
              Cor, gesto, textura, silêncio. Às vezes o que você procura ainda
              não tem nome — mas já tem uma imagem.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:mt-14 sm:gap-4 lg:grid-cols-2 lg:gap-5">
            <figure className="group m-0 overflow-hidden rounded-tl-4xl bg-zinc-800">
              <img
                src={artwork.abstractBlue.src}
                srcSet={createResponsiveSrcSet(artwork.abstractBlue.src)}
                alt={artwork.abstractBlue.alt}
                width="1200"
                height="1500"
                sizes="(min-width: 1024px) 57vw, 100vw"
                className="aspect-4/5 h-full w-full object-cover transition-transform duration-700 motion-reduce:transition-none group-hover:scale-105"
                loading="lazy"
              />
            </figure>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-1 lg:gap-5">
              <figure className="group m-0 overflow-hidden bg-zinc-800">
                <img
                  src={artwork.gallery.src}
                  srcSet={createResponsiveSrcSet(artwork.gallery.src)}
                  alt={artwork.gallery.alt}
                  width="1000"
                  height="720"
                  sizes="(min-width: 1024px) 41vw, calc(50vw - 22px)"
                  className="aspect-3/4 h-full w-full object-cover transition-transform duration-700 motion-reduce:transition-none group-hover:scale-105 sm:aspect-4/3 lg:aspect-auto"
                  loading="lazy"
                />
              </figure>
              <figure className="group m-0 overflow-hidden rounded-br-4xl bg-zinc-800">
                <img
                  src={artwork.painter.src}
                  srcSet={createResponsiveSrcSet(artwork.painter.src)}
                  alt={artwork.painter.alt}
                  width="1000"
                  height="720"
                  sizes="(min-width: 1024px) 41vw, calc(50vw - 22px)"
                  className="aspect-3/4 h-full w-full object-cover transition-transform duration-700 motion-reduce:transition-none group-hover:scale-105 sm:aspect-4/3 lg:aspect-auto"
                  loading="lazy"
                />
              </figure>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:gap-4 lg:mt-5 lg:grid-cols-3 lg:gap-5">
            <figure className="group order-1 m-0 overflow-hidden bg-zinc-800">
              <img
                src={artwork.portrait.src}
                srcSet={createResponsiveSrcSet(artwork.portrait.src)}
                alt={artwork.portrait.alt}
                width="900"
                height="1100"
                sizes="(min-width: 1024px) 28vw, 50vw"
                className="aspect-3/4 h-full w-full object-cover transition-transform duration-700 motion-reduce:transition-none group-hover:scale-105"
                loading="lazy"
              />
            </figure>
            <figure className="group order-3 col-span-2 m-0 overflow-hidden rounded-tr-4xl bg-zinc-800 lg:order-2 lg:col-span-1">
              <img
                src={artwork.museum.src}
                srcSet={createResponsiveSrcSet(artwork.museum.src)}
                alt={artwork.museum.alt}
                width="1200"
                height="900"
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="aspect-4/3 h-full w-full object-cover transition-transform duration-700 motion-reduce:transition-none group-hover:scale-105 lg:aspect-auto"
                loading="lazy"
              />
            </figure>
            <figure className="group order-2 m-0 overflow-hidden rounded-bl-4xl bg-zinc-800 lg:order-3">
              <img
                src={artwork.studio.src}
                srcSet={createResponsiveSrcSet(artwork.studio.src)}
                alt={artwork.studio.alt}
                width="900"
                height="1100"
                sizes="(min-width: 1024px) 28vw, 50vw"
                className="aspect-3/4 h-full w-full object-cover transition-transform duration-700 motion-reduce:transition-none group-hover:scale-105"
                loading="lazy"
              />
            </figure>
          </div>
        </div>
      </section>

      <section
        id="manifesto"
        aria-label="Manifesto"
        className="relative scroll-mt-16 overflow-hidden bg-blue-700 px-4 py-18 text-white sm:scroll-mt-20 sm:px-8 sm:py-32 lg:px-12"
      >
        <div className="absolute -top-20 -right-24 size-56 rounded-full bg-red-600 sm:-top-24 sm:size-96" />
        <div className="absolute bottom-8 left-5 h-1.5 w-24 -rotate-6 bg-white/75 sm:bottom-10 sm:left-16 sm:h-2 sm:w-44" />
        <blockquote className="relative mx-auto max-w-6xl">
          <p className="font-display text-4xl leading-none font-bold tracking-tighter text-balance text-white/70 sm:text-6xl lg:text-8xl">
            “Antes de virar projeto, toda ideia foi uma imagem que{" "}
            <span className="text-white">ficou.</span>”
          </p>
        </blockquote>
      </section>

      <section
        id="processo"
        aria-labelledby="processo-title"
        className="scroll-mt-16 bg-white px-4 py-16 sm:scroll-mt-20 sm:px-8 sm:py-28 lg:px-12"
      >
        <div className="mx-auto max-w-345">
          <div className="grid gap-7 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="mb-4 text-xs font-extrabold tracking-widest text-red-600 uppercase">
                do olhar ao board
              </p>
              <h2
                id="processo-title"
                className="font-display text-4xl leading-none font-bold tracking-tighter sm:text-6xl"
              >
                Ideias gostam de companhia.
              </h2>
            </div>
            <p className="max-w-2xl self-end text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
              Quando duas referências se encontram, uma terceira coisa aparece.
              O mood board é o espaço para essas conexões acontecerem.
            </p>
          </div>

          <ol className="mt-12 grid border-y border-black/20 sm:mt-16 lg:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <li
                  key={step.number}
                  className={`relative flex gap-4 py-8 lg:block lg:px-9 lg:py-12 ${
                    index > 0
                      ? "border-t border-black/20 lg:border-t-0 lg:border-l"
                      : ""
                  }`}
                >
                  <div className="flex w-12 shrink-0 flex-col items-start gap-5 lg:w-auto lg:flex-row lg:items-center lg:justify-between">
                    <span className="font-mono text-sm font-bold text-red-600">
                      {step.number}
                    </span>
                    <Icon aria-hidden="true" className="size-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-2xl font-bold tracking-tight lg:mt-14 lg:text-3xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-600 sm:text-base sm:leading-7 lg:mt-3">
                      {step.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="bg-zinc-950 px-4 py-16 text-white sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto flex max-w-345 flex-col items-stretch gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-5 text-xs font-extrabold tracking-widest text-white/55 uppercase">
              seu próximo ponto de partida
            </p>
            <h2 className="max-w-4xl font-display text-5xl leading-none font-extrabold tracking-tighter text-balance sm:text-7xl">
              O que vai ficar com você hoje?
            </h2>
          </div>
          <Button
            asChild
            size="lg"
            className="h-14 w-full bg-red-600 px-7 text-sm text-white shadow-none hover:bg-red-700 sm:h-16 sm:px-9 sm:text-base lg:w-auto"
          >
            <Link to="/signup">
              Criar meu mood board
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <footer className="mx-auto mt-16 flex max-w-345 flex-col items-center justify-between gap-5 border-t border-white/20 pt-7 text-center text-sm sm:mt-20 sm:flex-row sm:text-left">
          <Brand labelClassName="text-white" logoClassName="size-8" />
          <p className="text-white/55">
            Descubra. Guarde. Encontre novas relações.
          </p>
        </footer>
      </section>
    </main>
  );
}
