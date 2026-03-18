import { BOOKMARK_NOT_FOUND } from '../../constants/error-messages';

export class BookmarkNotFoundError extends Error {
  constructor(message = BOOKMARK_NOT_FOUND) {
    super(message);
    this.name = 'BookmarkNotFoundError';
  }
}
