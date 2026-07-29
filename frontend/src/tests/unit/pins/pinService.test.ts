import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { saveAuthToken } from "@/lib/authTokenStorage";
import {
  createInitialPinsPage,
  pinService,
} from "@/features/pins/services/pinService";
import { testApiUrl } from "@/tests/fixtures/api";
import { createAuthToken } from "@/tests/fixtures/auth";
import { createPin, createPinPage } from "@/tests/fixtures/pins";

const pin = createPin();

describe("pinService", () => {
  beforeEach(() => saveAuthToken(createAuthToken()));

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends the bearer token when loading a Pin", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(pin), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(pinService.getById("pin-id")).resolves.toEqual(pin);
    expect(fetchMock).toHaveBeenCalledWith(
      `${testApiUrl}/api/pin/pin-id`,
      expect.objectContaining({
        headers: { Authorization: expect.stringMatching(/^Bearer /) },
      }),
    );
  });

  it("loads an authenticated Pin page", async () => {
    const page = createPinPage({ data: [pin] });
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(page), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const pageUrl = `${testApiUrl}/api/pin?page=1&limit=20`;
    await expect(pinService.getPage(pageUrl)).resolves.toEqual(page);
    expect(fetchMock).toHaveBeenCalledWith(
      pageUrl,
      expect.objectContaining({
        headers: { Authorization: expect.stringMatching(/^Bearer /) },
      }),
    );
  });

  it("creates a Pin with image data and folders", async () => {
    const file = new File(["pin"], "pin.webp", { type: "image/webp" });
    const responseBody = {
      message: "Pin criado com sucesso",
      data: pin,
    };
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(responseBody), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      pinService.create({
        title: "Sala aconchegante",
        description: "Referência de decoração",
        image: file,
        folderIds: ["folder-1", "folder-2"],
      }),
    ).resolves.toEqual(responseBody);

    const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = request.body as FormData;
    expect(url).toBe(`${testApiUrl}/api/pin`);
    expect(request.method).toBe("POST");
    expect(body.get("title")).toBe("Sala aconchegante");
    expect(body.get("description")).toBe("Referência de decoração");
    expect(body.get("image")).toBe(file);
    expect(body.getAll("folderIds")).toEqual(["folder-1", "folder-2"]);
  });

  it("likes and unlikes a Pin through authenticated endpoints", async () => {
    const likedPin = {
      ...pin,
      likeCount: 1,
      likedByCurrentUser: true,
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ message: "Pin curtido", data: likedPin }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            message: "Curtida removida",
            data: pin,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(pinService.like("pin-id")).resolves.toMatchObject({
      data: { likeCount: 1, likedByCurrentUser: true },
    });
    await expect(pinService.unlike("pin-id")).resolves.toMatchObject({
      data: { likeCount: 0, likedByCurrentUser: false },
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      `${testApiUrl}/api/pin/pin-id/likes`,
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      `${testApiUrl}/api/pin/pin-id/likes`,
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("loads Pins created by a user and deletes one", async () => {
    const page = createPinPage({ data: [pin] });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify(page), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(pinService.getCreatedByUser("user-id")).resolves.toEqual(page);
    await expect(pinService.delete("pin-id")).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      `${testApiUrl}/api/pin?page=1&limit=100&type=user&id=user-id`,
      expect.objectContaining({
        headers: { Authorization: expect.stringMatching(/^Bearer /) },
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      `${testApiUrl}/api/pin/pin-id`,
      expect.objectContaining({
        method: "DELETE",
        headers: { Authorization: expect.stringMatching(/^Bearer /) },
      }),
    );
  });

  it("builds a feed URL with text and exact suggestion filters", () => {
    expect(
      createInitialPinsPage({
        query: "Arte abstrata",
        label: "Arte abstrata",
        type: "pin",
        id: "pin-id",
      }),
    ).toBe("/api/pin?page=1&limit=20&q=Arte+abstrata&type=pin&id=pin-id");
  });

  it("reports an expired server session", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 401 })),
    );

    await expect(pinService.getById("pin-id")).rejects.toThrow(
      "Sua sessão expirou. Entre novamente.",
    );
  });
});
