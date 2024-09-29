import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const runtime = 'edge'; // Edge runtime directive

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  // Initialize Supabase client (manually using environment variables)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase configuration');
    return NextResponse.json({ error: 'Missing Supabase configuration' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  if (code) {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      // Log error details if any
      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      // Optionally: Set a session cookie manually using headers
      const response = NextResponse.redirect(requestUrl.origin);
      response.headers.set('Set-Cookie', `supabase-auth-token=${data.session.access_token}; Path=/; HttpOnly`);

      return response;
    } catch (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.json({ error: 'Failed to exchange code for session' }, { status: 500 });
    }
  }

  // Redirect to the homepage if no code is provided
  return NextResponse.redirect(requestUrl.origin);
}
