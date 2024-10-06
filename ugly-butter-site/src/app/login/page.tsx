'use client'; // Indicates this component is a client component
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client using environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'broken-url',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'broken-key'
);

// Ensure dynamic behavior on edge
export const config = {
  runtime: 'edge', // Ensures this page is served from Edge locations
};

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle Google login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`, // Ensure you are redirected back to this page
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // Use useEffect to handle the tokens in the URL after redirect
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (accessToken && refreshToken) {
        // Set the session using the tokens from the URL
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        }).then(({ error }) => {
          if (error) {
            setErrorMessage('Failed to set session');
          } else {
            // Redirect to the homepage
            window.location.href = '/login';
          }
        });
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Login to Ugly Butter</h1>
      <button 
        onClick={handleGoogleLogin} 
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
        {loading ? 'Logging in...' : 'Login with Google'}
      </button>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}