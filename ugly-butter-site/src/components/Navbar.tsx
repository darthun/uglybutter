'use client'

import Link from 'next/link';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

export default function Navbar() {
  const session = useSession();
  const supabase = useSupabaseClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-yellow-400 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">Ugly Butter</Link>
        <ul className="flex space-x-4 items-center">
          <li><Link href="/" className="text-white hover:underline">Home</Link></li>
          <li><Link href="/gallery" className="text-white hover:underline">Gallery</Link></li>
          <li><Link href="/upload" className="text-white hover:underline">Upload</Link></li>
          <li><Link href="/profile" className="text-white hover:underline">Profile</Link></li>
          <li><Link href="/about" className="text-white hover:underline">About</Link></li>
          {session ? (
            <>
              <li className="text-white"> {session.user.user_metadata.full_name || session.user.email}</li>
              <li><button onClick={handleSignOut} className="text-white hover:underline">Sign Out</button></li>
            </>
          ) : (
            <li><Link href="/login" className="text-white hover:underline">Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
}