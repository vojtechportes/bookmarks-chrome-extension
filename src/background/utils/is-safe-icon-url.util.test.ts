import { describe, expect, it } from "vitest";
import { isSafeIconUrl } from "./is-safe-icon-url.util";

describe("isSafeIconUrl", () => {
  it("returns true for http urls", () => {
    expect(isSafeIconUrl("http://example.com/favicon.ico")).toBe(true);
  });

  it("returns true for https urls", () => {
    expect(isSafeIconUrl("https://example.com/favicon.ico")).toBe(true);
  });

  it("returns true for data urls", () => {
    expect(
      isSafeIconUrl("data:image/png;base64,abcdef"),
    ).toBe(true);
  });

  it("is case insensitive", () => {
    expect(isSafeIconUrl("HTTPS://example.com/icon.ico")).toBe(true);
    expect(isSafeIconUrl("DATA:image/png;base64,abcdef")).toBe(true);
  });

  it("returns false for unsafe protocols", () => {
    expect(isSafeIconUrl("ftp://example.com/icon.ico")).toBe(false);
    expect(isSafeIconUrl("chrome://extensions")).toBe(false);
  });

  it("returns false for invalid or relative urls", () => {
    expect(isSafeIconUrl("/favicon.ico")).toBe(false);
    expect(isSafeIconUrl("example.com/icon.png")).toBe(false);
    expect(isSafeIconUrl("")).toBe(false);
  });
});