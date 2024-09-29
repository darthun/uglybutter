'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useSearchParams, useRouter } from 'next/navigation'

function generateCodeVerifier(): string {
  const array = new Uint8Array(56);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

function base64urlencode(input: ArrayBuffer): string {
  const uintArray = new Uint8Array(input);
  const numberArray = Array.from(uintArray);
  const asciiArray = numberArray.map((num) => String.fromCharCode(num));
  const asciiString = asciiArray.join('');
  return btoa(asciiString)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const hashed = await sha256(verifier);
  return base64urlencode(hashed);
}

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
      setLoading(true)
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      console.log('Generated code verifier:', codeVerifier);
      sessionStorage.setItem('codeVerifier', codeVerifier);

      const supabase = createClientComponentClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
          queryParams: {
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
          },
        }
      })
      if (error) throw error

    } catch (error) {
      console.error('Login error:', error)
      alert('An error occurred during login. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
  )
}