import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";

const mocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  updateProfile: vi.fn(),
}));

vi.mock("@/features/auth/services/authService", () => ({
  authService: {
    getCurrentUser: mocks.getCurrentUser,
    updateProfile: mocks.updateProfile,
  },
}));

import { UserMenu } from "@/features/auth/components/UserMenu";

describe("UserMenu", () => {
  beforeEach(() => {
    const currentUser = {
      id: "user-id",
      name: "Maria Silva",
      email: "maria@example.com",
      pathImageUser: "https://example.com/avatar.jpg",
      role: "user",
      readOnly: false,
    };
    mocks.getCurrentUser.mockReset().mockResolvedValue(currentUser);
    mocks.updateProfile.mockReset().mockResolvedValue({
      message: "Usuário atualizado com sucesso",
      data: currentUser,
    });
  });

  it("loads the current user on render and exposes logout", async () => {
    const user = userEvent.setup();
    const onLogout = vi.fn();
    renderWithProviders(<UserMenu onLogout={onLogout} />);

    await waitFor(() => {
      expect(mocks.getCurrentUser).toHaveBeenCalledOnce();
    });

    await user.click(
      screen.getByRole("button", { name: "Abrir menu do usuário" }),
    );

    expect(
      await screen.findByRole("dialog", { name: "Menu do usuário" }),
    ).toBeVisible();
    expect(await screen.findByText("Maria Silva")).toBeVisible();
    expect(screen.getByText("maria@example.com")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Sair" }));
    expect(onLogout).toHaveBeenCalledOnce();
  });

  it("edits the profile inside the account menu", async () => {
    const user = userEvent.setup();
    mocks.updateProfile.mockResolvedValue({
      message: "Usuário atualizado com sucesso",
      data: {
        id: "user-id",
        name: "Maria Souza",
        email: "maria@example.com",
        pathImageUser: "https://example.com/avatar.jpg",
        role: "user",
        readOnly: false,
      },
    });
    renderWithProviders(<UserMenu onLogout={vi.fn()} />);

    await user.click(
      screen.getByRole("button", { name: "Abrir menu do usuário" }),
    );
    await user.click(
      await screen.findByRole("button", { name: "Editar perfil" }),
    );

    const nameInput = screen.getByRole("textbox", { name: "Nome" });
    await user.clear(nameInput);
    await user.type(nameInput, "Maria Souza");
    const passwordInput = screen.getByLabelText("Nova senha");
    await user.type(passwordInput, "novaSenha123");
    expect(passwordInput).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "Mostrar senha" }));
    expect(passwordInput).toHaveAttribute("type", "text");
    await user.click(screen.getByRole("button", { name: "Ocultar senha" }));
    expect(passwordInput).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => {
      expect(mocks.updateProfile).toHaveBeenCalledWith({
        id: "user-id",
        name: "Maria Souza",
        password: "novaSenha123",
        image: undefined,
      });
    });
    expect(await screen.findByText("Maria Souza")).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Salvar" }),
    ).not.toBeInTheDocument();
  });

  it("does not offer profile editing to the demo account", async () => {
    const user = userEvent.setup();
    mocks.getCurrentUser.mockResolvedValue({
      id: "demo-user-id",
      name: "Conta Demo",
      email: "demo@example.com",
      pathImageUser: "https://example.com/demo-avatar.jpg",
      role: "user",
      readOnly: true,
    });

    renderWithProviders(<UserMenu onLogout={vi.fn()} />);

    await user.click(
      screen.getByRole("button", { name: "Abrir menu do usuário" }),
    );

    expect(await screen.findByText("Conta Demo")).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Editar perfil" }),
    ).not.toBeInTheDocument();
  });

  it("closes when Escape is pressed", async () => {
    const user = userEvent.setup();
    renderWithProviders(<UserMenu onLogout={vi.fn()} />);

    await user.click(
      screen.getByRole("button", { name: "Abrir menu do usuário" }),
    );
    expect(
      await screen.findByRole("dialog", { name: "Menu do usuário" }),
    ).toBeVisible();

    await user.keyboard("{Escape}");
    expect(
      screen.queryByRole("dialog", { name: "Menu do usuário" }),
    ).not.toBeInTheDocument();
  });
});
