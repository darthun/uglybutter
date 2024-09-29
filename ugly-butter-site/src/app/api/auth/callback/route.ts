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
    return NextResponse.json({ error: 'Missing Supabase configuration' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  if (!code || !challenge) {
    const newChallenge = generateChallenge()
    const response = NextResponse.redirect(`${requestUrl.origin}/login?challenge=${newChallenge}`)
    response.cookies.set('auth_challenge', newChallenge, { httpOnly: true, secure: true, sameSite: 'strict' })
    return response
  }

  try {
    const storedChallenge = request.cookies.get('auth_challenge')?.value
    if (challenge !== storedChallenge) {
      throw new Error('Invalid challenge')
    }

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) throw error

    const response = NextResponse.redirect(requestUrl.origin)
    response.cookies.set('supabase-auth-token', data.session.access_token, { 
      httpOnly: true, 
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })
    response.cookies.set('auth_challenge', '', { maxAge: 0 }) // Clear the challenge

    return response
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.redirect(`${requestUrl.origin}/login?error=AuthenticationFailed`)
  }
}