export type FaqLink = {
  label: string;
  url: string;
};

const FAQ_LINKS_START = '[FAQ_LINKS]';
const FAQ_LINKS_END = '[/FAQ_LINKS]';
const FAQ_LINKS_PATTERN = /\n*\[FAQ_LINKS\]\s*([\s\S]*?)\s*\[\/FAQ_LINKS\]\s*$/;

function isSafeRelativeUrl(url: string) {
  return url.startsWith('/') && !url.startsWith('//') && !/[\s<>]/.test(url);
}

function isSafeMailtoUrl(url: string) {
  if (!url.toLowerCase().startsWith('mailto:')) return false;

  const email = url.slice('mailto:'.length).trim();
  return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email);
}

export function validateFaqLinkUrl(url: string) {
  const trimmedUrl = url.trim();

  if (!trimmedUrl) return 'Enter a link URL.';
  if (isSafeRelativeUrl(trimmedUrl) || isSafeMailtoUrl(trimmedUrl)) return null;

  try {
    const parsedUrl = new URL(trimmedUrl);
    if (parsedUrl.protocol !== 'https:') {
      return 'Use an internal link, a mailto link, or an https URL.';
    }

    return null;
  } catch {
    return 'Enter a valid link, such as /contact or https://example.com.';
  }
}

export function normalizeFaqLinkUrl(url: string) {
  const trimmedUrl = url.trim();
  if (isSafeRelativeUrl(trimmedUrl) || isSafeMailtoUrl(trimmedUrl)) return trimmedUrl;
  return new URL(trimmedUrl).href;
}

export function parseFaqAnswerWithLinks(answer: string): {
  answerText: string;
  links: FaqLink[];
} {
  const match = answer.match(FAQ_LINKS_PATTERN);

  if (!match) {
    return { answerText: answer, links: [] };
  }

  let links: FaqLink[] = [];
  try {
    const parsedLinks = JSON.parse(match[1]);
    if (Array.isArray(parsedLinks)) {
      links = parsedLinks
        .map((link) => ({
          label: typeof link?.label === 'string' ? link.label.trim() : '',
          url: typeof link?.url === 'string' ? link.url.trim() : '',
        }))
        .filter((link) => link.label && !validateFaqLinkUrl(link.url));
    }
  } catch {
    links = [];
  }

  return {
    answerText: answer.replace(FAQ_LINKS_PATTERN, '').trimEnd(),
    links,
  };
}

export function buildFaqAnswerWithLinks(answerText: string, links: FaqLink[]) {
  const cleanAnswer = parseFaqAnswerWithLinks(answerText).answerText.trim();
  const cleanLinks = links
    .map((link) => ({
      label: link.label.trim(),
      url: link.url.trim(),
    }))
    .filter((link) => link.label && !validateFaqLinkUrl(link.url))
    .map((link) => ({
      ...link,
      url: normalizeFaqLinkUrl(link.url),
    }));

  if (cleanLinks.length === 0) {
    return cleanAnswer;
  }

  return `${cleanAnswer}\n\n${FAQ_LINKS_START}\n${JSON.stringify(cleanLinks)}\n${FAQ_LINKS_END}`;
}

export function isExternalFaqLink(url: string) {
  return /^https:\/\//i.test(url);
}
