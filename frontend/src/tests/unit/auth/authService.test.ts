import { afterEach, describe, expect, it, vi } from "vitest";
import { authService } from "@/features/auth/services/authService";
import { saveAuthToken } from "@/lib/authTokenStorage";
import { testApiUrl } from "@/tests/fixtures/api";
import { createAuthToken } from "@/tests/fixtures/auth";

describe("authService", () => {
  afterEach(() => vi.unstubAllGlobals());

  describe("login", () => {
    it("sends the credentials and returns the session token", async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            message: "Login bem-sucedido",
            token: "jwt-token",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      );
      vi.stubGlobal("fetch", fetchMock);

      await expect(
        authService.login({
          email: "user@example.com",
          password: "password123",
        }),
      ).resolves.toEqual({
        message: "Login bem-sucedido",
        token: "jwt-token",
      });

      expect(fetchMock).toHaveBeenCalledWith(
        `${testApiUrl}/api/user/login`,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "user@example.com",
            password: "password123",
          }),
        }),
      );
    });

    it("surfaces the error message returned by the API", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          new Response(
            JSON.stringify({ message: "Email ou senha incorretos." }),
            {
              status: 401,
              headers: { "Content-Type": "application/json" },
            },
          ),
        ),
      );

      await expect(
        authService.login({
          email: "user@example.com",
          password: "wrong-password",
        }),
      ).rejects.toThrow("Email ou senha incorretos.");
    });

    it("rejects a successful response without a token", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          new Response(JSON.stringify({ message: "Login bem-sucedido" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        ),
      );

      await expect(
        authService.login({
          email: "user@example.com",
          password: "password123",
        }),
      ).rejects.toThrow("A resposta do servidor não contém uma sessão válida.");
    });
  });

  describe("register", () => {
    const avatar = new File(["avatar"], "avatar.png", {
      type: "image/png",
    });
    const registrationData = {
      name: "Maria Silva",
      email: "maria@example.com",
      password: "password123",
      image: avatar,
    };

    it("sends the new account data to the API", async () => {
      const responseBody = {
        message: "Usuário criado com sucesso",
        data: {
          id: "user-id",
          name: "Maria Silva",
          email: "maria@example.com",
          pathImageUser: "/favicon.svg",
          role: "user",
        },
      };
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify(responseBody), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }),
      );
      vi.stubGlobal("fetch", fetchMock);

      await expect(authService.register(registrationData)).resolves.toEqual(
        responseBody,
      );

      expect(fetchMock).toHaveBeenCalledWith(
        `${testApiUrl}/api/user`,
        expect.objectContaining({
          method: "POST",
          body: expect.any(FormData),
        }),
      );
      const request = fetchMock.mock.calls[0][1] as RequestInit;
      const body = request.body as FormData;
      expect(request.headers).toBeUndefined();
      expect(body.get("name")).toBe("Maria Silva");
      expect(body.get("email")).toBe("maria@example.com");
      expect(body.get("password")).toBe("password123");
      expect(body.get("image")).toBe(avatar);
    });

    it("surfaces a registration error returned by the API", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          new Response(JSON.stringify({ message: "Email já está em uso." }), {
            status: 409,
            headers: { "Content-Type": "application/json" },
          }),
        ),
      );

      await expect(authService.register(registrationData)).rejects.toThrow(
        "Email já está em uso.",
      );
    });
  });

  describe("getCurrentUser", () => {
    it("returns the authenticated user", async () => {
      const token = createAuthToken();
      const currentUser = {
        id: "user-id",
        name: "Maria Silva",
        email: "maria@example.com",
        pathImageUser: "https://example.com/avatar.jpg",
        role: "user",
        readOnly: false,
      };
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify(currentUser), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
      vi.stubGlobal("fetch", fetchMock);
      saveAuthToken(token);

      await expect(authService.getCurrentUser()).resolves.toEqual(currentUser);
      expect(fetchMock).toHaveBeenCalledWith(`${testApiUrl}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    });
  });

  describe("updateProfile", () => {
    it("sends profile fields as authenticated FormData", async () => {
      const token = createAuthToken();
      const avatar = new File(["avatar"], "avatar.webp", {
        type: "image/webp",
      });
      const responseBody = {
        message: "Usuário atualizado com sucesso",
        data: {
          id: "user-id",
          name: "Maria Souza",
          email: "maria@example.com",
          pathImageUser: "https://example.com/new-avatar.webp",
          role: "user",
        },
      };
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify(responseBody), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
      vi.stubGlobal("fetch", fetchMock);
      saveAuthToken(token);

      await expect(
        authService.updateProfile({
          id: "user-id",
          name: "Maria Souza",
          password: "novaSenha123",
          image: avatar,
        }),
      ).resolves.toEqual(responseBody);

      const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit];
      const body = request.body as FormData;

      expect(url).toBe(`${testApiUrl}/api/user/user-id`);
      expect(request.method).toBe("PUT");
      expect(request.headers).toEqual({
        Authorization: `Bearer ${token}`,
      });
      expect(body.get("name")).toBe("Maria Souza");
      expect(body.get("password")).toBe("novaSenha123");
      expect(body.get("image")).toBe(avatar);
    });
  });

  describe("validateSession", () => {
    it("validates the token through the current-user endpoint", async () => {
      const fetchMock = vi
        .fn()
        .mockResolvedValue(new Response("{}", { status: 200 }));
      vi.stubGlobal("fetch", fetchMock);

      await expect(authService.validateSession("valid-token")).resolves.toBe(
        true,
      );
      expect(fetchMock).toHaveBeenCalledWith(`${testApiUrl}/api/user/me`, {
        headers: { Authorization: "Bearer valid-token" },
      });
    });

    it.each([401, 403])(
      "returns false when the API responds with %s",
      async (status) => {
        vi.stubGlobal(
          "fetch",
          vi.fn().mockResolvedValue(new Response(null, { status })),
        );

        await expect(
          authService.validateSession("invalid-token"),
        ).resolves.toBe(false);
      },
    );

    it("throws when session validation is unavailable", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(new Response(null, { status: 500 })),
      );

      await expect(authService.validateSession("token")).rejects.toThrow(
        "Não foi possível validar sua sessão.",
      );
    });
  });
});
