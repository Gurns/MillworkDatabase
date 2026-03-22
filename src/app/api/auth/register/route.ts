import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { registerSchema } from '@/lib/validators/auth';
import { slugify } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = registerSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password, username, display_name } = validated.data;
    const supabase = createServerSupabaseClient();

    // Check if username is already taken (anon client is fine for SELECT)
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          display_name: display_name || username,
        },
      },
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Create public user profile using service role client.
    // The anon client can't insert here because auth.uid() is null —
    // the user hasn't confirmed their email yet, so no session exists.
    const serviceClient = createServiceRoleClient();
    const { error: profileError } = await serviceClient.from('users').insert({
      id: authData.user.id,
      username,
      email,
      display_name: display_name || username,
    });

    if (profileError) {
      console.error('Failed to create user profile:', profileError);
      // Auth user was created but profile failed — log for manual fix
      return NextResponse.json(
        { error: 'Account created but profile setup failed. Please contact support.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Registration successful. Please check your email to confirm your account.',
        user: { id: authData.user.id, email, username },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
