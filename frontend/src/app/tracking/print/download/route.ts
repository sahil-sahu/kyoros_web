import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
export async function GET(request: Request) {
  const url = new URL(request.url);
  const payloadLink = url.searchParams.get('url');
  console.log(payloadLink)
  if (!payloadLink) {
    return new Response('Missing required parameter: url', { status: 400 });
  }

  try {
    const cookieStore = cookies()
    console.log(payloadLink)
    console.log(cookieStore.toString())
    const response = await fetch(payloadLink, {
        headers:{
            'Content-Type': 'application/json',
            'Cookie': cookieStore.toString(), // Set custom cookies here
          }
    });
    const buffer = await response.text();
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(buffer);
    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
    });

    await browser.close();

    return new Response(pdfBuffer, {
      status: 200,
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return new Response('Error downloading file', { status: 500 });
  }
}
