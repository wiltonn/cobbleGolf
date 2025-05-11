import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: NextRequest) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://admin.teeon.com/portal/golfnorth/teetimes/cobblehills', { waitUntil: 'networkidle2' });

    // Wait for the button/link to appear and click it
    await page.waitForSelector('button, a');
    const [leagueButton] = await page.$x("//button[contains(., \"Cobble Hills Men's league 2025\")] | //a[contains(., \"Cobble Hills Men's league 2025\")]");
    if (leagueButton) {
      await leagueButton.click();
      await page.waitForTimeout(2000); // Wait for times to load
    } else {
      await browser.close();
      return NextResponse.json({ error: "League button not found" }, { status: 404 });
    }

    // Scrape the times (adjust selector as needed)
    const times = await page.evaluate(() => {
      // This selector may need to be updated based on the actual DOM
      return Array.from(document.querySelectorAll('td, .time, .tee-time')).map(el => el.textContent?.trim()).filter(Boolean);
    });

    await browser.close();
    return NextResponse.json({ times });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 