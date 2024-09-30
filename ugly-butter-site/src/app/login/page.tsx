'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error');
  const code = searchParams.get('code');

  useEffect(() => {
    if (error) {
      console.error('Login error:', error);
      alert('Authentication failed. Please try again.');
    } else if (code) {
      handleCallback(code);
    }
  }, [error, code]);

  async function handleCallback(code: string): Promise<void> {
    try {
      console.log('Handling callback with code:', code);
      const response = await fetch('/api/auth/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      if (response.ok) {
        console.log('Login successful');
        router.push('/gallery'); // Redirect to your app's main page
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to exchange code for session');
      }
    } catch (error) {
      console.error('Callback error:', error);
      alert('An error occurred during login. Please try again.');
    }
  }

  const handleLogin = async (): Promise<void> => {
    try {
      setLoading(true);
      // Redirect to Supabase for OAuth login initiation
      window.location.href = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${window.location.origin}/login`;
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Login to Ugly Butter</h1>
      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        {loading ? 'Loading...' : 'Sign in with Google'}
      </button>
    </div>
  );
}
