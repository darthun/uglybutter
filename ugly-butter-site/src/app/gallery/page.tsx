import Link from 'next/link';

export default function Gallery() {
  return (
    <div className="min-h-screen bg-yellow-50 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Ugly Butter Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Placeholder for butter images */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow">
            <div className="bg-gray-200 h-48 mb-4 rounded"></div>
            <p className="text-center">Butter Image {i}</p>
          </div>
        ))}
      </div>
      <Link href="/" className="block mt-8 text-center text-blue-500 hover:underline">
        Back to Home
      </Link>
    </div>
  );
}