import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { folderService } from "@/features/folders/services/folderService";
import { saveAuthToken } from "@/lib/authTokenStorage";
import { testApiUrl } from "@/tests/fixtures/api";
import { createAuthToken } from "@/tests/fixtures/auth";

describe("folderService", () => {
  beforeEach(() => saveAuthToken(createAuthToken()));

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads the authenticated folder details", async () => {
    const folder = {
      id: "folder-id",
      name: "Design",
      pinCount: 1,
      previewPins: [],
      pins: [],
    };
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(folder), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(folderService.getById("folder-id")).resolves.toEqual(folder);
    expect(fetchMock).toHaveBeenCalledWith(
      `${testApiUrl}/api/folder/folder-id`,
      expect.objectContaining({
        headers: { Authorization: expect.stringMatching(/^Bearer /) },
      }),
    );
  });

  it("deletes a folder without deleting its Pins", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(folderService.delete("folder-id")).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith(
      `${testApiUrl}/api/folder/folder-id`,
      expect.objectContaining({
        method: "DELETE",
        headers: { Authorization: expect.stringMatching(/^Bearer /) },
      }),
    );
  });

  it("removes only the selected Pin from a folder", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      folderService.removePin("folder-id", "pin-id"),
    ).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith(
      `${testApiUrl}/api/folder/folder-id/pins/pin-id`,
      expect.objectContaining({
        method: "DELETE",
        headers: { Authorization: expect.stringMatching(/^Bearer /) },
      }),
    );
  });
});
