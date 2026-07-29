import { useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Pin } from "../types";
import { getPinPlaceholderColor } from "../placeholderColors";
import { PinCardActions } from "./PinCardActions";

type PinCardProps = {
  pin: Pin;
  index: number;
  showLike?: boolean;
};

export function PinCard({ pin, index, showLike = false }: PinCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <article
      className="group relative cursor-pointer overflow-hidden rounded-2xl"
      style={{ backgroundColor: getPinPlaceholderColor(index) }}
    >
      <Link
        to="/pins/$pinId"
        params={{ pinId: pin.id }}
        className="absolute inset-0 z-10"
        aria-label={`Ver detalhes de ${pin.title}`}
      />
      <img
        className={`block h-auto min-h-0 max-h-130 w-full rounded-2xl object-cover transition-opacity duration-500 ease-out sm:min-h-60 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        src={pin.pathImage}
        alt={pin.description}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
      />
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-black/0 transition-colors duration-200 group-focus-within:bg-black/25 group-hover:bg-black/25" />

      <PinCardActions
        pinId={pin.id}
        pinTitle={pin.title}
        pinDescription={pin.description}
        pinImageUrl={pin.pathImage}
        savedFolderIds={pin.savedFolderIds}
        likeCount={pin.likeCount}
        likedByCurrentUser={pin.likedByCurrentUser}
        showLike={showLike}
      />
    </article>
  );
}
