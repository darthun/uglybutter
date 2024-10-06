'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: new FormData(e.target as HTMLFormElement),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'An error occurred during login')
      } else {
        router.push('/') // Redirect to dashboard or home page
      }
    } catch (error) {
      console.error('An error occurred:', error)
      setError('An unexpected error occurred')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields remain the same */}
      <input
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <div>{error}</div>}
      <button type="submit">Log in</button>
    </form>
  )
}