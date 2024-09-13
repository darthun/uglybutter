'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';

interface ImageData {
  public_id: string;
  created_at: string;
}

export default function Gallery() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchImages = async (cursor: string | null = null) => {
    setLoading(true);
    const params = new URLSearchParams({
      ...(cursor && { next_cursor: cursor }),
    });
    try {
      const response = await fetch(`/api/images?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch images');
      const data = await response.json();
      setImages(prevImages => [...prevImages, ...data.resources]);
      setNextCursor(data.next_cursor);
    } catch (error) {
      console.error('Error loading images:', error);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((image) => (
          <div key={image.public_id} className="bg-white p-4 rounded-lg shadow">
            <CldImage
              width="400"
              height="300"
              src={image.public_id}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt="Ugly butter"
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <p className="text-center">Uploaded on: {new Date(image.created_at).toLocaleDateString()}</p>
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