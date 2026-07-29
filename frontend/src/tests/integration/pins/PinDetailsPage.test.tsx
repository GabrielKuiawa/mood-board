import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPin, createPinPage } from "@/tests/fixtures/pins";
import { getLatestIntersectionObserver } from "@/tests/mocks/browserObservers";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";

const mocks = vi.hoisted(() => ({
  getById: vi.fn(),
  getPage: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  getRouteApi: () => ({
    useParams: () => ({ pinId: "reference-id" }),
  }),
  Link: ({ children, to }: { children: ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock("@/features/pins/services/pinService", () => ({
  initialPinsPage: "/api/pin?page=1&limit=20",
  pinService: { getById: mocks.getById, getPage: mocks.getPage },
}));

vi.mock("@/features/folders/services/folderService", () => ({
  folderQueryKey: (userId?: string) => ["folders", "mine", userId],
  folderService: {
    getMine: vi.fn().mockResolvedValue({
      data: [{ id: "folder-id", name: "Minha pasta", pinCount: 0 }],
    }),
    create: vi.fn(),
    savePin: vi.fn(),
    removePin: vi.fn(),
  },
}));

vi.mock("@/features/auth/hooks/useCurrentUserQuery", () => ({
  useCurrentUserQuery: () => ({ data: { id: "user-id" } }),
}));

import { PinDetailsPage } from "@/features/pins/pages/PinDetailsPage";

describe("PinDetailsPage", () => {
  beforeEach(() => {
    mocks.getById.mockReset();
    mocks.getPage.mockReset().mockResolvedValue(createPinPage({ data: [] }));
  });

  it("shows a loading message while the Pin is pending", () => {
    mocks.getById.mockReturnValue(new Promise(() => {}));

    renderWithProviders(<PinDetailsPage />);

    expect(screen.getByText("Carregando Pin...")).toBeVisible();
  });

  it("shows the request error", async () => {
    mocks.getById.mockRejectedValue(
      new Error("Não foi possível carregar o Pin."),
    );

    renderWithProviders(<PinDetailsPage />);

    expect(
      await screen.findByText("Não foi possível carregar o Pin."),
    ).toBeVisible();
  });

  it("renders the Pin, author, folder selector, and return link", async () => {
    mocks.getById.mockResolvedValue(
      createPin({
        id: "reference-id",
        title: "Arquitetura brutalista",
        description: "Edifício de concreto aparente",
        folders: [
          { id: "architecture", name: "Arquitetura" },
          { id: "design", name: "Design" },
        ],
      }),
    );

    renderWithProviders(<PinDetailsPage />);

    expect(
      await screen.findByRole("heading", { name: "Arquitetura brutalista" }),
    ).toBeVisible();
    expect(
      screen.getByRole("img", { name: "Edifício de concreto aparente" }),
    ).toBeVisible();
    expect(screen.getByText("Maria Silva")).toBeVisible();
    expect(
      await screen.findByRole("button", { name: /Minha pasta/ }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Voltar" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(
      screen.getByRole("article").parentElement?.parentElement,
    ).toHaveClass("col-span-full", "md:col-span-3");
    expect(mocks.getById).toHaveBeenCalledWith(
      "reference-id",
      expect.any(AbortSignal),
    );
  });

  it("does not expose folders as content tags", async () => {
    mocks.getById.mockResolvedValue(
      createPin({ folders: [{ id: "architecture", name: "Arquitetura" }] }),
    );

    renderWithProviders(<PinDetailsPage />);

    expect(await screen.findByRole("heading")).toBeVisible();
    expect(screen.queryByText("Arquitetura")).not.toBeInTheDocument();
  });

  it("opens and closes the expanded image viewer", async () => {
    const user = userEvent.setup();
    mocks.getById.mockResolvedValue(
      createPin({ id: "reference-id", title: "Paisagem ampliada" }),
    );

    renderWithProviders(<PinDetailsPage />);

    await user.click(
      await screen.findByRole("button", { name: "Expandir imagem" }),
    );
    expect(
      screen.getByRole("dialog", {
        name: "Visualização ampliada de Paisagem ampliada",
      }),
    ).toBeVisible();

    await user.click(
      screen.getByRole("button", { name: "Fechar imagem ampliada" }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("loads more masonry items when the pagination marker is visible", async () => {
    mocks.getById.mockResolvedValue(createPin({ id: "reference-id" }));
    mocks.getPage
      .mockResolvedValueOnce(
        createPinPage({
          data: [createPin({ id: "first", title: "Primeira ideia" })],
          next: "/api/pin?page=2&limit=20",
          total: 2,
          totalPages: 2,
        }),
      )
      .mockResolvedValueOnce(
        createPinPage({
          data: [createPin({ id: "second", title: "Segunda ideia" })],
          page: 2,
          previous: "/api/pin?page=1&limit=20",
          total: 2,
          totalPages: 2,
        }),
      );

    renderWithProviders(<PinDetailsPage />);

    await screen.findByRole("heading", { name: "Referência" });
    await waitFor(() => expect(mocks.getPage).toHaveBeenCalledOnce());

    act(() => getLatestIntersectionObserver().trigger());

    await waitFor(() => expect(mocks.getPage).toHaveBeenCalledTimes(2));
    expect(mocks.getPage).toHaveBeenLastCalledWith(
      "/api/pin?page=2&limit=20",
      expect.any(AbortSignal),
    );
  });
});
