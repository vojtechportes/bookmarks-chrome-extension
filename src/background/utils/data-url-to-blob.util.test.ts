import { describe, expect, it, vi, beforeEach } from "vitest";
import { dataUrlToBlob } from "./data-url-to-blob.util";

describe("dataUrlToBlob", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches the data URL and returns a blob", async () => {
    const dataUrl = "data:image/png;base64,abc123";
    const blob = new Blob(["test"], { type: "image/png" });

    const blobMock = vi.fn().mockResolvedValue(blob);

    const fetchMock = vi.fn().mockResolvedValue({
      blob: blobMock,
    });

    vi.stubGlobal("fetch", fetchMock);

    const result = await dataUrlToBlob(dataUrl);

    expect(fetchMock).toHaveBeenCalledWith(dataUrl);
    expect(blobMock).toHaveBeenCalled();
    expect(result).toBe(blob);
  });
});