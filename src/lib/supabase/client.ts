import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

type CookieSet = { name: string; value: string; options?: Record<string, unknown> };

function getBrowserCookies() {
  if (typeof document === 'undefined' || !document.cookie) return [];

  return document.cookie.split('; ').map((cookie) => {
    const [name, ...valueParts] = cookie.split('=');
    return {
      name,
      value: decodeURIComponent(valueParts.join('=')),
    };
  });
}

function serializeCookie({ name, value, options = {} }: CookieSet) {
  const parts = [`${name}=${encodeURIComponent(value)}`];

  if (options.path) parts.push(`Path=${options.path}`);
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  if (options.secure) parts.push('Secure');

  return parts.join('; ');
}

export function createClient() {
  return createBrowserClient<Database, 'millwork', any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: {
        schema: 'millwork',
      },
      global: {
        headers: { 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! },
      },
      cookies: {
        getAll: getBrowserCookies,
        setAll(cookiesToSet: CookieSet[]) {
          if (typeof document === 'undefined') return;
          cookiesToSet.forEach((cookie) => {
            document.cookie = serializeCookie(cookie);
          });
        },
        options: {
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
        },
      },
    }
  );
}
