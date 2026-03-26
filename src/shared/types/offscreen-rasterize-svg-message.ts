export type OffscreenRasterizeSvgMessage = {
  target: 'offscreen';
  type: 'OFFSCREEN_RASTERIZE_SVG';
  payload: {
    bytes: number[];
    mimeType: string;
  };
};
