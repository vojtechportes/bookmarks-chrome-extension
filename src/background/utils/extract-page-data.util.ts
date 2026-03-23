import { FAILED_TO_EXTRACT_DATA } from '../../shared/constants/error-messages';
import { DESCRIPTION_MAXIMUM_LENGTH } from '../../shared/constants/text-extraction';
import { truncate } from '../../shared/utils/truncate.util';

export interface IExtractedPageData {
  title: string;
  url: string;
  icon?: string;
  iconLight?: string;
  iconDark?: string;
  description: string | null;
}

export const extractPageData = async (
  tabId: number,
): Promise<IExtractedPageData> => {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const normalizeWhitespace = (value: string): string =>
        value.replace(/\s+/g, ' ').trim();

      const getMetaContent = (selectors: string[]): string | undefined => {
        for (const selector of selectors) {
          const element = document.querySelector(selector);
          const content = element?.getAttribute('content');

          if (content && normalizeWhitespace(content)) {
            return normalizeWhitespace(content);
          }
        }

        return undefined;
      };

      const matchesColorScheme = (
        media: string | null,
        scheme: 'light' | 'dark',
      ): boolean => {
        if (!media) {
          return false;
        }

        const normalizedMedia = media.toLowerCase();

        return (
          normalizedMedia.includes('prefers-color-scheme') &&
          normalizedMedia.includes(scheme)
        );
      };

      const getIcons = (): {
        icon?: string;
        iconLight?: string;
        iconDark?: string;
      } => {
        const selectors = [
          'link[rel~="icon"]',
          'link[rel="shortcut icon"]',
          'link[rel="apple-touch-icon"]',
          'link[rel="apple-touch-icon-precomposed"]',
          'link[rel="mask-icon"]',
        ];

        const links = selectors.flatMap((selector) =>
          Array.from(document.querySelectorAll(selector)),
        ) as HTMLLinkElement[];

        let icon: string | undefined;
        let iconLight: string | undefined;
        let iconDark: string | undefined;

        for (const link of links) {
          const href = link.href?.trim();

          if (!href) {
            continue;
          }

          const media = link.media?.trim() || null;

          if (matchesColorScheme(media, 'light') && !iconLight) {
            iconLight = href;
          }

          if (matchesColorScheme(media, 'dark') && !iconDark) {
            iconDark = href;
          }

          if (!media && !icon) {
            icon = href;
          }
        }

        if (!icon) {
          icon = iconLight || iconDark;
        }

        return {
          icon,
          iconLight,
          iconDark,
        };
      };

      const bodyText = normalizeWhitespace(document.body?.innerText || '');
      const textDescription = bodyText.length > 0 ? bodyText : undefined;

      const metaDescription = getMetaContent([
        'meta[name="description"]',
        'meta[itemprop="description"]',
        'meta[property="og:description"]',
        'meta[name="twitter:description"]',
      ]);

      const icons = getIcons();

      const resolvedDescription = metaDescription ?? textDescription ?? null;

      return {
        title: document.title?.trim() || '',
        url: window.location.href,
        icon: icons.icon,
        iconLight: icons.iconLight,
        iconDark: icons.iconDark,
        description: resolvedDescription,
      };
    },
  });

  const result = results[0]?.result;

  if (!result) {
    throw new Error(FAILED_TO_EXTRACT_DATA);
  }

  return {
    title: typeof result.title === 'string' ? result.title : '',
    url: typeof result.url === 'string' ? result.url : '',
    icon: typeof result.icon === 'string' ? result.icon : undefined,
    iconLight:
      typeof result.iconLight === 'string' ? result.iconLight : undefined,
    iconDark: typeof result.iconDark === 'string' ? result.iconDark : undefined,
    description:
      typeof result.description === 'string' && result.description.trim()
        ? truncate(result.description.trim(), DESCRIPTION_MAXIMUM_LENGTH)
        : null,
  };
};
