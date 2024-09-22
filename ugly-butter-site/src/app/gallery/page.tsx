'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface ImageData {
  public_id: string;
  created_at: string;
  username: string;
}

export default function Gallery() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient()

  const fetchImages = async (cursor: string | null = null) => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({
      ...(cursor && { next_cursor: cursor }),
    });
    try {
      const response = await fetch(`/api/images?${params.toString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const cloudinaryData = await response.json();
      
      // Fetch metadata from Supabase
      const { data: metadataData, error: metadataError } = await supabase
        .from('image_metadata')
        .select('public_id, username, created_at')
        .in('public_id', cloudinaryData.resources.map((img: any) => img.public_id));
      
      if (metadataError) {
        throw new Error('Error fetching image metadata');
      }

      // Combine Cloudinary data with Supabase metadata
      const combinedData = cloudinaryData.resources.map((cloudinaryImage: any) => {
        const metadata = metadataData.find((m: any) => m.public_id === cloudinaryImage.public_id);
        return {
          ...cloudinaryImage,
          username: metadata?.username || 'Unknown',
          created_at: metadata?.created_at || cloudinaryImage.created_at
        };
      });

      setImages(combinedData);
      setNextCursor(cloudinaryData.next_cursor);
    } catch (error) {
      console.error('Error loading images:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-yellow-50 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Ugly Butter Gallery</h1>
      {error && <p className="text-red-500 text-center mb-4">Error: {error}</p>}
      {loading && <p className="text-center mb-4">Loading...</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((image) => (
          <div key={image.public_id} className="bg-white p-4 rounded-lg shadow">
            <CldImage
              width="800"
              height="800"
              src={image.public_id}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt="Ugly butter"
              className="w-full h-auto object-cover mb-4 rounded"
            />
            <p className="text-center">Uploaded on: {new Date(image.created_at).toLocaleDateString()}</p>
            <p className="text-center">By: {image.username}</p>
          </div>
        ))}
      </div>
      {nextCursor && (
        <div className="mt-8 text-center">
          <button
            onClick={() => fetchImages(nextCursor)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
      <Link href="/" className="block mt-8 text-center text-blue-500 hover:underline">
        Back to Home
      </Link>
    </div>
  );
}