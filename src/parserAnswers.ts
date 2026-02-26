import type { SearchResult } from './types.js';
import {
  extractUrls,
  extractAnchors,
  extractSnippets,
  extractUrlsAd,
  extractSnippetsAd,
  extractAnchorsAd,
  extractSearchAnswers,
} from './parser.js';

export function parseGoogleResultsFromHtml(html: string): SearchResult[] {
  const resultBlocks = extractSearchAnswers(html);
  console.log(`🔍 Найдено блоков результатов: ${resultBlocks.length}`);

  const results: SearchResult[] = [];

  resultBlocks.forEach((blockHtml) => {
    const isAd = blockHtml.includes('sVXRqc');
    const isOrganic = blockHtml.includes('zReHs');

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
