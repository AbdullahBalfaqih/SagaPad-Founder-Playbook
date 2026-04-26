import { createBrowser, createPage, scrapeProfile } from '../src/lib/x-scraper.js';

async function test() {
  console.log('Starting test...');
  try {
    const browser = await createBrowser({ headless: true });
    const page = await createPage(browser);
    console.log('Scraping profile: elonmusk');
    const profile = await scrapeProfile(page, 'elonmusk');
    console.log('Profile found:', profile.displayName);
    await browser.close();
  } catch (err) {
    console.error('Test failed:', err);
  }
}

test();
