'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = useSupabaseClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('Email login is coming soon ! Please use Google login for now.')
    /*
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push('/profile')  // or wherever you want to redirect after login
      }
    } catch (error) {
      console.error('An error occurred:', error)
      setError('An unexpected error occurred')
    }*/
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        setError(error.message)
      }
    } catch (error) {
      console.error('An error occurred:', error)
      setError('An unexpected error occurred')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full p-2 mb-4 border rounded opacity-50 cursor-not-allowed"
          disabled
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-2 mb-4 border rounded opacity-50 cursor-not-allowed"
          disabled
        />
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-not-allowed">
          Email Login Coming Soon
        </button>
        <div className="mt-4 text-center">
          <span className="text-gray-500">or</span>
        </div>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center bg-white text-gray-700 border border-gray-300 rounded-md px-3 py-2 text-sm font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
              <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
              <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
              <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
            </g>
          </svg>
          Sign in with Google
        </button>
      </form>
    </div>
  )
}