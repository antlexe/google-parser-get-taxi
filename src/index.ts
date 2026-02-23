import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { SearchResult } from './types.js';
import {
  extractUrls,
  extractAnchors,
  extractSnippets,
  extractNextPageUrl,
} from './parser.js';
import { readHtmlFile, saveToCSV, saveNextPageUrl } from './fileHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const EXPECTED_COUNT = 10;
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

    console.log(`🔗 Найдено URL: ${urls.length}`);
    console.log(`📝 Найдено анкоров: ${anchors.length}`);
    console.log(`📊 Найдено сниппетов: ${snippets.length}`);

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

    // Сбор результатов
    const results: SearchResult[] = [];
    for (let i = 0; i < EXPECTED_COUNT; i++) {
      results.push({
        url: urls[i] || '',
        anchor: anchors[i] || '',
        snippet: snippets[i] || '',
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
