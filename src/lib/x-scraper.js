import puppeteer from 'puppeteer';
// import { addExtra } from 'puppeteer-extra';
// import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// const puppeteer = addExtra(vanillaPuppeteer);
// puppeteer.use(StealthPlugin());

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const randomDelay = (min = 1000, max = 3000) => sleep(min + Math.random() * (max - min));

export async function createBrowser(options = {}) {
  return puppeteer.launch({
    headless: options.headless !== false ? 'new' : false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-web-security',
    ],
    ...options,
  });
}

export async function createPage(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );
  return page;
}

export async function loginWithCookie(page, authToken) {
  if (!authToken) return page;
  console.log('[Scraper] Logging in with auth_token...');
  await page.setCookie({
    name: 'auth_token',
    value: authToken,
    domain: '.x.com',
    path: '/',
    httpOnly: true,
    secure: true,
  });
  // Navigate to home to confirm login
  await page.goto('https://x.com/home', { waitUntil: 'networkidle2' });
  return page;
}

export async function scrapeProfile(page, username) {
  console.log(`[Scraper] Navigating to profile: ${username}`);
  await page.goto(`https://x.com/${username}`, { waitUntil: 'networkidle2', timeout: 30000 });
  await randomDelay(2000, 4000);

  const profile = await page.evaluate(() => {
    const getText = (sel) => document.querySelector(sel)?.textContent?.trim() || null;
    
    // Select the large profile avatar specifically from the main column
    const primaryColumn = document.querySelector('[data-testid="primaryColumn"]');
    const avatarImg = primaryColumn?.querySelector('img[src*="profile_images"]');
    const nameSection = primaryColumn?.querySelector('[data-testid="UserName"]');
    
    return {
      name: nameSection?.textContent?.split('@')[0]?.trim() || null,
      username: window.location.pathname.replace('/', ''),
      bio: getText('[data-testid="UserDescription"]'),
      location: getText('[data-testid="UserLocation"]'),
      followers: primaryColumn?.querySelector('a[href$="/followers"] span span')?.textContent || null,
      following: primaryColumn?.querySelector('a[href$="/following"] span span')?.textContent || null,
      avatar: avatarImg?.src || null,
      verified: !!primaryColumn?.querySelector('svg[aria-label*="Verified"]'),
    };
  });

  return profile;
}

export async function scrapeTweets(page, username, options = {}) {
  const { limit = 20 } = options;
  console.log(`[Scraper] Scraping tweets for: ${username}`);
  await page.goto(`https://x.com/${username}`, { waitUntil: 'networkidle2' });
  await randomDelay(3000, 5000);

  const tweets = await page.evaluate((max) => {
    const articles = document.querySelectorAll('article[data-testid="tweet"]');
    return Array.from(articles).slice(0, max).map((article) => {
      const textEl = article.querySelector('[data-testid="tweetText"]');
      const timeEl = article.querySelector('time');
      const linkEl = article.querySelector('a[href*="/status/"]');
      
      return {
        id: linkEl?.href?.match(/status\/(\d+)/)?.[1] || Math.random().toString(),
        text: textEl?.textContent || null,
        timestamp: timeEl?.getAttribute('datetime') || null,
        url: linkEl?.href || null,
      };
    });
  }, limit);

  return tweets;
}

export async function searchTweets(page, query, options = {}) {
  const { limit = 20 } = options;
  console.log(`[Scraper] Searching for: ${query}`);
  const searchUrl = `https://x.com/search?q=${encodeURIComponent(query)}&f=live`;
  
  await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });
  await randomDelay(4000, 6000);

  // Scroll a bit to trigger more loading
  await page.evaluate(() => window.scrollBy(0, 1000));
  await randomDelay(2000, 3000);

  const results = await page.evaluate((max) => {
    const articles = document.querySelectorAll('article[data-testid="tweet"]');
    return Array.from(articles).slice(0, max).map((article) => {
      const textEl = article.querySelector('[data-testid="tweetText"]');
      const authorEl = article.querySelector('[data-testid="User-Name"] a');
      const timeEl = article.querySelector('time');
      const linkEl = article.querySelector('a[href*="/status/"]');
      
      const author = authorEl?.getAttribute('href')?.replace('/', '') || null;
      const url = linkEl ? `https://x.com${linkEl.getAttribute('href')}` : null;

      return {
        id: linkEl?.href?.match(/status\/(\d+)/)?.[1] || Math.random().toString(),
        text: textEl?.textContent || null,
        author: author,
        timestamp: timeEl?.getAttribute('datetime') || null,
        url: url,
      };
    });
  }, limit);

  return results;
}

export async function scrapeFollowers(page, username, options = {}) {
  const { limit = 50, type = 'followers' } = options;
  const url = `https://x.com/${username}/${type}`;
  console.log(`[Scraper] Scraping ${type} for: ${username} via ${url}`);
  
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  } catch (e) {
    console.log(`[Scraper] Navigation warning: ${e.message}. Attempting to proceed...`);
  }
  
  await randomDelay(5000, 8000);

  // Try to scroll to load more
  await page.evaluate(() => window.scrollBy(0, 2000));
  await randomDelay(2000, 4000);

  const users = await page.evaluate((max) => {
    const cells = document.querySelectorAll('[data-testid="UserCell"]');
    return Array.from(cells).slice(0, max).map((cell) => {
      const link = cell.querySelector('a[href^="/"]');
      const nameEl = cell.querySelector('[dir="ltr"] > span');
      const bioEl = cell.querySelector('[data-testid="UserDescription"]');
      const avatarEl = cell.querySelector('img[src*="profile_images"]');

      return {
        username: link?.getAttribute('href')?.replace('/', '') || null,
        name: nameEl?.textContent || null,
        bio: bioEl?.textContent || null,
        avatar: avatarEl?.src || null
      };
    }).filter(u => u.username);
  }, limit);

  if (users.length === 0) {
    console.log('[Scraper] Warning: No users found. Checking for login wall...');
    const isLoginWall = await page.evaluate(() => document.body.innerText.includes('Log in to X'));
    if (isLoginWall) throw new Error('X blocked access. Please provide an auth_token to scrape followers.');
  }

  return users;
}

export async function scrapeBookmarks(page, options = {}) {
  const { limit = 20 } = options;
  console.log(`[Scraper] Scraping bookmarks...`);
  await page.goto(`https://x.com/i/bookmarks`, { waitUntil: 'networkidle2' });
  await randomDelay(3000, 5000);

  const bookmarks = await page.evaluate((max) => {
    const articles = document.querySelectorAll('article[data-testid="tweet"]');
    return Array.from(articles).slice(0, max).map((article) => {
      return {
        text: article.querySelector('[data-testid="tweetText"]')?.textContent || null,
        author: article.querySelector('[data-testid="User-Name"] a')?.getAttribute('href')?.replace('/', '') || null,
        url: article.querySelector('a[href*="/status/"]')?.href || null,
      };
    });
  }, limit);

  return bookmarks;
}

export async function scrapeTweetMedia(page, tweetUrl) {
  console.log(`[Scraper] Extracting media using TwitSave engine for: ${tweetUrl}`);
  
  try {
    await page.goto('https://twitsave.com/', { waitUntil: 'networkidle2', timeout: 60000 });
    // Updated selectors for TwitSave
    await page.waitForSelector('#url-input', { timeout: 10000 });
    await page.type('#url-input', tweetUrl);
    await page.click('#download');
    
    // Wait for the results to load (they usually appear in a div after the form)
    await randomDelay(3000, 5000);
    
    const media = await page.evaluate(() => {
      // Find the download links in the results section
      const downloadLinks = Array.from(document.querySelectorAll('a[href*=".mp4"]'));
      const images = Array.from(document.querySelectorAll('img[src*="twimg.com"]')).map(img => img.src);
      
      // TwitSave usually has a specific button for HD or SD
      const videoUrl = downloadLinks.length > 0 ? downloadLinks[0].href : null;
      
      return {
        videoUrl,
        imageUrls: images.slice(0, 4),
        type: videoUrl ? 'video' : (images.length > 0 ? 'image' : 'none')
      };
    });

    if (media.videoUrl || media.imageUrls.length > 0) {
      return { ...media, tweetUrl };
    }
  } catch (err) {
    console.log(`[Scraper] TwitSave failed: ${err.message}. Falling back to direct scrape.`);
  }

  // Fallback to direct scrape
  await page.goto(tweetUrl, { waitUntil: 'networkidle2', timeout: 60000 });
  const directMedia = await page.evaluate(() => {
    const video = document.querySelector('video');
    const images = Array.from(document.querySelectorAll('[data-testid="tweetPhoto"] img')).map(img => img.src);
    return {
      type: video ? 'video' : (images.length > 0 ? 'image' : 'none'),
      videoUrl: video?.src || null,
      imageUrls: images
    };
  });

  return { ...directMedia, tweetUrl };
}

export async function scrapeRetweeters(page, tweetUrl, options = {}) {
  const { limit = 50 } = options;
  
  // Clean the URL from query params before appending /retweets
  const cleanUrl = tweetUrl.split('?')[0].split('#')[0];
  const retweetsUrl = cleanUrl.endsWith('/retweets') ? cleanUrl : `${cleanUrl}/retweets`;
  
  console.log(`[Scraper] Navigating to retweets: ${retweetsUrl}`);
  
  await page.goto(retweetsUrl, { waitUntil: 'networkidle2', timeout: 30000 });
  await randomDelay(3000, 5000);

  const users = await page.evaluate((max) => {
    const cells = document.querySelectorAll('[data-testid="UserCell"]');
    return Array.from(cells).slice(0, max).map((cell) => {
      const link = cell.querySelector('a[href^="/"]');
      const nameEl = cell.querySelector('[dir="ltr"] > span');
      return {
        username: link?.getAttribute('href')?.replace('/', '') || null,
        name: nameEl?.textContent || null,
      };
    }).filter(u => u.username);
  }, limit);

  return users;
}
