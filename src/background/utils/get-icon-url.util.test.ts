import { beforeEach, describe, expect, it, vi } from "vitest";
import { getIconUrl } from "./get-icon-url.util";
import { isSafeIconUrl } from "./is-safe-icon-url.util";

vi.mock("./is-safe-icon-url.util", () => ({
  isSafeIconUrl: vi.fn(),
}));

describe("getIconUrl", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns tab.favIconUrl when it exists and is safe", () => {
    vi.mocked(isSafeIconUrl).mockReturnValue(true);

    const result = getIconUrl(
      { favIconUrl: "https://example.com/favicon.ico" } as chrome.tabs.Tab,
      "https://example.com/extracted.ico",
    );

    expect(isSafeIconUrl).toHaveBeenCalledWith(
      "https://example.com/favicon.ico",
    );
    expect(result).toBe("https://example.com/favicon.ico");
  });

  it("returns extractedIcon when tab.favIconUrl is missing and extractedIcon is safe", () => {
    vi.mocked(isSafeIconUrl).mockReturnValue(true);

    const result = getIconUrl(
      {} as chrome.tabs.Tab,
      "https://example.com/extracted.ico",
    );

    expect(isSafeIconUrl).toHaveBeenCalledWith(
      "https://example.com/extracted.ico",
    );
    expect(result).toBe("https://example.com/extracted.ico");
  });
});
