import { NextResponse } from 'next/server';

import { createBrowser, createPage, scrapeProfile, scrapeTweets, scrapeRetweeters, loginWithCookie, scrapeFollowers, scrapeBookmarks, searchTweets, scrapeTweetMedia } from '@/lib/x-scraper';

export async function POST(req) {
  let browser;
  try {
    const body = await req.json();
    const { action, data, authToken } = body;

    console.log(`[API/X] Executing REAL action via Puppeteer: ${action}`, data);

    // Launch browser (headless for performance)
    browser = await createBrowser({ headless: true });
    const page = await createPage(browser);

    // Login if token provided
    if (authToken) {
      await loginWithCookie(page, authToken);
    }

    let payload;
    switch (action) {
      case 'profile':
        payload = await scrapeProfile(page, data.username);
        break;
      case 'tweets':
        payload = await scrapeTweets(page, data.username, { limit: parseInt(data.count) || 20 });
        break;
      case 'retweeters':
        payload = await scrapeRetweeters(page, data.url, { limit: parseInt(data.limit) || 50 });
        break;
      case 'followers':
        payload = await scrapeFollowers(page, data.username, { 
          limit: parseInt(data.limit) || 50, 
          type: data.type === 'following' ? 'following' : 'followers' 
        });
        break;
      case 'search':
        payload = await searchTweets(page, data.query, { limit: 20 });
        break;
      case 'media':
        payload = await scrapeTweetMedia(page, data.url);
        break;
      case 'bookmarks':
        payload = await scrapeBookmarks(page, { limit: 20 });
        break;
      default:
        payload = { message: "Action acknowledged, but logic not fully wired for this module yet." };
    }

    await browser.close();

    return NextResponse.json({
      success: true,
      action,
      payload
    });

  } catch (error) {
    console.error('[API/X] Automation Error:', error);
    if (browser) {
      try { await browser.close(); } catch(e) {}
    }
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
