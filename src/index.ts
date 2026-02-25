import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { SearchResult } from './types.js';
import {
  extractUrls,
  extractAnchors,
  extractSnippets,
  extractNextPageUrl,
  extractUrlsAd,
  extractSnippetsAd,
  extractAnchorsAd,
} from './parser.js';
import { readHtmlFile, saveToCSV, saveNextPageUrl } from './fileHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const EXPECTED_COUNT = 10;
const EXPECTED_COUNT_AD = 2;
const BASE_URL = 'https://google.com';

async function parseGoogleResults() {
  try {
    const filePath = join(__dirname, '..', 'data', 'data.html');
    const html = await readHtmlFile(filePath);

    console.log(`✅ Файл успешно прочитан`);
    console.log(`📄 Размер файла: ${(html.length / 1024).toFixed(2)} КБ\n`);

    // Парсинг
    const urls = extractUrls(html);
    const anchors = extractAnchors(html);
    const snippets = extractSnippets(html);

    // Парсинг рекламы
    const urlsAd = extractUrlsAd(html);
    const anchorsAd = extractAnchorsAd(html);
    const snippetsAd = extractSnippetsAd(html);

    console.log(`🔗 Найдено URL: ${urls.length + urlsAd.length}`);
    console.log(`📝 Найдено анкоров: ${anchors.length + anchorsAd.length}`);
    console.log(`📊 Найдено сниппетов: ${snippets.length + snippetsAd.length}`);

    // Проверки
    [
      { name: 'URL', value: urls.length },
      { name: 'анкоров', value: anchors.length },
      { name: 'сниппетов', value: snippets.length },
    ].forEach((item) => {
      if (item.value !== EXPECTED_COUNT) {
        console.log(
          `⚠️  Предупреждение: найдено ${item.value} ${item.name} вместо ${EXPECTED_COUNT}`,
        );
      }
    });

    // Проверки рекламы
    [
      { name: 'URL', value: urlsAd.length },
      { name: 'анкоров', value: anchorsAd.length },
      { name: 'сниппетов', value: snippetsAd.length },
    ].forEach((item) => {
      if (item.value !== EXPECTED_COUNT_AD) {
        console.log(
          `⚠️  Предупреждение: найдено ${item.value} ${item.name} рекламных вместо ${EXPECTED_COUNT_AD}`,
        );
      }
    });

    // Сбор результатов
    const results: SearchResult[] = [];

    // Первая реклама
    if (urlsAd[0] || anchorsAd[0] || snippetsAd[0]) {
      results.push({
        url: urlsAd[0] || '',
        anchor: anchorsAd[0] || '',
        snippet: snippetsAd[0] || '',
        ad: 'true',
      });
    }

    // Органические ответы
    for (let i = 0; i < EXPECTED_COUNT; i++) {
      results.push({
        url: urls[i] || '',
        anchor: anchors[i] || '',
        snippet: snippets[i] || '',
        ad: 'false',
      });
    }

    // Вторая реклама
    if (urlsAd[1] || anchorsAd[1] || snippetsAd[1]) {
      results.push({
        url: urlsAd[1] || '',
        anchor: anchorsAd[1] || '',
        snippet: snippetsAd[1] || '',
        ad: 'true',
      });
    }

    console.log(`\n📦 Создано результатов: ${results.length}`);

    // Сохранение в CSV
    const csvOutputPath = join(__dirname, '..', 'results.csv');
    await saveToCSV(results, csvOutputPath);

    console.log(`\n💾 CSV файл сохранен: ${csvOutputPath}`);

    // Сохранение ссылки на следующую страницу
    const nextPageUrl = extractNextPageUrl(html, BASE_URL);
    if (nextPageUrl) {
      const nextPagePath = join(__dirname, '..', 'next-page.txt');
      await saveNextPageUrl(nextPageUrl, nextPagePath);
      console.log(`💾 Ссылка сохранена в: ${nextPagePath}`);
    } else {
      console.log('\n❌ Ссылка на следующую страницу не найдена');
    }
  } catch (error) {
    console.error(
      '❌ Ошибка при чтении файла:',
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }
}

parseGoogleResults();
