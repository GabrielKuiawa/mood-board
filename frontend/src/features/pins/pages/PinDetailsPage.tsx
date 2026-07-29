import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Link, getRouteApi } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  Expand,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
  X,
} from "lucide-react";
import { PageFeedback } from "@/components/shared/PageFeedback";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FolderSaveControl } from "@/features/folders/components/FolderSaveControl";
import { cn } from "@/lib/utils";
import { PinAuthor } from "../components/PinAuthor";
import { PinCard } from "../components/PinCard";
import { PinCardSkeleton } from "../components/PinCardSkeleton";
import { initialPinsPage, pinService } from "../services/pinService";
import type { Pin } from "../types";

const route = getRouteApi("/authenticated/pins/$pinId");

function IconAction({
  label,
  children,
  className,
  onClick,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      className={cn("size-10", className)}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function PinLightbox({ pin, onClose }: { pin: Pin; onClose: () => void }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Visualização ampliada de ${pin.title}`}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <Button
        type="button"
        variant="secondary"
        size="icon"
        autoFocus
        aria-label="Fechar imagem ampliada"
        className="absolute top-4 right-4 z-10 bg-white text-zinc-950 shadow-lg hover:bg-zinc-200"
        onClick={onClose}
      >
        <X aria-hidden="true" />
      </Button>
      <figure className="relative m-0 flex size-full items-center justify-center">
        <img
          src={pin.pathImage}
          alt={pin.description}
          className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
        />
        <figcaption className="absolute bottom-0 rounded-full bg-black/60 px-3 py-1.5 text-sm font-medium text-white">
          {pin.title}
        </figcaption>
      </figure>
    </div>,
    document.body,
  );
}

function DetailCard({ pin }: { pin: Pin }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <>
      <Card
        role="article"
        className="rounded-3xl border-border bg-card shadow-sm"
      >
        <div className="flex items-center gap-0.5 p-2.5 sm:px-3">
          <Button asChild variant="ghost" size="icon" className="size-10">
            <Link to="/" aria-label="Voltar">
              <ArrowLeft aria-hidden="true" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <IconAction label="Curtir Pin">
            <Heart aria-hidden="true" />
          </IconAction>
          <IconAction label="Comentar">
            <MessageCircle aria-hidden="true" />
          </IconAction>
          <IconAction label="Compartilhar" className="hidden sm:inline-flex">
            <Share2 aria-hidden="true" />
          </IconAction>
          <IconAction label="Mais opções" className="hidden md:inline-flex">
            <MoreHorizontal aria-hidden="true" />
          </IconAction>

          <div className="ml-auto">
            <FolderSaveControl
              pinId={pin.id}
              pinTitle={pin.title}
              pinDescription={pin.description}
              savedFolderIds={pin.savedFolderIds}
            />
          </div>
        </div>

        <div className="px-3">
          <div className="relative mx-auto w-fit max-w-full overflow-hidden rounded-3xl bg-muted">
            <img
              src={pin.pathImage}
              alt={pin.description}
              className="block h-auto max-h-185 w-auto max-w-full object-contain"
            />
            <IconAction
              label="Expandir imagem"
              className="absolute right-3 bottom-3 z-10 bg-white/90 text-zinc-900 shadow-sm hover:bg-white hover:text-zinc-900"
              onClick={() => setIsLightboxOpen(true)}
            >
              <Expand aria-hidden="true" />
            </IconAction>
          </div>
        </div>

        <div className="mx-auto w-full max-w-165 space-y-4 px-5 py-5">
          <div>
            <h1 className="m-0 font-display text-2xl font-bold tracking-tight">
              {pin.title}
            </h1>
            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
              {pin.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <PinAuthor author={pin.author} />
          </div>
        </div>
      </Card>
      {isLightboxOpen && (
        <PinLightbox pin={pin} onClose={() => setIsLightboxOpen(false)} />
      )}
    </>
  );
}

const masonryRowHeight = 8;
const masonryGap = 16;

function DetailsMasonryItem({
  children,
  wide = false,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [rowSpan, setRowSpan] = useState(1);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const updateSpan = () => {
      const height = content.getBoundingClientRect().height;
      setRowSpan(
        Math.ceil((height + masonryGap) / (masonryRowHeight + masonryGap)),
      );
    };

    updateSpan();
    const observer = new ResizeObserver(updateSpan);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn("min-w-0", wide && "xl:col-span-3")}
      style={{ gridRowEnd: `span ${rowSpan}` }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}

export function PinDetailsPage() {
  const { pinId } = route.useParams();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const {
    data: pin,
    error,
    isPending,
  } = useQuery({
    queryKey: ["pin", pinId],
    queryFn: ({ signal }) => pinService.getById(pinId, signal),
  });
  const {
    data: recommendations,
    error: recommendationsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["pins", "details", pinId],
    initialPageParam: initialPinsPage,
    queryFn: ({ pageParam, signal }) => pinService.getPage(pageParam, signal),
    getNextPageParam: (lastPage) => lastPage.meta.next ?? undefined,
  });

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "100% 0%" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const relatedPins = useMemo(
    () =>
      recommendations?.pages
        .flatMap((page) => page.data)
        .filter((item) => item.id !== pinId) ?? [],
    [pinId, recommendations],
  );

  if (isPending) {
    return <PageFeedback>Carregando Pin...</PageFeedback>;
  }

  if (error) {
    return <PageFeedback variant="error">{error.message}</PageFeedback>;
  }

  return (
    <main className="w-full">
      <div
        aria-busy={isFetchingNextPage}
        className="grid grid-cols-pins auto-rows-2 grid-flow-dense gap-4 px-4 py-3"
      >
        <DetailsMasonryItem wide>
          <DetailCard pin={pin} />
        </DetailsMasonryItem>
        {relatedPins.map((relatedPin, index) => (
          <DetailsMasonryItem key={relatedPin.id}>
            <PinCard pin={relatedPin} index={index} />
          </DetailsMasonryItem>
        ))}
        {isFetchingNextPage &&
          Array.from({ length: 12 }, (_, index) => (
            <DetailsMasonryItem key={`details-skeleton-${index}`}>
              <PinCardSkeleton />
            </DetailsMasonryItem>
          ))}
      </div>
      {recommendationsError && relatedPins.length === 0 && (
        <PageFeedback variant="error">
          {recommendationsError.message}
        </PageFeedback>
      )}
      {hasNextPage && (
        <div ref={loadMoreRef} aria-hidden="true" className="h-px w-full" />
      )}
    </main>
  );
}
