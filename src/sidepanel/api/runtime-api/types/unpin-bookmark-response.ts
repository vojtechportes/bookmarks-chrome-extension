import type { ErrorResponse } from "../../../../shared/types/error-response";
import type { SuccessResponse } from "../../../../shared/types/success-response";

export type UnpinBookmarkResponse =
  | ErrorResponse
  | SuccessResponse;
