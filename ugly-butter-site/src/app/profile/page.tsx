import Link from 'next/link';

export default function Profile() {
  return (
    <div className="min-h-screen bg-yellow-50 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">User Profile</h1>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">John Doe</h2>
        <p className="mb-4">Email: john@example.com</p>
        <h3 className="text-xl font-semibold mb-2">Your Uploaded Butters</h3>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 h-32 rounded"></div>
          ))}
        </div>
      </div>
      <Link href="/" className="block mt-8 text-center text-blue-500 hover:underline">
        Back to Home
      </Link>
    </div>
  );
}