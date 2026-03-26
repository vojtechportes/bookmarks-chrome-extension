export const resolveError = (error?: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'undefined') {
    return undefined;
  }

  return String(error);
};
