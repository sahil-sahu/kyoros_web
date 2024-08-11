import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const payloadLink = url.searchParams.get('url');

  if (!payloadLink) {
    return new Response('Missing required parameter: url', { status: 400 });
  }

  try {
    const response = await fetch(payloadLink);
    const buffer = await response.blob();

    return new Response(buffer, {
      status: 200,
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return new Response('Error downloading file', { status: 500 });
  }
}
