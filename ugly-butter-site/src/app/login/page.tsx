'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useSearchParams } from 'next/navigation'

// ... (keep the existing utility functions)

export default function Login() {
  const [loading, setLoading] = useState<boolean>(false)
  const searchParams = useSearchParams()
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
    const codeVerifier = sessionStorage.getItem('codeVerifier');
    if (codeVerifier) {
      try {
        console.log('Sending code and verifier to server:', { code, codeVerifier });
        const response = await fetch('/api/auth/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, codeVerifier }),
        });
        if (response.ok) {
          console.log('Login successful');
          // Update UI or perform any necessary actions after successful login
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to exchange code for session');
        }
      } catch (error) {
        console.error('Callback error:', error);
        alert('An error occurred during login. Please try again.');
      } finally {
        sessionStorage.removeItem('codeVerifier');
      }
    } else {
      console.error('Code verifier not found');
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

  // ... (keep the existing return statement)
}