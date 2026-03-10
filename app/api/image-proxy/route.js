import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('URL is required', { status: 400 });
  }

  try {
    const user = (process.env.WP_USER || '').trim();
    const pass = (process.env.WP_PASS || '').trim();

    console.log(`Image Proxy Attempt: URL=${imageUrl}, UserPresent=${!!user}, PassPresent=${!!pass}`);

    const auth = Buffer.from(`${user}:${pass}`).toString('base64');
    
    const res = await fetch(imageUrl, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!res.ok) {
      console.error(`Image Proxy: CMS responded with ${res.status} for ${imageUrl}`);
      return new NextResponse('Failed to fetch from CMS', { status: res.status });
    }

    const contentType = res.headers.get('content-type');
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Image Proxy Error:', error);
    return new NextResponse('Proxy execution error', { status: 500 });
  }
}
