import { useInfiniteQuery } from "@tanstack/react-query";
import { SearchX, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { PageFeedback } from "@/components/shared/PageFeedback";
import { Button } from "@/components/ui/button";
import { useSearchContext } from "@/features/search/hooks/useSearchContext";
import { PinList } from "../components/PinList";
import { PinListSkeleton } from "../components/PinListSkeleton";
import { createInitialPinsPage, pinService } from "../services/pinService";

export function PinFeedPage() {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { activeSearch, clearSearch } = useSearchContext();
  const initialPage = createInitialPinsPage(activeSearch);
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isPending,
  } = useInfiniteQuery({
    queryKey: ["pins", activeSearch],
    initialPageParam: initialPage,
    queryFn: ({ pageParam, signal }) => pinService.getPage(pageParam, signal),
    getNextPageParam: (lastPage) => lastPage.meta.next ?? undefined,
  });

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "800px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isPending) {
    return <PinListSkeleton />;
  }

  if (isError) {
    return <PageFeedback variant="error">{error.message}</PageFeedback>;
  }

  const pins = data.pages.flatMap((page) => page.data);

  return (
    <>
      {activeSearch && (
        <div className="flex items-center justify-between gap-4 px-4 pt-5 pb-2">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Resultados para
            </p>
            <h1 className="truncate text-2xl font-bold tracking-tight">
              {activeSearch.label}
            </h1>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearSearch}
          >
            <X aria-hidden="true" />
            Limpar
          </Button>
        </div>
      )}

      {activeSearch && pins.length === 0 ? (
        <div className="mx-auto flex min-h-80 max-w-lg flex-col items-center justify-center px-6 text-center">
          <SearchX
            aria-hidden="true"
            className="mb-4 size-9 text-muted-foreground"
          />
          <h2 className="text-xl font-bold">Nenhum Pin encontrado</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Tente outro título ou nome de criador.
          </p>
          <Button type="button" className="mt-5" onClick={clearSearch}>
            Voltar ao feed
          </Button>
        </div>
      ) : (
        <PinList pins={pins} isLoadingMore={isFetchingNextPage} />
      )}
      {hasNextPage && (
        <div ref={loadMoreRef} aria-hidden="true" className="h-px w-full" />
      )}
    </>
  );
}
