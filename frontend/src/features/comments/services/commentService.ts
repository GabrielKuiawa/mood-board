import { apiRequest } from "@/lib/api";
import type { PinComment } from "@/features/pins/types";

type CommentResponse = {
  message: string;
  data: PinComment;
};

export const commentsQueryKey = (pinId: string) => ["comments", pinId] as const;

export const commentService = {
  getAll(pinId: string, signal?: AbortSignal) {
    return apiRequest<{ data: PinComment[] }>(`/api/pin/${pinId}/comments`, {
      signal,
      authenticated: true,
      errorMessage: "Não foi possível carregar os comentários.",
    });
  },
  create(pinId: string, content: string) {
    return apiRequest<CommentResponse>(`/api/pin/${pinId}/comments`, {
      method: "POST",
      json: { content },
      authenticated: true,
      errorMessage: "Não foi possível publicar o comentário.",
    });
  },
  delete(pinId: string, commentId: string) {
    return apiRequest<void>(`/api/pin/${pinId}/comments/${commentId}`, {
      method: "DELETE",
      authenticated: true,
      errorMessage: "Não foi possível excluir o comentário.",
    });
  },
  like(pinId: string, commentId: string) {
    return apiRequest<CommentResponse>(
      `/api/pin/${pinId}/comments/${commentId}/likes`,
      {
        method: "POST",
        authenticated: true,
        errorMessage: "Não foi possível curtir o comentário.",
      },
    );
  },
  unlike(pinId: string, commentId: string) {
    return apiRequest<CommentResponse>(
      `/api/pin/${pinId}/comments/${commentId}/likes`,
      {
        method: "DELETE",
        authenticated: true,
        errorMessage: "Não foi possível remover a curtida.",
      },
    );
  },
};
