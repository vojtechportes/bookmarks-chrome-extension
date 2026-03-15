import { FAILED_TO_EXTRACT_DATA } from "../../shared/constants/error-messages";

export const extractPageData = async (
  tabId: number,
): Promise<{
  title: string;
  url: string;
  icon?: string;
  description: string | null;
}> => {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const normalizeWhitespace = (value: string): string =>
        value.replace(/\s+/g, " ").trim();

      const getMetaContent = (selectors: string[]): string | undefined => {
        for (const selector of selectors) {
          const element = document.querySelector(selector);
          const content = element?.getAttribute("content");

          if (content && normalizeWhitespace(content)) {
            return normalizeWhitespace(content);
          }
        }

        return undefined;
      };

      const getIconHref = (): string | undefined => {
        const selectors = [
          'link[rel~="icon"]',
          'link[rel="shortcut icon"]',
          'link[rel="apple-touch-icon"]',
          'link[rel="apple-touch-icon-precomposed"]',
          'link[rel="mask-icon"]',
        ];

        for (const selector of selectors) {
          const element = document.querySelector(
            selector,
          ) as HTMLLinkElement | null;
          const href = element?.href?.trim();

          if (href) {
            return href;
          }
        }

        return undefined;
      };

      const bodyText = normalizeWhitespace(document.body?.innerText || "");
      const textDescription =
        bodyText.length > 0 ? bodyText.slice(0, 160) : undefined;

      const metaDescription = getMetaContent([
        'meta[name="description"]',
        'meta[itemprop="description"]',
        'meta[property="og:description"]',
        'meta[name="twitter:description"]',
      ]);

      return {
        title: document.title?.trim() || "",
        url: window.location.href,
        icon: getIconHref(),
        description: metaDescription || textDescription || null,
      };
    },
  });

  const result = results[0]?.result;

  if (!result) {
    throw new Error(FAILED_TO_EXTRACT_DATA);
  }

  return {
    title: typeof result.title === "string" ? result.title : "",
    url: typeof result.url === "string" ? result.url : "",
    icon: typeof result.icon === "string" ? result.icon : undefined,
    description:
      typeof result.description === "string" && result.description.trim()
        ? result.description.trim()
        : null,
  };
};
