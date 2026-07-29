import { fireEvent, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { PinCard } from "@/features/pins/components/PinCard";
import { createPin } from "@/tests/fixtures/pins";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";

vi.mock("@/features/folders/services/folderService", () => ({
  folderQueryKey: (userId?: string) => ["folders", "mine", userId],
  folderService: {
    getMine: vi.fn().mockResolvedValue({
      data: [{ id: "folder-id", name: "Ideias", pinCount: 0 }],
    }),
    create: vi.fn(),
    savePin: vi.fn(),
    removePin: vi.fn(),
  },
}));

vi.mock("@/features/auth/hooks/useCurrentUserQuery", () => ({
  useCurrentUserQuery: () => ({ data: { id: "user-id" } }),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    params,
    to,
    ...props
  }: {
    children: ReactNode;
    params: { pinId: string };
    to: string;
  }) => (
    <a href={to.replace("$pinId", params.pinId)} {...props}>
      {children}
    </a>
  ),
}));

describe("PinCard", () => {
  it("links to the Pin details and reveals its image after loading", () => {
    const pin = createPin({
      id: "reference-id",
      title: "Sala minimalista",
      description: "Sala clara com móveis minimalistas",
    });

    renderWithProviders(<PinCard pin={pin} index={2} />);

    expect(
      screen.getByRole("link", { name: "Ver detalhes de Sala minimalista" }),
    ).toHaveAttribute("href", "/pins/reference-id");

    const imageElement = screen.getByRole("img", {
      name: "Sala clara com móveis minimalistas",
    });
    expect(imageElement).toHaveClass("opacity-0");

    fireEvent.load(imageElement);

    expect(imageElement).toHaveClass("opacity-100");
    expect(imageElement).not.toHaveClass("opacity-0");
  });

  it("exposes the current card actions", async () => {
    renderWithProviders(<PinCard pin={createPin()} index={0} />);

    expect(await screen.findByRole("button", { name: /Ideias/ })).toBeVisible();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Curtir Pin" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Compartilhar Pin" }),
    ).toBeVisible();
  });

  it("shows the like action only when used as a detail recommendation", () => {
    renderWithProviders(<PinCard pin={createPin()} index={0} showLike />);

    expect(screen.getByRole("button", { name: "Curtir Pin" })).toBeVisible();
  });
});
