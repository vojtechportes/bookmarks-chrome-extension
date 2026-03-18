import { BOOKMARK_ALREADY_EXISTS } from '../../constants/error-messages';

export class BookmarkAlreadyExistsError extends Error {
  constructor(message = BOOKMARK_ALREADY_EXISTS) {
    super(message);
    this.name = 'BookmarkAlreadyExistsError';
  }
}
