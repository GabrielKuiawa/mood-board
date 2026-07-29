import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FolderDetailsPage } from "@/features/folders/pages/FolderDetailsPage";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";

const mocks = vi.hoisted(() => ({
  getById: vi.fn(),
  removePin: vi.fn(),
  delete: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  getRouteApi: () => ({
    useParams: () => ({ folderId: "folder-id" }),
  }),
  Link: ({
    children,
    to,
    ...props
  }: {
    children: ReactNode;
    to: string;
  } & AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => mocks.navigate,
}));

vi.mock("@/features/auth/hooks/useCurrentUserQuery", () => ({
  useCurrentUserQuery: () => ({ data: { id: "user-id" } }),
}));

vi.mock("@/features/folders/services/folderService", () => ({
  folderDetailsQueryKey: (folderId: string) => ["folders", "detail", folderId],
  folderQueryKey: (userId?: string) => ["folders", "mine", userId],
  folderService: mocks,
}));

describe("FolderDetailsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.navigate.mockResolvedValue(undefined);
    mocks.removePin.mockResolvedValue(undefined);
    mocks.delete.mockResolvedValue(undefined);
    mocks.getById.mockResolvedValue({
      id: "folder-id",
      name: "Design",
      pinCount: 1,
      previewPins: [],
      pins: [
        {
          id: "pin-id",
          title: "Landing page",
          pathImage: "https://example.com/pin.jpg",
          description: "Referência de design",
        },
      ],
    });
  });

  it("confirms before removing a Pin from the folder", async () => {
    const user = userEvent.setup();
    renderWithProviders(<FolderDetailsPage />);

    await user.click(
      await screen.findByRole("button", {
        name: "Remover Landing page da pasta",
      }),
    );

    const dialog = screen.getByRole("alertdialog", {
      name: "Remover este Pin?",
    });
    expect(dialog).toHaveTextContent("continuará disponível no feed");
    expect(mocks.removePin).not.toHaveBeenCalled();

    await user.click(
      within(dialog).getByRole("button", { name: "Remover Pin" }),
    );

    await waitFor(() =>
      expect(mocks.removePin).toHaveBeenCalledWith("folder-id", "pin-id"),
    );
  });

  it("confirms before deleting the whole folder", async () => {
    const user = userEvent.setup();
    renderWithProviders(<FolderDetailsPage />);

    await user.click(
      await screen.findByRole("button", {
        name: "Excluir pasta",
      }),
    );

    const dialog = screen.getByRole("alertdialog", {
      name: "Excluir esta pasta?",
    });
    expect(dialog).toBeVisible();
    expect(mocks.delete).not.toHaveBeenCalled();

    await user.click(
      within(dialog).getByRole("button", { name: "Excluir pasta" }),
    );

    await waitFor(() => expect(mocks.delete).toHaveBeenCalled());
    await waitFor(() =>
      expect(mocks.navigate).toHaveBeenCalledWith({ to: "/saved" }),
    );
  });
});
