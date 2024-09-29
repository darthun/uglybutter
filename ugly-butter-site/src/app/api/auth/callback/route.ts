import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

const generateChallenge = () => {
  return Math.random().toString(36).substring(2, 15)
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const challenge = requestUrl.searchParams.get('challenge')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase configuration')
    return NextResponse.json({ error: 'Missing Supabase configuration' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('Request URL:', request.url)
  console.log('Cookies:', request.headers.get('cookie'))
  console.log('Code:', code)
  console.log('Challenge:', challenge)

  if (!code) {
    // If there's no code, we're starting the auth flow
    const newChallenge = challenge || generateChallenge()
    console.log('Using challenge:', newChallenge)
    const response = NextResponse.redirect(`${requestUrl.origin}/login?challenge=${newChallenge}`)
    response.cookies.set('auth_challenge', newChallenge, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 5 // 5 minutes
    })
    return response
  }

  // If there's a code, we're finishing the auth flow
  try {
    const storedChallenge = request.cookies.get('auth_challenge')?.value
    console.log('Stored challenge:', storedChallenge)
    console.log('Received challenge:', challenge)

    if (!storedChallenge || challenge !== storedChallenge) {
      console.error('Challenge mismatch:', { storedChallenge, receivedChallenge: challenge })
      throw new Error('Invalid challenge')
    }

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log('Session exchange successful')

    const response = NextResponse.redirect(requestUrl.origin)
    response.cookies.set('supabase-auth-token', data.session.access_token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })
    response.cookies.set('auth_challenge', '', { maxAge: 0 }) // Clear the challenge

    return response
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.redirect(`${requestUrl.origin}/login?error=AuthenticationFailed`)
  }
}