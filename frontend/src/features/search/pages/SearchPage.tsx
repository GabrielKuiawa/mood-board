import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  initialPinsPage,
  pinService,
} from "@/features/pins/services/pinService";
import type { Pin } from "@/features/pins/types";
import { SearchBar } from "../components/SearchBar";

function PinImage({ pin }: { pin: Pin }) {
  return (
    <Link
      to="/pins/$pinId"
      params={{ pinId: pin.id }}
      aria-label={`Ver detalhes de ${pin.title}`}
      className="group relative mb-3 block break-inside-avoid overflow-hidden rounded-2xl bg-muted outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring sm:mb-4"
    >
      <img
        src={pin.pathImage}
        alt={pin.description || pin.title}
        className="block h-auto w-full transition duration-300 group-hover:scale-[1.02] group-hover:brightness-90"
        loading="lazy"
      />
    </Link>
  );
}

function DiscoveryGallery({ pins }: { pins: Pin[] }) {
  return (
    <section
      aria-label="Ideias para explorar"
      className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4"
    >
      {pins.map((pin) => (
        <PinImage key={pin.id} pin={pin} />
      ))}
    </section>
  );
}

function SearchPageSkeleton() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-3 sm:px-8 sm:py-6">
      <Skeleton className="h-12 w-full rounded-2xl md:hidden" />
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:mt-0 lg:grid-cols-4">
        {Array.from({ length: 12 }, (_, index) => (
          <Skeleton
            key={index}
            className={`rounded-2xl ${index % 3 === 0 ? "h-64" : "h-44"}`}
          />
        ))}
      </div>
    </main>
  );
}

export function SearchPage() {
  const pinsQuery = useQuery({
    queryKey: ["pins", "search-discovery"],
    queryFn: ({ signal }) => pinService.getPage(initialPinsPage, signal),
    staleTime: 5 * 60_000,
  });

  if (pinsQuery.isPending) return <SearchPageSkeleton />;

  if (pinsQuery.isError) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-2xl font-bold">
          Não foi possível carregar as ideias
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Verifique sua conexão e tente novamente.
        </p>
        <Button className="mt-5" onClick={() => void pinsQuery.refetch()}>
          <RotateCcw aria-hidden="true" />
          Tentar novamente
        </Button>
      </main>
    );
  }

  const pins = pinsQuery.data.data;

  if (pins.length === 0) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-8">
        <SearchBar variant="floating" />
        <div className="py-24 text-center">
          <h1 className="font-display text-2xl font-bold">
            Nenhum Pin por aqui ainda
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Use a busca para encontrar pessoas ou novas inspirações.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl pb-4">
      <div className="sticky top-0 z-30 bg-background/95 px-4 py-3 backdrop-blur md:hidden">
        <SearchBar variant="floating" />
      </div>

      <div className="px-3 py-1 sm:px-6 md:py-5">
        <DiscoveryGallery pins={pins} />
      </div>
    </main>
  );
}
