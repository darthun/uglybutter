import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nextCursor = searchParams.get('next_cursor') || undefined;

  try {
    const result = await cloudinary.search
      .expression('folder:ugly_butter')
      .sort_by('created_at', 'desc')
      .max_results(12)
      .next_cursor(nextCursor)
      .execute();

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}