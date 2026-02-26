import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { extractNextPageUrl } from './parser.js';
import { readHtmlFile, saveToCSV, saveNextPageUrl } from './fileHandler.js';
import { parseGoogleResultsFromHtml } from './parserDom.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'https://google.com';

async function parseGoogleResults() {
  try {
    const filePath = join(__dirname, '..', 'data', 'data.html');
    const html = await readHtmlFile(filePath);

    console.log(`✅ Файл успешно прочитан`);
    console.log(`📄 Размер файла: ${(html.length / 1024).toFixed(2)} КБ\n`);

    const results = parseGoogleResultsFromHtml(html);

    console.log(`\n📦 Всего результатов: ${results.length}`);
    console.log(`📊 Рекламы: ${results.filter((r) => r.ad === 'true').length}`);
    console.log(
      `📊 Органики: ${results.filter((r) => r.ad === 'false').length}`,
    );

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
