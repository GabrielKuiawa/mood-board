import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SavedFoldersPage } from "@/features/folders/pages/SavedFoldersPage";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";

const mocks = vi.hoisted(() => ({
  getMine: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    params,
    ...props
  }: {
    children: ReactNode;
    to: string;
    params?: { folderId?: string };
  } & AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={params?.folderId ? to.replace("$folderId", params.folderId) : to}
      {...props}
    >
      {children}
    </a>
  ),
}));

vi.mock("@/features/auth/hooks/useCurrentUserQuery", () => ({
  useCurrentUserQuery: () => ({ data: { id: "user-id" } }),
}));

vi.mock("@/features/folders/services/folderService", () => ({
  folderQueryKey: (userId?: string) => ["folders", "mine", userId],
  folderService: mocks,
}));

describe("SavedFoldersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getMine.mockResolvedValue({
      data: [
        {
          id: "folder-id",
          name: "Design",
          pinCount: 1,
          previewPins: [
            {
              id: "pin-id",
              title: "Landing page",
              pathImage: "https://example.com/pin.jpg",
              description: "Referência de design",
            },
          ],
        },
      ],
    });
    mocks.delete.mockResolvedValue(undefined);
  });

  it("lists only the user's folders and opens one", async () => {
    renderWithProviders(<SavedFoldersPage />);

    expect(
      await screen.findByRole("heading", { name: "Suas ideias salvas" }),
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "Design" })).toBeVisible();
    expect(screen.getByText("1 Pin")).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Abrir pasta Design" }),
    ).toHaveAttribute("href", "/saved/folder-id");
  });

  it("opens a confirmation modal before deleting a folder", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SavedFoldersPage />);

    await user.click(
      await screen.findByRole("button", { name: "Excluir pasta Design" }),
    );

    const dialog = screen.getByRole("alertdialog", {
      name: "Excluir esta pasta?",
    });
    expect(dialog).toBeVisible();
    expect(dialog).toHaveTextContent("os Pins continuarão disponíveis no feed");
    expect(mocks.delete).not.toHaveBeenCalled();

    await user.click(
      within(dialog).getByRole("button", { name: "Excluir pasta" }),
    );

    await waitFor(() =>
      expect(mocks.delete).toHaveBeenCalledWith("folder-id", expect.anything()),
    );
  });
});
