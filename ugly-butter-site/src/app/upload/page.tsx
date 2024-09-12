'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    } else {
      alert('Please select a valid image file.');
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        // Reset the form
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('An error occurred while uploading the file.');
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Upload Your Ugly Butter</h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <input 
          type="file" 
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 w-full"
          ref={fileInputRef}
        />
        {previewUrl && (
          <div className="mb-4">
            <Image src={previewUrl} alt="Preview" width={300} height={300} className="w-full h-auto" />
          </div>
        )}
        <button 
          onClick={handleUpload}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded w-full"
          disabled={!selectedFile}
        >
          Upload
        </button>
      </div>
    </div>
  );
}