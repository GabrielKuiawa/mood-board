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
