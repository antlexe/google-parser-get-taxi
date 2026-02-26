import { decodeHtmlEntities, normalizeSpaces } from './utils.js';

export function extractSearchAnswers(html: string): string[] {
  const matches = html.matchAll(
    /<div class="MjjYud">[\s\S]*?(?=<div class="MjjYud">|<div role="navigation")/g,
  );
  return Array.from(matches).map((match) => match[0]);
}

export function extractUrls(html: string): string[] {
  const matches = html.matchAll(
    /<a[^>]*class="zReHs"[^>]*href="([^"]*)"[^>]*>/gs,
  );
  return Array.from(matches).map((match) => match[1] || '');
}

export function extractUrlsAd(html: string): string[] {
  const matches = html.matchAll(
    /<a[^>]*class="sVXRqc"[^>]*href="([^"]*)"[^>]*>/gs,
  );
  return Array.from(matches).map((match) => match[1] || '');
}

export function extractAnchors(html: string): string[] {
  const matches = html.matchAll(
    /<h3[^>]*class="LC20lb MBeuO DKV0Md"[^>]*>([\s\S]*?)<\/h3>/gs,
  );
  return Array.from(matches).map((match) => {
    const rawText = match[1]?.replace(/<[^>]*>/g, '') || '';
    const decodedText = decodeHtmlEntities(rawText);
    return normalizeSpaces(decodedText);
  });
}

export function extractAnchorsAd(html: string): string[] {
  const matches = html.matchAll(
    /<div[^>]*class="CCgQ5 vCa9Yd QfkTvb N8QANc MBeuO Va3FIb EE3Upf"[^>]*>([\s\S]*?)<\/div>/gs,
  );
  return Array.from(matches).map((match) => {
    const rawText = match[1]?.replace(/<[^>]*>/g, '') || '';
    const decodedText = decodeHtmlEntities(rawText);
    return normalizeSpaces(decodedText);
  });
}

export function extractSnippets(html: string): string[] {
  const matches = html.matchAll(
    /<div[^>]*class="VwiC3b yXK7lf p4wth r025kc Hdw6tb"[^>]*>([\s\S]*?)<\/div>/gs,
  );
  return Array.from(matches).map((match) => {
    const rawText =
      match[1]
        ?.replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim() || '';

    return decodeHtmlEntities(rawText);
  });
}

export function extractSnippetsAd(html: string): string[] {
  const matches = html.matchAll(
    /<div[^>]*class="p4wth"[^>]*>([\s\S]*?)<\/div>/gs,
  );
  return Array.from(matches).map((match) => {
    const rawText =
      match[1]
        ?.replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim() || '';

    return decodeHtmlEntities(rawText);
  });
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
