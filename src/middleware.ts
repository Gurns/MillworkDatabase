import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { authRateLimiter, apiRateLimiter, searchRateLimiter, getRateLimitKey } from '@/lib/utils/rate-limiter';

const AUTH_ENDPOINTS = ['/api/auth/login', '/api/auth/register', '/api/auth/forgot-password'];
const SEARCH_ENDPOINTS = ['/api/designs/search'];

function isAuthEndpoint(path: string): boolean {
  return AUTH_ENDPOINTS.some((ep) => path.startsWith(ep));
}

function isSearchEndpoint(path: string): boolean {
  return SEARCH_ENDPOINTS.some((ep) => path.startsWith(ep));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/')) {
    const rateLimitKey = getRateLimitKey(request);

    if (isAuthEndpoint(pathname)) {
      const result = authRateLimiter(rateLimitKey);
      if (!result.allowed) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          {
            status: 429,
            headers: {
              'Retry-After': String(result.retryAfter),
            },
          }
        );
      }
    }

    if (isSearchEndpoint(pathname)) {
      const result = searchRateLimiter(rateLimitKey);
      if (!result.allowed) {
        return NextResponse.json(
          { error: 'Too many search requests. Please try again later.' },
          {
            status: 429,
            headers: {
              'Retry-After': String(result.retryAfter),
            },
          }
        );
      }
    }

    const result = apiRateLimiter(rateLimitKey);
    if (!result.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(result.retryAfter),
          },
        }
      );
    }

    return NextResponse.next();
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    '/((?!_next/static|_next/image|favicon.ico|icons/|images/).*)',
  ],
};
