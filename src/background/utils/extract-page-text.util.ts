export const extractPageText = () => {
  const title = document.title?.trim() ?? '';

  const root =
    document.querySelector('article') ??
    document.querySelector('main') ??
    document.body;

  const text = root?.innerText?.trim() ?? '';

  return [title, text].filter(Boolean).join('\n\n');
};
