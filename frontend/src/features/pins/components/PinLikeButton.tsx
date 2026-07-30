import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { pinService } from "../services/pinService";

type PinLikeButtonProps = {
  pinId: string;
  initialLikeCount: number;
  initiallyLiked: boolean;
  variant?: "toolbar" | "overlay";
};

export function PinLikeButton({
  pinId,
  initialLikeCount,
  initiallyLiked,
  variant = "toolbar",
}: PinLikeButtonProps) {
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(initiallyLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const mutation = useMutation({
    mutationFn: (nextLiked: boolean) =>
      nextLiked ? pinService.like(pinId) : pinService.unlike(pinId),
    onMutate: (nextLiked) => {
      const previousState = { liked, likeCount };
      setLiked(nextLiked);
      setLikeCount((current) => Math.max(0, current + (nextLiked ? 1 : -1)));
      return previousState;
    },
    onError: (_error, _nextLiked, previousState) => {
      if (previousState) {
        setLiked(previousState.liked);
        setLikeCount(previousState.likeCount);
      }
    },
    onSuccess: ({ data }) => {
      setLiked(data.likedByCurrentUser);
      setLikeCount(data.likeCount);
      queryClient.setQueryData(["pin", pinId], data);
      void queryClient.invalidateQueries({ queryKey: ["pins"] });
    },
  });

  useEffect(() => {
    setLiked(initiallyLiked);
    setLikeCount(initialLikeCount);
  }, [initialLikeCount, initiallyLiked]);

  const label = liked ? "Descurtir Pin" : "Curtir Pin";

  return (
    <Button
      type="button"
      variant={variant === "overlay" ? "secondary" : "ghost"}
      aria-label={label}
      aria-pressed={liked}
      title={label}
      disabled={mutation.isPending}
      className={cn(
        "gap-1.5",
        variant === "overlay" &&
          "absolute bottom-2 left-2 z-20 h-9 bg-white px-3 text-zinc-950 shadow-md hover:bg-zinc-200 sm:bottom-3 sm:left-3 sm:h-10",
      )}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        mutation.mutate(!liked);
      }}
    >
      <Heart
        aria-hidden="true"
        className={cn(liked && "fill-red-600 text-red-600")}
      />
      <span>{likeCount}</span>
    </Button>
  );
}
