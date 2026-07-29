import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CommentsPanel } from "@/features/comments/components/CommentsPanel";
import type { PinComment } from "@/features/pins/types";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";

const mocks = vi.hoisted(() => ({
  getAll: vi.fn(),
  create: vi.fn(),
  delete: vi.fn(),
  like: vi.fn(),
  unlike: vi.fn(),
}));

vi.mock("@/features/comments/services/commentService", () => ({
  commentsQueryKey: (pinId: string) => ["comments", pinId],
  commentService: mocks,
}));

const comment: PinComment = {
  id: "comment-id",
  content: "Gostei muito dessa ideia.",
  createdAt: "2026-07-28T12:00:00.000Z",
  author: {
    id: "author-id",
    name: "Ana Martins",
    pathImageUser: "https://example.com/ana.jpg",
  },
  likeCount: 2,
  likedByCurrentUser: false,
  canDelete: true,
};

describe("CommentsPanel", () => {
  beforeEach(() => {
    mocks.getAll.mockReset().mockResolvedValue({ data: [comment] });
    mocks.create.mockReset();
    mocks.delete.mockReset().mockResolvedValue(undefined);
    mocks.like.mockReset().mockResolvedValue({
      data: { ...comment, likeCount: 3, likedByCurrentUser: true },
    });
    mocks.unlike.mockReset();
  });

  it("lists, creates, likes, and deletes the current user's comment", async () => {
    const user = userEvent.setup();
    const createdComment = {
      ...comment,
      id: "new-comment-id",
      content: "Nova conversa.",
      likeCount: 0,
    };
    mocks.create.mockResolvedValue({ data: createdComment });

    renderWithProviders(<CommentsPanel pinId="pin-id" />);

    expect(await screen.findByText(comment.content)).toBeVisible();
    expect(screen.getByText("1 comentário")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Curtir comentário" }));
    await waitFor(() =>
      expect(mocks.like).toHaveBeenCalledWith("pin-id", "comment-id"),
    );
    expect(
      screen.getByRole("button", { name: "Descurtir comentário" }),
    ).toHaveTextContent("3");

    await user.type(
      screen.getByRole("textbox", { name: "Adicionar comentário" }),
      "Nova conversa.",
    );
    await user.click(
      screen.getByRole("button", { name: "Publicar comentário" }),
    );
    await waitFor(() =>
      expect(mocks.create).toHaveBeenCalledWith("pin-id", "Nova conversa."),
    );
    expect(screen.getByText("Nova conversa.")).toBeVisible();

    await user.click(
      screen.getAllByRole("button", {
        name: "Excluir comentário de Ana Martins",
      })[0],
    );
    expect(
      screen.getByRole("alertdialog", { name: "Excluir comentário?" }),
    ).toBeVisible();
    await user.click(
      screen.getByRole("button", { name: "Excluir comentário" }),
    );

    await waitFor(() =>
      expect(mocks.delete).toHaveBeenCalledWith("pin-id", "comment-id"),
    );
    expect(screen.queryByText(comment.content)).not.toBeInTheDocument();
  });

  it("keeps the empty state compact and invites the first comment", async () => {
    mocks.getAll.mockResolvedValue({ data: [] });

    renderWithProviders(<CommentsPanel pinId="pin-id" />);

    expect(
      await screen.findByText("Seja a primeira pessoa a comentar."),
    ).toBeVisible();
    expect(
      screen.getByRole("textbox", { name: "Adicionar comentário" }),
    ).toBeVisible();
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });
});
