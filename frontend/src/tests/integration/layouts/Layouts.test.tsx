import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  clearAuthToken: vi.fn(),
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

vi.mock("@/features/search/services/searchService", () => ({
  searchService: { getSuggestions: mocks.getSuggestions },
}));

import { AppLayout } from "@/app/layouts/AppLayout";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";

describe("AppLayout", () => {
  beforeEach(() => {
    mocks.clearAuthToken.mockReset();
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
    expect(screen.getByRole("link", { name: "Criar Pin" })).toHaveAttribute(
      "href",
      "/create",
    );
    expect(screen.getByRole("link", { name: "Ideias salvas" })).toHaveAttribute(
      "href",
      "/saved",
    );
    expect(screen.getByText("Conteúdo da rota")).toBeVisible();
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
