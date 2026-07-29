import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, Send, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Pin, PinComment } from "@/features/pins/types";
import { cn } from "@/lib/utils";
import { commentService, commentsQueryKey } from "../services/commentService";

function CommentLikeButton({
  pinId,
  comment,
}: {
  pinId: string;
  comment: PinComment;
}) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () =>
      comment.likedByCurrentUser
        ? commentService.unlike(pinId, comment.id)
        : commentService.like(pinId, comment.id),
    onSuccess: ({ data }) => {
      queryClient.setQueryData<{ data: PinComment[] }>(
        commentsQueryKey(pinId),
        (current) =>
          current
            ? {
                data: current.data.map((item) =>
                  item.id === data.id ? data : item,
                ),
              }
            : current,
      );
    },
  });

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-label={
        comment.likedByCurrentUser
          ? "Descurtir comentário"
          : "Curtir comentário"
      }
      disabled={mutation.isPending}
      className="h-7 gap-1 px-2 text-muted-foreground"
      onClick={() => mutation.mutate()}
    >
      <Heart
        aria-hidden="true"
        className={cn(
          "size-3.5",
          comment.likedByCurrentUser && "fill-red-600 text-red-600",
        )}
      />
      {comment.likeCount}
    </Button>
  );
}

export function CommentsPanel({
  pinId,
  variant = "inline",
}: {
  pinId: string;
  variant?: "inline" | "sheet";
}) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [commentPendingDeletion, setCommentPendingDeletion] =
    useState<PinComment>();
  const queryKey = commentsQueryKey(pinId);
  const commentsQuery = useQuery({
    queryKey,
    queryFn: ({ signal }) => commentService.getAll(pinId, signal),
  });
  const refreshPinCount = (change: number) => {
    queryClient.setQueryData<Pin>(["pin", pinId], (pin) =>
      pin
        ? { ...pin, commentCount: Math.max(0, pin.commentCount + change) }
        : pin,
    );
    void queryClient.invalidateQueries({ queryKey: ["pins"] });
  };
  const createMutation = useMutation({
    mutationFn: (text: string) => commentService.create(pinId, text),
    onSuccess: ({ data }) => {
      queryClient.setQueryData<{ data: PinComment[] }>(queryKey, (current) => ({
        data: [...(current?.data ?? []), data],
      }));
      setContent("");
      refreshPinCount(1);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (commentId: string) => commentService.delete(pinId, commentId),
    onSuccess: (_data, commentId) => {
      queryClient.setQueryData<{ data: PinComment[] }>(queryKey, (current) => ({
        data: (current?.data ?? []).filter((item) => item.id !== commentId),
      }));
      setCommentPendingDeletion(undefined);
      refreshPinCount(-1);
    },
  });
  const comments = commentsQuery.data?.data ?? [];

  return (
    <section
      aria-label="Comentários"
      className={cn(
        "flex flex-col border-t px-5 py-4 lg:col-start-2 lg:row-start-5 lg:row-span-8 lg:min-h-0",
        variant === "sheet" && "h-full min-h-0 border-t-0",
      )}
    >
      <h2 className="font-bold">
        {comments.length} {comments.length === 1 ? "comentário" : "comentários"}
      </h2>

      {comments.length > 0 && (
        <div
          className={cn(
            "mt-3 max-h-96 space-y-4 overflow-y-auto pr-1 lg:min-h-0 lg:max-h-none lg:flex-1",
            variant === "sheet" && "min-h-0 max-h-none flex-1",
          )}
        >
          {comments.map((comment) => (
            <article key={comment.id} className="flex gap-3">
              <Avatar className="size-8 shrink-0">
                <AvatarImage
                  src={comment.author.pathImageUser}
                  alt={comment.author.name}
                />
                <AvatarFallback>
                  {comment.author.name.charAt(0).toLocaleUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-5">
                  <span className="mr-1 font-semibold">
                    {comment.author.name}
                  </span>
                  {comment.content}
                </p>
                <div className="mt-1 flex items-center gap-1">
                  <time className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString("pt-BR")}
                  </time>
                  <CommentLikeButton pinId={pinId} comment={comment} />
                  {comment.canDelete && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label={`Excluir comentário de ${comment.author.name}`}
                      className="h-7 px-2 text-muted-foreground"
                      onClick={() => setCommentPendingDeletion(comment)}
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {!commentsQuery.isPending && comments.length === 0 && (
        <p className="mt-2 text-sm text-muted-foreground">
          Seja a primeira pessoa a comentar.
        </p>
      )}

      <form
        className={cn(
          "mt-4 flex shrink-0 gap-2 lg:mt-auto lg:pt-4",
          variant === "sheet" && "mt-auto pt-4",
        )}
        onSubmit={(event) => {
          event.preventDefault();
          const text = content.trim();
          if (text) createMutation.mutate(text);
        }}
      >
        <Input
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Adicionar comentário"
          aria-label="Adicionar comentário"
          maxLength={500}
          className="rounded-full"
        />
        <Button
          type="submit"
          size="icon"
          aria-label="Publicar comentário"
          disabled={!content.trim() || createMutation.isPending}
        >
          <Send aria-hidden="true" />
        </Button>
      </form>

      {(commentsQuery.isError || createMutation.isError) && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {commentsQuery.error?.message ?? createMutation.error?.message}
        </p>
      )}

      <ConfirmDialog
        open={Boolean(commentPendingDeletion)}
        title="Excluir comentário?"
        description="Este comentário será removido permanentemente."
        confirmLabel="Excluir comentário"
        busy={deleteMutation.isPending}
        errorMessage={deleteMutation.error?.message}
        onCancel={() => setCommentPendingDeletion(undefined)}
        onConfirm={() => {
          if (commentPendingDeletion) {
            deleteMutation.mutate(commentPendingDeletion.id);
          }
        }}
      />
    </section>
  );
}
