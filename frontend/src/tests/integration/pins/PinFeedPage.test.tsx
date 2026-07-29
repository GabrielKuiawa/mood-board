import { act, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SearchProvider } from "@/features/search/context/SearchProvider";
import { createPin, createPinPage } from "@/tests/fixtures/pins";
import { getLatestIntersectionObserver } from "@/tests/mocks/browserObservers";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";

const mocks = vi.hoisted(() => ({
  createInitialPinsPage: vi.fn(() => "/api/pin?page=1&limit=20"),
  getPage: vi.fn(),
}));

vi.mock("@/features/pins/services/pinService", () => ({
  createInitialPinsPage: mocks.createInitialPinsPage,
  pinService: { getPage: mocks.getPage },
}));

vi.mock("@/features/pins/components/PinList", () => ({
  PinList: ({
    pins,
    isLoadingMore,
  }: {
    pins: { id: string; title: string }[];
    isLoadingMore?: boolean;
  }) => (
    <div aria-label="Lista de Pins" data-loading={isLoadingMore}>
      {pins.map((pin) => (
        <span key={pin.id}>{pin.title}</span>
      ))}
      {pins.length === 0 && <span>Lista vazia</span>}
    </div>
  ),
}));

vi.mock("@/features/pins/components/PinListSkeleton", () => ({
  PinListSkeleton: () => <div role="status">Carregando feed</div>,
}));

import { PinFeedPage } from "@/features/pins/pages/PinFeedPage";

function renderFeedPage(element: ReactElement = <PinFeedPage />) {
  return renderWithProviders(<SearchProvider>{element}</SearchProvider>);
}

describe("PinFeedPage", () => {
  beforeEach(() => {
    mocks.createInitialPinsPage.mockClear();
    mocks.getPage.mockReset();
  });

  it("shows the feed skeleton while the first page is loading", () => {
    mocks.getPage.mockReturnValue(new Promise(() => {}));

    renderFeedPage();

    expect(screen.getByRole("status")).toHaveTextContent("Carregando feed");
  });

  it("shows the API error when the first page cannot be loaded", async () => {
    mocks.getPage.mockRejectedValue(new Error("Falha ao carregar o feed."));

    renderFeedPage();

    expect(await screen.findByText("Falha ao carregar o feed.")).toBeVisible();
  });

  it("renders an empty feed", async () => {
    mocks.getPage.mockResolvedValue(createPinPage({ data: [] }));

    renderFeedPage();

    expect(await screen.findByText("Lista vazia")).toBeVisible();
  });

  it("preserves the Pin order returned by the API", async () => {
    mocks.getPage.mockResolvedValue(
      createPinPage({
        data: [
          createPin({ id: "third", title: "Terceira" }),
          createPin({ id: "first", title: "Primeira" }),
          createPin({ id: "second", title: "Segunda" }),
        ],
      }),
    );

    renderFeedPage();

    const list = await screen.findByLabelText("Lista de Pins");
    expect(list).toHaveTextContent("TerceiraPrimeiraSegunda");
  });

  it("loads the next page when the pagination marker becomes visible", async () => {
    const firstPin = createPin({ id: "first", title: "Primeira" });
    const secondPin = createPin({ id: "second", title: "Segunda" });
    mocks.getPage
      .mockResolvedValueOnce(
        createPinPage({
          data: [firstPin],
          next: "http://api.test/api/pin?page=2&limit=20",
          total: 2,
          totalPages: 2,
        }),
      )
      .mockResolvedValueOnce(
        createPinPage({
          data: [secondPin],
          page: 2,
          previous: "http://api.test/api/pin?page=1&limit=20",
          total: 2,
          totalPages: 2,
        }),
      );

    renderFeedPage();

    expect(await screen.findByText("Primeira")).toBeVisible();
    await waitFor(() => expect(mocks.getPage).toHaveBeenCalledOnce());

    act(() => getLatestIntersectionObserver().trigger());

    expect(await screen.findByText("Segunda")).toBeVisible();
    expect(mocks.getPage).toHaveBeenNthCalledWith(
      2,
      "http://api.test/api/pin?page=2&limit=20",
      expect.any(AbortSignal),
    );
  });
});
