import { readFile, writeFile } from 'fs/promises';
import { stringify } from 'csv-stringify/sync';
import type { SearchResult } from './types.js';

export async function readHtmlFile(filePath: string): Promise<string> {
  return await readFile(filePath, 'utf-8');
}

export async function saveToCSV(
  results: SearchResult[],
  filePath: string,
): Promise<void> {
  const csvData = results.map((result) => [
    result.url,
    result.anchor,
    result.snippet,
  ]);
  const csvContent = stringify([['URL', 'Anchor', 'Snippet'], ...csvData]);
  await writeFile(filePath, csvContent, 'utf-8');
}

export async function saveNextPageUrl(
  url: string,
  filePath: string,
): Promise<void> {
  await writeFile(filePath, url, 'utf-8');
}
