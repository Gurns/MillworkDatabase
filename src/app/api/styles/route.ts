import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/styles — List all architectural styles
export async function GET() {
  const supabase = createServerSupabaseClient();

  const { data: styles, error } = await supabase
    .from('styles')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch styles' }, { status: 500 });
  }

  return NextResponse.json(styles || []);
}
