import { beforeEach, describe, expect, it, vi } from "vitest";
import { compressImageBlob } from "./compress-image-blob.util";
import { FAILED_TO_GET_CANVAS_TEXT } from "../../shared/constants/error-messages";

describe("compressImageBlob", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("resizes the image and returns converted webp blob", async () => {
    const inputBlob = new Blob(["test"], { type: "image/png" });
    const outputBlob = new Blob(["compressed"], { type: "image/webp" });

    const drawImage = vi.fn();
    const getContext = vi.fn().mockReturnValue({ drawImage });
    const convertToBlob = vi.fn().mockResolvedValue(outputBlob);

    const createImageBitmapMock = vi.fn().mockResolvedValue({
      width: 1600,
      height: 1200,
    });

    const OffscreenCanvasMock = vi.fn(function (
      this: Record<string, unknown>,
      _width: number,
      _height: number,
    ) {
      this.getContext = getContext;
      this.convertToBlob = convertToBlob;
    });

    vi.stubGlobal("createImageBitmap", createImageBitmapMock);
    vi.stubGlobal("OffscreenCanvas", OffscreenCanvasMock);

    const result = await compressImageBlob(inputBlob, 800, 0.8);

    expect(createImageBitmapMock).toHaveBeenCalledWith(inputBlob);
    expect(OffscreenCanvasMock).toHaveBeenCalledWith(800, 600);
    expect(getContext).toHaveBeenCalledWith("2d");
    expect(drawImage).toHaveBeenCalledWith(
      expect.objectContaining({
        width: 1600,
        height: 1200,
      }),
      0,
      0,
      800,
      600,
    );
    expect(convertToBlob).toHaveBeenCalledWith({
      type: "image/webp",
      quality: 0.8,
    });
    expect(result).toBe(outputBlob);
  });

  it("does not upscale image when it is already smaller than maxWidth", async () => {
    const inputBlob = new Blob(["test"], { type: "image/png" });
    const outputBlob = new Blob(["compressed"], { type: "image/webp" });

    const drawImage = vi.fn();
    const getContext = vi.fn().mockReturnValue({ drawImage });
    const convertToBlob = vi.fn().mockResolvedValue(outputBlob);

    const createImageBitmapMock = vi.fn().mockResolvedValue({
      width: 400,
      height: 200,
    });

    const OffscreenCanvasMock = vi.fn(function (
      this: Record<string, unknown>,
      _width: number,
      _height: number,
    ) {
      this.getContext = getContext;
      this.convertToBlob = convertToBlob;
    });

    vi.stubGlobal("createImageBitmap", createImageBitmapMock);
    vi.stubGlobal("OffscreenCanvas", OffscreenCanvasMock);

    await compressImageBlob(inputBlob, 800, 0.8);

    expect(OffscreenCanvasMock).toHaveBeenCalledWith(400, 200);
    expect(drawImage).toHaveBeenCalledWith(
      expect.objectContaining({
        width: 400,
        height: 200,
      }),
      0,
      0,
      400,
      200,
    );
  });

  it("throws when 2d context cannot be created", async () => {
    const inputBlob = new Blob(["test"], { type: "image/png" });

    const createImageBitmapMock = vi.fn().mockResolvedValue({
      width: 1600,
      height: 1200,
    });

    const OffscreenCanvasMock = vi.fn(function (
      this: Record<string, unknown>,
      _width: number,
      _height: number,
    ) {
      this.getContext = vi.fn().mockReturnValue(null);
      this.convertToBlob = vi.fn();
    });

    vi.stubGlobal("createImageBitmap", createImageBitmapMock);
    vi.stubGlobal("OffscreenCanvas", OffscreenCanvasMock);

    await expect(compressImageBlob(inputBlob)).rejects.toThrow(
      FAILED_TO_GET_CANVAS_TEXT,
    );
  });
});