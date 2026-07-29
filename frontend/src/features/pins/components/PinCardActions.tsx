import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FolderSaveControl } from "@/features/folders/components/FolderSaveControl";

export function PinCardActions({
  pinId,
  pinTitle,
  pinDescription,
  savedFolderIds,
}: {
  pinId: string;
  pinTitle: string;
  pinDescription: string;
  savedFolderIds: string[];
}) {
  return (
    <div className="absolute inset-0 opacity-100 transition-opacity duration-200 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
      <FolderSaveControl
        pinId={pinId}
        pinTitle={pinTitle}
        pinDescription={pinDescription}
        savedFolderIds={savedFolderIds}
        variant="overlay"
      />

      <Button
        className="absolute right-3 bottom-3 z-20 bg-white text-black hover:bg-zinc-200"
        type="button"
        variant="secondary"
        size="icon"
        aria-label="Compartilhar Pin"
      >
        <Upload strokeWidth={2.5} aria-hidden="true" />
      </Button>
    </div>
  );
}
