import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
export async function GET(request: Request) {
  const url = new URL(request.url);
  const payloadLink = url.searchParams;
  if (!payloadLink) {
    return new Response('Missing required parameter: url', { status: 400 });
  }

  try {
    const cookieStore = cookies()
    payloadLink.set("token", cookieStore.get("authToken")?.value ||"")
    // console.log((process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")+"/print/?"+payloadLink.toString())
    // const response = await fetch((process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")+"/print/?"+payloadLink.toString(), {
    //     headers:{
    //         'Cookie': cookieStore.toString(), // Set custom cookies here
    //       },
    //     cache: "no-cache"  
    // });
    const response = await axios.get(
      (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000") + "/print/?" + payloadLink.toString(),
      {
        // headers: {
        //   'Cookie': cookieStore,  // Set custom cookies here
        // },
        // cache: "no-cache", // Axios does not support a direct cache option, but no-cache can be managed server-side
      }
    );
  
    const buffer = response.data;
    // const buffer = await response.text();
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
