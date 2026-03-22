import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';

const createProviderSchema = z.object({
  business_name: z.string().min(2).max(200),
  description: z.string().max(2000).optional(),
  location: z.string().max(255).optional(),
  website_url: z.string().url().max(500).optional().nullable(),
  contact_email: z.string().email().max(255).optional().nullable(),
  capabilities: z.object({
    materials: z.array(z.string()).default([]),
    max_width_inches: z.number().positive().optional(),
    max_length_inches: z.number().positive().optional(),
    max_depth_inches: z.number().positive().optional(),
    turnaround_days: z.number().int().positive().optional(),
  }).optional(),
});

// GET /api/cnc/providers — List active CNC providers
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const perPage = 20;
  const from = (page - 1) * perPage;

  const supabase = createServerSupabaseClient();

  const { data, count, error } = await supabase
    .from('cnc_providers')
    .select(
      `*, user:users!cnc_providers_user_id_fkey(id, username, display_name, avatar_url)`,
      { count: 'exact' }
    )
    .eq('is_active', true)
    .order('average_rating', { ascending: false })
    .range(from, from + perPage - 1);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 });
  }

  return NextResponse.json({
    data: data || [],
    total: count || 0,
    page,
    per_page: perPage,
  });
}

// POST /api/cnc/providers — Register as CNC provider
export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const validated = createProviderSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json({ error: 'Validation failed', details: validated.error.flatten().fieldErrors }, { status: 400 });
  }

  const { data: provider, error } = await supabase
    .from('cnc_providers')
    .insert({ ...validated.data, user_id: user.id })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'You already have a CNC provider profile' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create provider profile' }, { status: 500 });
  }

  // Update user flag
  await supabase.from('users').update({ is_cnc_provider: true }).eq('id', user.id);

  return NextResponse.json(provider, { status: 201 });
}
