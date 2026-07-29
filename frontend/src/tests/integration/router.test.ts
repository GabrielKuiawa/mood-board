import { RouterProvider } from "@tanstack/react-router";
import { act, screen } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { router } from "@/app/router";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";

describe("application router", () => {
  it("registers the public and authenticated routes", () => {
    expect(Object.keys(router.routesByPath)).toEqual(
      expect.arrayContaining([
        "/",
        "/feed",
        "/create",
        "/login",
        "/signup",
        "/pins/$pinId",
        "/saved",
        "/saved/$folderId",
      ]),
    );
  });

  it("renders the landing page at the public root and protects the feed", async () => {
    await router.navigate({ to: "/" });
    renderWithProviders(createElement(RouterProvider, { router }));

    expect(
      await screen.findByRole("heading", {
        name: "Guarde o que faz você parar.",
      }),
    ).toBeVisible();

    await act(() => router.navigate({ to: "/feed" }));

    expect(
      await screen.findByRole("heading", { name: "Entre na sua conta" }),
    ).toBeVisible();
  });
});
