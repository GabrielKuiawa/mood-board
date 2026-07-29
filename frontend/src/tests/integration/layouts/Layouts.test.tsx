import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  clearAuthToken: vi.fn(),
  getCurrentUser: vi.fn(),
  getSuggestions: vi.fn().mockResolvedValue({ data: [] }),
  navigate: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
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
  Outlet: () => <main>Conteúdo da rota</main>,
  useNavigate: () => mocks.navigate,
}));

vi.mock("@/lib/authTokenStorage", () => ({
  clearAuthToken: mocks.clearAuthToken,
}));

vi.mock("@/features/auth/services/authService", () => ({
  authService: {
    getCurrentUser: mocks.getCurrentUser,
  },
}));

vi.mock("@/features/search/services/searchService", () => ({
  searchService: { getSuggestions: mocks.getSuggestions },
}));

import { AppLayout } from "@/app/layouts/AppLayout";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";

describe("AppLayout", () => {
  beforeEach(() => {
    mocks.clearAuthToken.mockReset();
    mocks.getCurrentUser.mockReset().mockResolvedValue({
      id: "user-id",
      name: "Maria Silva",
      email: "maria@example.com",
      pathImageUser: "https://example.com/avatar.jpg",
      role: "user",
      readOnly: false,
    });
    mocks.navigate.mockReset().mockResolvedValue(undefined);
  });

  it("keeps navigation separate from the active route content", () => {
    renderWithProviders(<AppLayout />);

    expect(screen.getByRole("banner")).toBeVisible();
    expect(
      screen.getByRole("complementary", { name: "Barra lateral" }),
    ).toBeVisible();
    expect(
      screen.getByRole("navigation", { name: "Navegação principal" }),
    ).toBeVisible();
    expect(screen.getByRole("combobox", { name: "Pesquisar" })).toBeVisible();
    expect(screen.getByRole("link", { name: "mood board" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Início" })).toHaveAttribute(
      "href",
      "/feed",
    );
    expect(screen.getByRole("link", { name: "Pesquisar" })).toHaveAttribute(
      "href",
      "/search",
    );
    expect(screen.getByRole("link", { name: "Criar Pin" })).toHaveAttribute(
      "href",
      "/create",
    );
    expect(screen.getByRole("link", { name: "Ideias salvas" })).toHaveAttribute(
      "href",
      "/saved",
    );
    expect(screen.getByRole("link", { name: "Meus Pins" })).toHaveAttribute(
      "href",
      "/my-pins",
    );
    expect(screen.getByText("Conteúdo da rota")).toBeVisible();
  });

  it("warns about demo account restrictions and links to registration", async () => {
    const user = userEvent.setup();
    mocks.getCurrentUser.mockResolvedValue({
      id: "demo-user-id",
      name: "Conta Demo",
      email: "demo@example.com",
      pathImageUser: "https://example.com/demo-avatar.jpg",
      role: "user",
      readOnly: true,
    });

    renderWithProviders(<AppLayout />);

    expect(
      await screen.findByRole("region", { name: "Aviso da conta demo" }),
    ).toBeVisible();
    expect(screen.getByText("Você está em uma conta demo")).toBeVisible();
    expect(screen.getByText(/Não é possível alterar dados/)).toBeVisible();
    expect(
      screen.queryByRole("link", { name: "Criar Pin" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByLabelText("Criar Pin indisponível na conta demo"),
    ).toHaveAttribute("aria-disabled", "true");

    const createAccountLink = screen.getByRole("link", {
      name: "Criar minha conta",
    });
    expect(createAccountLink).toHaveAttribute("href", "/signup");
    await user.click(createAccountLink);
    expect(mocks.clearAuthToken).toHaveBeenCalledOnce();
  });

  it("clears the token and opens login on logout", async () => {
    const user = userEvent.setup();
    const { queryClient } = renderWithProviders(<AppLayout />);
    const previousUserFoldersKey = ["folders", "mine", "previous-user"];
    queryClient.setQueryData(previousUserFoldersKey, {
      data: [{ id: "private-folder" }],
    });

    await user.click(
      screen.getByRole("button", { name: "Abrir menu do usuário" }),
    );
    await user.click(screen.getByRole("button", { name: "Sair" }));

    expect(mocks.clearAuthToken).toHaveBeenCalledOnce();
    expect(queryClient.getQueryData(previousUserFoldersKey)).toBeUndefined();
    expect(mocks.navigate).toHaveBeenCalledWith({ to: "/login" });
  });
});

describe("AuthLayout", () => {
  it("composes shared branding, hero, footer, and form panel", () => {
    render(
      <AuthLayout
        hero={<h1>Mensagem principal</h1>}
        footer={<p>Mensagem de apoio</p>}
        panelClassName="max-w-md"
      >
        <form aria-label="Formulário de autenticação" />
      </AuthLayout>,
    );

    expect(screen.getAllByRole("link", { name: "mood board" })).toHaveLength(2);
    expect(
      screen.getByRole("heading", { name: "Mensagem principal" }),
    ).toBeVisible();
    expect(screen.getByText("Mensagem de apoio")).toBeVisible();
    expect(
      screen.getByRole("form", { name: "Formulário de autenticação" }),
    ).toBeVisible();
  });
});
