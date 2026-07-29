import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreatedPinsSection } from "@/features/pins/components/CreatedPinsSection";
import { createPin, createPinPage } from "@/tests/fixtures/pins";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";

const mocks = vi.hoisted(() => ({
  getCreatedByUser: vi.fn(),
  deletePin: vi.fn(),
}));

vi.mock("@/features/pins/services/pinService", () => ({
  pinService: {
    getCreatedByUser: mocks.getCreatedByUser,
    delete: mocks.deletePin,
  },
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

describe("CreatedPinsSection", () => {
  beforeEach(() => {
    mocks.getCreatedByUser.mockReset().mockResolvedValue(
      createPinPage({
        data: [
          createPin({
            id: "owned-pin",
            title: "Meu Pin",
            folders: [{ id: "folder-id", name: "Ideias" }],
          }),
        ],
      }),
    );
    mocks.deletePin.mockReset().mockResolvedValue(undefined);
  });

  it("lists only the requested user's Pins and confirms deletion", async () => {
    const user = userEvent.setup();

    renderWithProviders(<CreatedPinsSection userId="current-user" />);

    expect(
      await screen.findByRole("heading", { name: "Seus Pins" }),
    ).toBeVisible();
    expect(mocks.getCreatedByUser).toHaveBeenCalledWith(
      "current-user",
      expect.any(AbortSignal),
    );
    expect(
      await screen.findByRole("link", { name: "Ver Meu Pin" }),
    ).toHaveAttribute("href", "/pins/owned-pin");
    expect(screen.getByText("1 pasta")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Excluir Meu Pin" }));
    expect(
      screen.getByRole("alertdialog", { name: "Excluir Pin?" }),
    ).toHaveTextContent(
      "será removido das suas pastas e a imagem será apagada do armazenamento",
    );

    await user.click(screen.getByRole("button", { name: "Excluir Pin" }));

    await waitFor(() =>
      expect(mocks.deletePin).toHaveBeenCalledWith("owned-pin"),
    );
    await waitFor(() =>
      expect(
        screen.queryByRole("alertdialog", { name: "Excluir Pin?" }),
      ).not.toBeInTheDocument(),
    );
  });
});
