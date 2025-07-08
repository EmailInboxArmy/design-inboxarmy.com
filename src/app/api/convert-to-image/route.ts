import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: NextRequest) {
    try {
        const { html } = await request.json();

        if (!html) {
            return NextResponse.json({ error: 'HTML content is required' }, { status: 400 });
        }

        // Launch browser with additional options for better compatibility
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();

        // Set viewport for consistent rendering
        await page.setViewport({ width: 800, height: 600 });

        // Create a complete HTML document with proper styling
        const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
              background: white;
            }
            * {
              box-sizing: border-box;
            }
            img {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

        // Set the HTML content
        await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

        // Wait a bit for any dynamic content to load
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Take screenshot
        const screenshot = await page.screenshot({
            type: 'png',
            fullPage: true,
            encoding: 'base64'
        });

        await browser.close();

        return NextResponse.json({
            image: `data:image/png;base64,${screenshot}`
        });

    } catch (error) {
        console.error('Error converting HTML to image:', error);
        return NextResponse.json({ error: 'Failed to convert HTML to image' }, { status: 500 });
    }
} 