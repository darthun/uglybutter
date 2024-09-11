import Link from 'next/link';

export default function Upload() {
  return (
    <div className="min-h-screen bg-yellow-50 p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Upload Your Ugly Butter</h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <input type="file" className="mb-4 w-full" />
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded w-full">
          Upload
        </button>
      </div>
      <Link href="/" className="mt-8 text-blue-500 hover:underline">
        Back to Home
      </Link>
    </div>
  );
}