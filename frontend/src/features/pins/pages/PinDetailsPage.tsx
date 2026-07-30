import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Link, getRouteApi } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  Download,
  Expand,
  LoaderCircle,
  MessageCircle,
  Share2,
  X,
} from "lucide-react";
import { PageFeedback } from "@/components/shared/PageFeedback";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CommentsPanel } from "@/features/comments/components/CommentsPanel";
import { FolderSaveControl } from "@/features/folders/components/FolderSaveControl";
import { cn } from "@/lib/utils";
import { MasonryGrid } from "../components/MasonryGrid";
import { PinAuthor } from "../components/PinAuthor";
import { PinCard } from "../components/PinCard";
import { PinCardSkeleton } from "../components/PinCardSkeleton";
import { PinLikeButton } from "../components/PinLikeButton";
import { SharePinDialog } from "../components/SharePinDialog";
import { initialPinsPage, pinService } from "../services/pinService";
import type { Pin } from "../types";

const route = getRouteApi("/authenticated/pins/$pinId");

function IconAction({
  label,
  children,
  className,
  disabled,
  onClick,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      disabled={disabled}
      className={cn("size-10", className)}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function getImageFileName(pin: Pin, contentType: string): string {
  const baseName =
    pin.title
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || `pin-${pin.id}`;
  const extension =
    {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
    }[contentType] ?? "jpg";

  return `${baseName}.${extension}`;
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

function MobileCommentsSheet({
  pinId,
  onClose,
}: {
  pinId: string;
  onClose: () => void;
}) {
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
      className="fixed inset-0 z-100 bg-black/45 lg:hidden"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Comentários do Pin"
        className="absolute inset-x-0 bottom-0 flex h-[82dvh] flex-col overflow-hidden rounded-t-4xl bg-background shadow-2xl"
      >
        <div className="flex shrink-0 flex-col items-center border-b px-4 pt-2 pb-3">
          <span
            aria-hidden="true"
            className="h-1 w-9 rounded-full bg-muted-foreground/25"
          />
          <div className="mt-2 flex w-full items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Fechar comentários"
              onClick={onClose}
            >
              <X aria-hidden="true" />
            </Button>
            <h2 className="ml-2 font-bold">O que você acha?</h2>
          </div>
        </div>
        <div className="min-h-0 flex-1">
          <CommentsPanel pinId={pinId} variant="sheet" />
        </div>
      </section>
    </div>,
    document.body,
  );
}

function DetailCard({ pin }: { pin: Pin }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const downloadImage = async () => {
    setIsDownloading(true);
    setDownloadError("");

    try {
      const response = await fetch(pin.pathImage);
      if (!response.ok) throw new Error("Image download failed");

      const imageBlob = await response.blob();
      const objectUrl = URL.createObjectURL(imageBlob);
      const downloadLink = document.createElement("a");

      downloadLink.href = objectUrl;
      downloadLink.download = getImageFileName(pin, imageBlob.type);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      setDownloadError("Não foi possível baixar a imagem.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Card
        role="article"
        className="relative flex flex-col overflow-hidden rounded-none border-x-0 border-border bg-card shadow-none sm:rounded-3xl sm:border sm:shadow-sm lg:aspect-square lg:grid lg:grid-cols-2 lg:grid-rows-12"
      >
        <div className="order-2 flex items-center gap-0.5 px-2 py-3 sm:px-3 lg:order-0 lg:col-start-2 lg:row-start-1 lg:p-2.5 lg:px-3">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="absolute top-6 left-3 z-20 size-10 bg-white/90 text-zinc-950 shadow-sm hover:bg-white hover:text-zinc-950 sm:left-4 lg:static lg:bg-transparent lg:text-inherit lg:shadow-none lg:hover:bg-accent lg:hover:text-accent-foreground"
          >
            <Link to="/feed" aria-label="Voltar">
              <ArrowLeft aria-hidden="true" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <PinLikeButton
            pinId={pin.id}
            initialLikeCount={pin.likeCount}
            initiallyLiked={pin.likedByCurrentUser}
          />
          <Button
            type="button"
            variant="ghost"
            aria-label={`${pin.commentCount} ${
              pin.commentCount === 1 ? "comentário" : "comentários"
            }`}
            title="Comentários"
            className="h-10 gap-1.5 px-2.5"
            aria-haspopup="dialog"
            aria-expanded={isCommentsOpen}
            onClick={() => setIsCommentsOpen(true)}
          >
            <MessageCircle aria-hidden="true" />
            {pin.commentCount > 0 && (
              <span className="text-sm font-semibold">{pin.commentCount}</span>
            )}
          </Button>
          <IconAction
            label="Compartilhar"
            onClick={() => setIsShareDialogOpen(true)}
          >
            <Share2 aria-hidden="true" />
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

        <div className="order-1 px-3 pt-3 sm:px-4 lg:order-0 lg:col-start-1 lg:row-start-1 lg:row-span-12 lg:px-0 lg:pt-0">
          <div className="relative mx-auto w-fit max-w-full overflow-hidden rounded-3xl bg-muted lg:size-full lg:rounded-none">
            <img
              src={pin.pathImage}
              alt={pin.description}
              className="block h-auto max-h-150 w-auto max-w-full object-contain lg:size-full lg:max-h-none lg:max-w-none lg:object-cover"
            />
            <div className="absolute right-3 bottom-3 z-10 flex gap-2">
              <IconAction
                label={isDownloading ? "Baixando imagem" : "Baixar imagem"}
                disabled={isDownloading}
                className="bg-white/90 text-zinc-900 shadow-sm hover:bg-white hover:text-zinc-900"
                onClick={() => void downloadImage()}
              >
                {isDownloading ? (
                  <LoaderCircle aria-hidden="true" className="animate-spin" />
                ) : (
                  <Download aria-hidden="true" />
                )}
              </IconAction>
              <IconAction
                label="Expandir imagem"
                className="bg-white/90 text-zinc-900 shadow-sm hover:bg-white hover:text-zinc-900"
                onClick={() => setIsLightboxOpen(true)}
              >
                <Expand aria-hidden="true" />
              </IconAction>
            </div>
            {downloadError && (
              <p
                role="alert"
                className="absolute right-3 bottom-16 z-10 rounded-full bg-black/75 px-3 py-1.5 text-xs font-medium text-white"
              >
                {downloadError}
              </p>
            )}
          </div>
        </div>

        <div className="order-3 mx-auto w-full max-w-165 space-y-4 px-4 py-3 sm:px-5 lg:order-0 lg:col-start-2 lg:row-start-2 lg:row-span-3 lg:min-h-0 lg:max-w-none lg:overflow-y-auto lg:py-5">
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
        <div className="order-4 hidden lg:contents">
          <CommentsPanel pinId={pin.id} />
        </div>
      </Card>
      {isLightboxOpen && (
        <PinLightbox pin={pin} onClose={() => setIsLightboxOpen(false)} />
      )}
      <SharePinDialog
        open={isShareDialogOpen}
        pinId={pin.id}
        pinTitle={pin.title}
        imageUrl={pin.pathImage}
        onClose={() => setIsShareDialogOpen(false)}
      />
      {isCommentsOpen && (
        <MobileCommentsSheet
          pinId={pin.id}
          onClose={() => setIsCommentsOpen(false)}
        />
      )}
    </>
  );
}

const masonryRowHeight = 8;
const masonryGap = 16;

function DetailsMasonryItem({
  children,
  wide = false,
  desktopOnly = false,
}: {
  children: ReactNode;
  wide?: boolean;
  desktopOnly?: boolean;
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
      className={cn(
        "min-w-0",
        wide && "lg:col-span-4",
        desktopOnly && "hidden lg:block",
      )}
      style={{ gridRowEnd: `span ${rowSpan}` }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}

export function PinDetailsPage() {
  const { pinId } = route.useParams();
  const [loadMoreElement, setLoadMoreElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [isLoadMoreVisible, setIsLoadMoreVisible] = useState(false);
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
    if (!loadMoreElement) {
      setIsLoadMoreVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsLoadMoreVisible(entry.isIntersecting);
      },
      {
        rootMargin: "800px 0px",
      },
    );

    observer.observe(loadMoreElement);

    return () => observer.disconnect();
  }, [loadMoreElement]);

  useEffect(() => {
    if (!isLoadMoreVisible || !hasNextPage || isFetchingNextPage) {
      return;
    }

    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isLoadMoreVisible]);

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
        className="lg:grid lg:grid-flow-dense lg:grid-cols-pins lg:auto-rows-2 lg:gap-4 lg:px-4 lg:py-3"
      >
        <DetailsMasonryItem wide>
          <DetailCard pin={pin} />
        </DetailsMasonryItem>
        {relatedPins.map((relatedPin, index) => (
          <DetailsMasonryItem key={relatedPin.id} desktopOnly>
            <PinCard pin={relatedPin} index={index} showLike />
          </DetailsMasonryItem>
        ))}
        {isFetchingNextPage &&
          Array.from({ length: 12 }, (_, index) => (
            <DetailsMasonryItem key={`details-skeleton-${index}`} desktopOnly>
              <PinCardSkeleton />
            </DetailsMasonryItem>
          ))}
      </div>

      <section aria-labelledby="more-pins-title" className="pt-7 lg:hidden">
        <h2
          id="more-pins-title"
          className="px-3 font-display text-xl font-bold sm:px-4 sm:text-2xl"
        >
          Mais para explorar
        </h2>
        <MasonryGrid
          pins={relatedPins}
          skeletonCount={isFetchingNextPage ? 12 : 0}
          busy={isFetchingNextPage}
        />
      </section>
      {recommendationsError && relatedPins.length === 0 && (
        <PageFeedback variant="error">
          {recommendationsError.message}
        </PageFeedback>
      )}
      {hasNextPage && (
        <div
          ref={(element) => setLoadMoreElement(element)}
          aria-hidden="true"
          className="h-px w-full"
        />
      )}
    </main>
  );
}
