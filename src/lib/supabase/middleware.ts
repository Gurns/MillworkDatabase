import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

type CookieSet = { name: string; value: string; options: Record<string, unknown> };

const cookieOptions: Record<string, unknown> = {
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  httpOnly: true,
};

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        schema: 'millwork',
      },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieSet[]) {
          cookiesToSet.forEach(({ name, value }: CookieSet) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }: CookieSet) =>
            supabaseResponse.cookies.set(name, value, { ...cookieOptions, ...options })
          );
        },
      },
    }
  );

  // IMPORTANT: Do not remove this — it refreshes the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect dashboard routes — redirect to login if not authenticated
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/settings');

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users away from auth pages
  const isAuthRoute = request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/register';

  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}