import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SearchBar } from "@/features/search/components/SearchBar";
import { SearchProvider } from "@/features/search/context/SearchProvider";
import { useSearchContext } from "@/features/search/hooks/useSearchContext";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";

const mocks = vi.hoisted(() => ({
  getSuggestions: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mocks.navigate,
}));

vi.mock("@/features/search/services/searchService", () => ({
  searchService: { getSuggestions: mocks.getSuggestions },
}));

function ActiveSearchReader() {
  const { activeSearch } = useSearchContext();

  return (
    <output aria-label="Pesquisa ativa">{JSON.stringify(activeSearch)}</output>
  );
}

function renderSearchBar() {
  return renderWithProviders(
    <SearchProvider>
      <SearchBar />
      <ActiveSearchReader />
    </SearchProvider>,
  );
}

describe("SearchBar", () => {
  beforeEach(() => {
    mocks.getSuggestions.mockReset().mockResolvedValue({ data: [] });
    mocks.navigate.mockReset().mockResolvedValue(undefined);
  });

  it("preloads suggestions before the field receives focus", async () => {
    renderSearchBar();

    await waitFor(() =>
      expect(mocks.getSuggestions).toHaveBeenCalledWith(
        "",
        expect.any(AbortSignal),
      ),
    );

    await userEvent.click(screen.getByRole("combobox", { name: "Pesquisar" }));

    expect(
      screen.getByRole("listbox", { name: "Sugestões de pesquisa" }),
    ).toBeVisible();
  });

  it("applies the selected suggestion as an exact feed filter", async () => {
    mocks.getSuggestions.mockImplementation(async (query: string) => ({
      data:
        query === "arte"
          ? [
              {
                type: "pin",
                id: "pin-id",
                label: "Arte abstrata",
                subtitle: "Pin de Ana",
              },
            ]
          : [],
    }));
    const user = userEvent.setup();
    renderSearchBar();

    await user.type(
      screen.getByRole("combobox", { name: "Pesquisar" }),
      "arte",
    );
    await screen.findByText("Arte abstrata");
    const suggestion = screen.getByRole("option");
    await user.click(suggestion);

    expect(screen.getByLabelText("Pesquisa ativa")).toHaveTextContent(
      JSON.stringify({
        query: "Arte abstrata",
        label: "Arte abstrata",
        type: "pin",
        id: "pin-id",
      }),
    );
    expect(mocks.navigate).toHaveBeenCalledWith({ to: "/feed" });
  });

  it("supports keyboard navigation and selection", async () => {
    mocks.getSuggestions.mockResolvedValue({
      data: [
        {
          type: "user",
          id: "user-id",
          label: "Joy Cho",
          subtitle: "Criador",
        },
      ],
    });
    const user = userEvent.setup();
    renderSearchBar();

    const input = screen.getByRole("combobox", { name: "Pesquisar" });
    await user.click(input);
    await screen.findByText("Joy Cho");
    await user.keyboard("{ArrowDown}{Enter}");

    expect(screen.getByLabelText("Pesquisa ativa")).toHaveTextContent(
      '"type":"user"',
    );
    expect(input).toHaveValue("Joy Cho");
    expect(mocks.navigate).toHaveBeenCalledWith({ to: "/feed" });
  });

  it("opens the feed when submitting a text search", async () => {
    const user = userEvent.setup();
    renderSearchBar();

    await user.type(
      screen.getByRole("combobox", { name: "Pesquisar" }),
      "decoração{Enter}",
    );

    expect(screen.getByLabelText("Pesquisa ativa")).toHaveTextContent(
      '"query":"decoração"',
    );
    expect(mocks.navigate).toHaveBeenCalledWith({ to: "/feed" });
  });
});
