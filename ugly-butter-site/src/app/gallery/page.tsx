'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { SupabaseClient } from '@supabase/supabase-js';

interface ImageData {
  public_id: string;
  created_at: string;
  username: string;
  bbi_score: string;
  bbi_comment: string;
  bbi_grade: number;
}

interface CloudinaryResource {
  public_id: string;
  created_at: string;
}

interface CloudinaryResponse {
  resources: CloudinaryResource[];
  next_cursor: string | null;
}

export default function Gallery() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<SupabaseClient>();

  const fetchImages = useCallback(async (cursor: string | null = null) => {
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
      const cloudinaryData: CloudinaryResponse = await response.json();
      
      // Fetch metadata from Supabase
      const { data: metadataData, error: metadataError } = await supabase
        .from('image_metadata')
        .select('public_id, username, created_at, bbi_score, bbi_comment,bbi_grade')
        .in('public_id', cloudinaryData.resources.map((img) => img.public_id));
      
      if (metadataError) {
        throw new Error('Error fetching image metadata');
      }

      // Combine Cloudinary data with Supabase metadata
      const combinedData = cloudinaryData.resources.map((cloudinaryImage) => {
        const metadata = metadataData?.find((m) => m.public_id === cloudinaryImage.public_id);
        return {
          ...cloudinaryImage,
          username: metadata?.username || 'Unknown',
          created_at: metadata?.created_at || cloudinaryImage.created_at,
          bbi_score: metadata?.bbi_score || 'Butterless Blunder',
          bbi_comment: metadata?.bbi_comment || 'No comment',
          bbi_grade: metadata?.bbi_grade || 0.0
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
  }, [supabase]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <div className="min-h-screen bg-yellow-50 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Ugly Butter Gallery</h1>
      {error && <p className="text-red-500 text-center mb-4">Error: {error}</p>}
      {loading && <p className="text-center mb-4">Loading...</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((image) => (
          <div key={image.public_id} className="bg-white p-6 rounded-lg shadow">
            <CldImage
              width={800}
              height={800}
              src={image.public_id}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt="Ugly butter"
              className="w-full h-auto object-cover mb-4 rounded"
            />

            <div className="space-y-2">
              <h2 className="font-bold text-xl text-yellow-500">{image.bbi_score}</h2>
              <p className="font-semibold text-gray-700">Butter Blunder Index: {image.bbi_grade}/10</p>
              <p className="italic text-gray-600 mt-3">{image.bbi_comment}</p>
            </div>
            <div className="mt-4 text-xs text-gray-400 text-center">
              <p>Uploaded on {new Date(image.created_at).toLocaleDateString()}</p>
              <p>By {image.username}</p>
            </div>
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