import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-yellow-400 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">Ugly Butter</Link>
        <ul className="flex space-x-4">
          <li><Link href="/" className="text-white hover:underline">Home</Link></li>
          <li><Link href="/gallery" className="text-white hover:underline">Gallery</Link></li>
          <li><Link href="/upload" className="text-white hover:underline">Upload</Link></li>
          <li><Link href="/profile" className="text-white hover:underline">Profile</Link></li>
          <li><Link href="/about" className="text-white hover:underline">About</Link></li>
        </ul>
      </div>
    </nav>
  );
}