import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FolderSaveControl } from "@/features/folders/components/FolderSaveControl";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";

const mocks = vi.hoisted(() => ({
  getMine: vi.fn(),
  create: vi.fn(),
  savePin: vi.fn(),
  removePin: vi.fn(),
}));

vi.mock("@/features/folders/services/folderService", () => ({
  folderQueryKey: (userId?: string) => ["folders", "mine", userId],
  folderService: mocks,
}));

vi.mock("@/features/auth/hooks/useCurrentUserQuery", () => ({
  useCurrentUserQuery: () => ({ data: { id: "user-id" } }),
}));

const folder = { id: "folder-id", name: "Inspirações", pinCount: 0 };

describe("FolderSaveControl", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getMine.mockResolvedValue({ data: [folder] });
    mocks.savePin.mockResolvedValue({
      message: "Pin salvo na pasta",
      data: { ...folder, pinCount: 1 },
    });
    mocks.removePin.mockResolvedValue(undefined);
    mocks.create.mockResolvedValue({
      message: "Pasta criada",
      data: { id: "new-folder", name: "Nova pasta", pinCount: 0 },
    });
  });

  it("saves a Pin in the selected folder", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <FolderSaveControl pinId="pin-id" savedFolderIds={[]} />,
    );

    await screen.findByRole("button", { name: /Inspirações/ });
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() =>
      expect(mocks.savePin).toHaveBeenCalledWith("folder-id", "pin-id"),
    );
    expect(await screen.findByRole("button", { name: /Salvo/ })).toBeVisible();
  });

  it("removes a Pin that is already saved", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <FolderSaveControl pinId="pin-id" savedFolderIds={["folder-id"]} />,
    );

    await user.click(await screen.findByRole("button", { name: /Salvo/ }));

    await waitFor(() =>
      expect(mocks.removePin).toHaveBeenCalledWith("folder-id", "pin-id"),
    );
  });

  it("creates the first folder from the selector", async () => {
    const user = userEvent.setup();
    mocks.getMine.mockResolvedValue({ data: [] });
    renderWithProviders(
      <FolderSaveControl pinId="pin-id" savedFolderIds={[]} />,
    );

    await user.click(
      await screen.findByRole("button", { name: /Criar pasta/ }),
    );
    await user.click(
      within(screen.getByRole("dialog", { name: "Salvar Pin" })).getByRole(
        "button",
        { name: "Criar pasta" },
      ),
    );
    await user.type(screen.getByLabelText("Nome da nova pasta"), "Nova pasta");
    await user.click(
      within(screen.getByRole("dialog", { name: "Salvar Pin" })).getByRole(
        "button",
        {
          name: "Criar",
        },
      ),
    );

    await waitFor(() => expect(mocks.create).toHaveBeenCalled());
    expect(mocks.create.mock.calls[0][0]).toBe("Nova pasta");
    await waitFor(() =>
      expect(mocks.savePin).toHaveBeenCalledWith("new-folder", "pin-id"),
    );
  });

  it("filters the current user's folders", async () => {
    const user = userEvent.setup();
    mocks.getMine.mockResolvedValue({
      data: [folder, { id: "travel", name: "Viagens", pinCount: 0 }],
    });
    renderWithProviders(
      <FolderSaveControl pinId="pin-id" savedFolderIds={[]} />,
    );

    await user.click(
      await screen.findByRole("button", { name: /Inspirações/ }),
    );
    await user.type(screen.getByLabelText("Pesquisar suas pastas"), "viag");

    const dialog = screen.getByRole("dialog", { name: "Salvar Pin" });
    expect(within(dialog).getByText("Viagens")).toBeVisible();
    expect(within(dialog).queryByText("Inspirações")).not.toBeInTheDocument();
  });

  it("shows user folders and dynamic suggestions in the same menu", async () => {
    const user = userEvent.setup();
    mocks.getMine.mockResolvedValue({
      data: [
        folder,
        { id: "design", name: "Design", pinCount: 4 },
        { id: "travel", name: "Viagens", pinCount: 1 },
      ],
    });
    renderWithProviders(
      <FolderSaveControl
        pinId="pin-id"
        pinTitle="Web design moderno"
        pinDescription="Referência para página de vendas"
        savedFolderIds={[]}
      />,
    );

    await user.click(
      await screen.findByRole("button", { name: /Inspirações/ }),
    );

    const dialog = screen.getByRole("dialog", { name: "Salvar Pin" });
    expect(
      within(dialog).queryByText("Principais escolhas"),
    ).not.toBeInTheDocument();
    expect(within(dialog).getByText("Todas as pastas")).toBeVisible();
    expect(within(dialog).getByText("Sugestões")).toBeVisible();
    expect(within(dialog).getByText("Inspirações")).toBeVisible();
    expect(within(dialog).getByText("Inspirações de Web")).toBeVisible();

    await user.click(
      within(dialog).getByRole("button", {
        name: /Inspirações de Web.*Criar/,
      }),
    );
    await waitFor(() => expect(mocks.create).toHaveBeenCalled());
    expect(mocks.create.mock.calls[0][0]).toBe("Inspirações de Web");
  });

  it("saves immediately when an existing folder is selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <FolderSaveControl pinId="pin-id" savedFolderIds={[]} />,
    );

    await user.click(
      await screen.findByRole("button", { name: /Inspirações/ }),
    );
    await user.click(
      within(screen.getByRole("dialog", { name: "Salvar Pin" })).getByRole(
        "button",
        {
          name: /Inspirações/,
        },
      ),
    );

    await waitFor(() =>
      expect(mocks.savePin).toHaveBeenCalledWith("folder-id", "pin-id"),
    );
    expect(
      screen.queryByRole("dialog", { name: "Salvar Pin" }),
    ).not.toBeInTheDocument();
  });

  it("renders the selector dialog outside the card layout", async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(
      <FolderSaveControl
        pinId="pin-id"
        savedFolderIds={[]}
        variant="overlay"
      />,
    );

    await user.click(
      await screen.findByRole("button", { name: /Inspirações/ }),
    );

    const dialog = await screen.findByRole("dialog", { name: "Salvar Pin" });
    expect(dialog).toHaveClass("fixed");
    expect(container).not.toContainElement(dialog);
  });
});
