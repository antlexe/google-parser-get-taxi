import { decodeHtmlEntities, normalizeSpaces } from './utils.js';

export function extractUrls(html: string): string[] {
  const matches = html.matchAll(
    /<a[^>]*class="zReHs"[^>]*href="([^"]*)"[^>]*>/gs,
  );
  return Array.from(matches).map((match) => match[1] || '');
}

export function extractAnchors(html: string): string[] {
  const matches = html.matchAll(
    /<h3[^>]*class="LC20lb MBeuO DKV0Md"[^>]*>([\s\S]*?)<\/h3>/gs,
  );
  return Array.from(matches).map((match) => {
    const rawText = match[1]?.replace(/<[^>]*>/g, '') || '';
    return normalizeSpaces(rawText);
  });
}

export function extractSnippets(html: string): string[] {
  const matches = html.matchAll(
    /<div[^>]*class="VwiC3b yXK7lf p4wth r025kc Hdw6tb"[^>]*>([\s\S]*?)<\/div>/gs,
  );
  return Array.from(matches).map(
    (match) =>
      match[1]
        ?.replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim() || '',
  );
}

export function extractNextPageUrl(
  html: string,
  baseUrl: string,
): string | null {
  const match = html.match(
    /<a[^>]*aria-label="Page 2"[^>]*href="([^"]*)"[^>]*>/,
  );
  if (!match || !match[1]) return null;

  const decodedUrl = decodeHtmlEntities(match[1]);
  return decodedUrl.startsWith('http') ? decodedUrl : `${baseUrl}${decodedUrl}`;
}
