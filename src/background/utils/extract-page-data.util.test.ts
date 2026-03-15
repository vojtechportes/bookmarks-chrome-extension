import { beforeEach, describe, expect, it, vi } from 'vitest';
import { extractPageData } from './extract-page-data.util';
import { FAILED_TO_EXTRACT_DATA } from '../../shared/constants/error-messages';

describe('extractPageData', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('calls chrome.scripting.executeScript with the provided tabId', async () => {
    const executeScriptMock = vi.fn().mockResolvedValue([
      {
        result: {
          title: 'Example page',
          url: 'https://example.com',
          icon: 'https://example.com/favicon.ico',
          description: 'Lorem ipsum',
        },
      },
    ]);

    chrome.scripting.executeScript = executeScriptMock;

    const result = await extractPageData(123);

    expect(executeScriptMock).toHaveBeenCalledWith({
      target: { tabId: 123 },
      func: expect.any(Function),
    });

    expect(result).toEqual({
      title: 'Example page',
      url: 'https://example.com',
      icon: 'https://example.com/favicon.ico',
      description: 'Lorem ipsum',
    });
  });

  it('normalizes invalid result fields', async () => {
    chrome.scripting.executeScript = vi.fn().mockResolvedValue([
      {
        result: {
          title: 123,
          url: null,
          icon: {},
          description: '   Lorem ipsum   ',
        },
      },
    ]);

    const result = await extractPageData(1);

    expect(result).toEqual({
      title: '',
      url: '',
      icon: undefined,
      description: 'Lorem ipsum',
    });
  });

  it('returns null description when description is empty string', async () => {
    chrome.scripting.executeScript = vi.fn().mockResolvedValue([
      {
        result: {
          title: 'Example page',
          url: 'https://example.com',
          icon: 'https://example.com/favicon.ico',
          description: '   ',
        },
      },
    ]);

    const result = await extractPageData(1);

    expect(result).toEqual({
      title: 'Example page',
      url: 'https://example.com',
      icon: 'https://example.com/favicon.ico',
      description: null,
    });
  });

  it('throws when executeScript cant return any usable data', async () => {
    chrome.scripting.executeScript = vi.fn().mockResolvedValue([]);

    await expect(extractPageData(1)).rejects.toThrow(FAILED_TO_EXTRACT_DATA);
  });

  it('extracts meta description and icon', async () => {
    Object.defineProperty(document, 'title', {
      value: '  Example page  ',
      configurable: true,
    });

    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://example.com/article',
      },
      configurable: true,
    });

    document.head.innerHTML = `
      <meta name="description" content="   Lorem ipsum   " />
      <link rel="icon" href="https://example.com/favicon.ico" />
    `;

    Object.defineProperty(document.body, 'innerText', {
      value:
        'Body text that should not be used because meta description exists.',
      configurable: true,
    });

    chrome.scripting.executeScript = vi
      .fn()
      .mockImplementation(
        async ({
          func,
        }: {
          target: { tabId: number };
          func: () => unknown;
        }) => [{ result: func() }],
      );

    const result = await extractPageData(999);

    expect(result).toEqual({
      title: 'Example page',
      url: 'https://example.com/article',
      icon: 'https://example.com/favicon.ico',
      description: 'Lorem ipsum',
    });
  });

  it('falls back to trimmed body text when meta description is missing', async () => {
    Object.defineProperty(document, 'title', {
      value: 'Page title',
      configurable: true,
    });

    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://example.com/fallback',
      },
      configurable: true,
    });

    document.head.innerHTML = `
      <link rel="shortcut icon" href="https://example.com/icon.ico" />
    `;

    Object.defineProperty(document.body, 'innerText', {
      value: '   Lorem ipsum dolor sit amet   ',
      configurable: true,
    });

    chrome.scripting.executeScript = vi
      .fn()
      .mockImplementation(
        async ({
          func,
        }: {
          target: { tabId: number };
          func: () => unknown;
        }) => [{ result: func() }],
      );

    const result = await extractPageData(5);

    expect(result).toEqual({
      title: 'Page title',
      url: 'https://example.com/fallback',
      icon: 'https://example.com/icon.ico',
      description: 'Lorem ipsum dolor sit amet',
    });
  });
});
