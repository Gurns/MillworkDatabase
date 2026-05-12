import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: { 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! },
        schema: 'millwork',
      },
      cookies: {
        options: {
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
        },
      },
    }
  );
}