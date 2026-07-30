import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FolderSaveControl } from "@/features/folders/components/FolderSaveControl";
import { PinLikeButton } from "./PinLikeButton";
import { SharePinDialog } from "./SharePinDialog";
import { useState } from "react";

export function PinCardActions({
  pinId,
  pinTitle,
  pinDescription,
  pinImageUrl,
  savedFolderIds,
  likeCount,
  likedByCurrentUser,
  showLike,
}: {
  pinId: string;
  pinTitle: string;
  pinDescription: string;
  pinImageUrl: string;
  savedFolderIds: string[];
  likeCount: number;
  likedByCurrentUser: boolean;
  showLike: boolean;
}) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  return (
    <>
      <div className="absolute inset-0 hidden opacity-0 transition-opacity duration-200 md:block md:group-focus-within:opacity-100 md:group-hover:opacity-100">
        <FolderSaveControl
          pinId={pinId}
          pinTitle={pinTitle}
          pinDescription={pinDescription}
          savedFolderIds={savedFolderIds}
          variant="overlay"
        />

        {showLike && (
          <PinLikeButton
            pinId={pinId}
            initialLikeCount={likeCount}
            initiallyLiked={likedByCurrentUser}
            variant="overlay"
          />
        )}

        <Button
          className="absolute right-2 bottom-2 z-20 size-9 bg-white text-black hover:bg-zinc-200 sm:right-3 sm:bottom-3 sm:size-10"
          type="button"
          variant="secondary"
          size="icon"
          aria-label="Compartilhar Pin"
          onClick={() => setIsShareDialogOpen(true)}
        >
          <Upload strokeWidth={2.5} aria-hidden="true" />
        </Button>
      </div>

      <SharePinDialog
        open={isShareDialogOpen}
        pinId={pinId}
        pinTitle={pinTitle}
        imageUrl={pinImageUrl}
        onClose={() => setIsShareDialogOpen(false)}
      />
    </>
  );
}
