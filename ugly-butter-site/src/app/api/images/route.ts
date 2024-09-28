import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nextCursor = searchParams.get('next_cursor') || '';

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('Missing Cloudinary configuration');
    return NextResponse.json({ error: 'Missing Cloudinary configuration' }, { status: 500 });
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`;

  // Construct the Authorization header with Base64-encoded credentials
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

  const body = JSON.stringify({
    expression: 'asset_folder:ugly_butter',
    sort_by: [{ created_at: 'desc' }],
    max_results: 12,
    next_cursor: nextCursor,
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization':`Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Cloudinary API error: ${response.status} ${response.statusText}`, errorText);
      return NextResponse.json({ error: `Cloudinary API error: ${response.status} ${response.statusText}` }, { status: response.status });
    }

    const result = await response.json();

    if (!result.resources) {
      console.error('Invalid response from Cloudinary:', result);
      return NextResponse.json({ error: 'Invalid response from Cloudinary' }, { status: 500 });
    }

    return NextResponse.json({
      resources: result.resources,
      next_cursor: result.next_cursor,
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}