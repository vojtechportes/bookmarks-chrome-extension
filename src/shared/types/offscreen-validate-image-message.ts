export type OffscreenValidateImageMessage = {
  target: 'offscreen';
  type: 'OFFSCREEN_VALIDATE_IMAGE';
  payload: {
    bytes: number[];
    mimeType: string;
  };
};
