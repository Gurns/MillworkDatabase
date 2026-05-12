import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const ALLOWED_REDIRECT_PATHS = new Set([
  '/dashboard',
  '/dashboard/designs',
  '/dashboard/designs/new',
  '/dashboard/favorites',
  '/dashboard/collections',
  '/dashboard/profile',
  '/dashboard/cnc-profile',
  '/designs',
  '/styles',
  '/categories',
  '/cnc-providers',
  '/',
]);

function isSafeRedirect(next: string): boolean {
  if (!next || next.startsWith('//') || next.includes('://')) return false;
  if (ALLOWED_REDIRECT_PATHS.has(next)) return true;
  try {
    const url = new URL(next, 'https://example.com');
    return url.protocol === 'https:' && !next.startsWith('http');
  } catch {
    return next.startsWith('/') && !next.startsWith('//');
  }
}

// Handles Supabase auth callback (email confirmation, password reset, OAuth)
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  let next = searchParams.get('next') ?? '/dashboard';

  if (!isSafeRedirect(next)) {
    next = '/dashboard';
  }

  if (code) {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If code exchange fails, redirect to error page
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
