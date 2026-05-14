import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

type CookieSet = { name: string; value: string; options: Record<string, unknown> };

const supabaseCookieOptions: Record<string, unknown> = {
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  httpOnly: true,
};

const supabaseOptions = {
  db: {
    schema: 'millwork',
  },
  cookies: {
    options: supabaseCookieOptions,
  },
};

export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient<Database, 'millwork', any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      ...supabaseOptions,
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }: CookieSet) =>
              cookieStore.set(name, value, { ...supabaseCookieOptions, ...options })
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );
}

export function createServiceRoleClient() {
  return createServerClient<Database, 'millwork', any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      ...supabaseOptions,
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
