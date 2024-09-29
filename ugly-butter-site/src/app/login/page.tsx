'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useSearchParams, useRouter } from 'next/navigation'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()
  const searchParams = useSearchParams()
  const router = useRouter()
  const challenge = searchParams.get('challenge')
  const error = searchParams.get('error')

  useEffect(() => {
    if (error) {
      console.error('Login error:', error)
      alert('Authentication failed. Please try again.')
    }
    if (!challenge) {
      console.log('No challenge found, redirecting to get a new one')
      router.push('/api/auth/callback')
    }
  }, [error, challenge, router])

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      console.log('Initiating Google login with challenge:', challenge)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
          queryParams: {
            challenge: challenge // Pass the challenge as a query parameter
          }
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

  if (!challenge) {
    return <div>Loading...</div>
  }

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