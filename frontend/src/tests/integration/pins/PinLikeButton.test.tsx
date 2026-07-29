import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PinLikeButton } from "@/features/pins/components/PinLikeButton";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";

const mocks = vi.hoisted(() => ({
  like: vi.fn(),
  unlike: vi.fn(),
}));

vi.mock("@/features/pins/services/pinService", () => ({
  pinService: mocks,
}));

describe("PinLikeButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.like.mockResolvedValue({
      message: "Pin curtido",
      data: { likeCount: 3, likedByCurrentUser: true },
    });
    mocks.unlike.mockResolvedValue({
      message: "Curtida removida",
      data: { likeCount: 2, likedByCurrentUser: false },
    });
  });

  it("likes and unlikes with immediate count feedback", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PinLikeButton
        pinId="pin-id"
        initialLikeCount={2}
        initiallyLiked={false}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Curtir Pin" }));
    expect(screen.getByText("3")).toBeVisible();
    await waitFor(() => expect(mocks.like).toHaveBeenCalledWith("pin-id"));
    expect(
      await screen.findByRole("button", { name: "Descurtir Pin" }),
    ).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Descurtir Pin" }));
    expect(screen.getByText("2")).toBeVisible();
    await waitFor(() => expect(mocks.unlike).toHaveBeenCalledWith("pin-id"));
  });
});
