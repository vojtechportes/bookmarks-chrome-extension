import type { IBookmarkItem } from '../../../../shared/types/bookmark-item';
import type { ErrorResponse } from '../../../../shared/types/error-response';
import type { SuccessResponse } from '../../../../shared/types/success-response';

export type SetActiveTabResponse =
  | ErrorResponse
  | SuccessResponse<IBookmarkItem>;
