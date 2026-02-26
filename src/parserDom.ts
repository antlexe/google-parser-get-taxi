import { JSDOM } from 'jsdom';
import type { SearchResult } from './types.js';
import {
  extractUrls,
  extractAnchors,
  extractSnippets,
  extractUrlsAd,
  extractSnippetsAd,
  extractAnchorsAd,
} from './parser.js';

export function parseGoogleResultsFromHtml(html: string): SearchResult[] {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const resultBlocks = document.querySelectorAll('div.MjjYud');

  const results: SearchResult[] = [];

  resultBlocks.forEach((block) => {
    const blockHtml = block.outerHTML;

    const isAd = block.querySelector('.sVXRqc');
    const isOrganic = block.querySelector('.zReHs');

    if (isAd) {
      const urls = extractUrlsAd(blockHtml);
      const anchors = extractAnchorsAd(blockHtml);
      const snippets = extractSnippetsAd(blockHtml);

      results.push({
        url: urls[0] || '',
        anchor: anchors[0] || '',
        snippet: snippets[0] || '',
        ad: 'true',
      });
    } else if (isOrganic) {
      const urls = extractUrls(blockHtml);
      const anchors = extractAnchors(blockHtml);
      const snippets = extractSnippets(blockHtml);

      results.push({
        url: urls[0] || '',
        anchor: anchors[0] || '',
        snippet: snippets[0] || '',
        ad: 'false',
      });
    }
  });

  return results;
}
