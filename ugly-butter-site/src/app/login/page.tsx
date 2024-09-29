'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useSearchParams, useRouter } from 'next/navigation'
import { OAuthResponse } from '@supabase/supabase-js'

// ... (keep the existing utility functions)

export default function Login() {
  const [loading, setLoading] = useState<boolean>(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get('error')
  const code = searchParams.get('code')

  useEffect(() => {
    if (error) {
      console.error('Login error:', error)
      alert('Authentication failed. Please try again.')
    } else if (code) {
      handleCallback(code)
    }
  }, [error, code])

  async function handleCallback(code: string): Promise<void> {
    const codeVerifier = localStorage.getItem('codeVerifier');
    if (codeVerifier) {
      try {
        const response = await fetch('/api/auth/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, codeVerifier }),
        });
        if (response.ok) {
          router.push('/dashboard'); // Redirect to dashboard or home page
        } else {
          throw new Error('Failed to exchange code for session');
        }
      } catch (error) {
        console.error('Callback error:', error);
        alert('An error occurred during login. Please try again.');
      } finally {
        localStorage.removeItem('codeVerifier');
      }
    } else {
      console.error('Code verifier not found');
      alert('An error occurred during login. Please try again.');
    }
  }

  // ... (keep the existing handleGoogleLogin function)

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Login to Ugly Butter</h1>
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        {loading ? 'Loading...' : 'Sign in with Google'}
      </button>
    </div>
  )
}