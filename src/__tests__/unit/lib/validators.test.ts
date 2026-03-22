import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from '@/lib/validators/auth';
import { createDesignSchema } from '@/lib/validators/design';

describe('registerSchema', () => {
  it('validates correct registration data', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'Password1',
      username: 'woodworker42',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = registerSchema.safeParse({
      email: 'not-an-email',
      password: 'Password1',
      username: 'user',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short password', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'short',
      username: 'user',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password without uppercase', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'password1',
      username: 'user',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password without number', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'Password',
      username: 'user',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short username', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'Password1',
      username: 'ab',
    });
    expect(result.success).toBe(false);
  });

  it('rejects username with spaces', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'Password1',
      username: 'has space',
    });
    expect(result.success).toBe(false);
  });

  it('accepts username with hyphens and underscores', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'Password1',
      username: 'wood-worker_42',
    });
    expect(result.success).toBe(true);
  });
});

describe('loginSchema', () => {
  it('validates correct login data', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'anypassword',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('createDesignSchema', () => {
  const validDesign = {
    title: 'Victorian Crown Molding',
    description: 'A beautiful crown molding profile',
    is_free: true,
    category_ids: ['a0000000-0000-0000-0000-000000000001'],
  };

  it('validates correct design data', () => {
    const result = createDesignSchema.safeParse(validDesign);
    expect(result.success).toBe(true);
  });

  it('rejects title shorter than 3 characters', () => {
    const result = createDesignSchema.safeParse({
      ...validDesign,
      title: 'Ab',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty category_ids', () => {
    const result = createDesignSchema.safeParse({
      ...validDesign,
      category_ids: [],
    });
    expect(result.success).toBe(false);
  });

  it('validates design with full metadata', () => {
    const result = createDesignSchema.safeParse({
      ...validDesign,
      long_description: 'Detailed description here',
      material: 'Oak',
      difficulty_level: 'intermediate',
      estimated_build_hours: 4,
      dimensions_json: {
        length: 96,
        width: 3.5,
        height: 4.25,
        unit: 'in',
      },
      style_ids: ['b0000000-0000-0000-0000-000000000001'],
      tags: ['victorian', 'ornate', 'ceiling'],
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid difficulty level', () => {
    const result = createDesignSchema.safeParse({
      ...validDesign,
      difficulty_level: 'expert',
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative dimensions', () => {
    const result = createDesignSchema.safeParse({
      ...validDesign,
      dimensions_json: {
        length: -5,
        unit: 'in',
      },
    });
    expect(result.success).toBe(false);
  });

  it('rejects price below $1.00 for paid designs', () => {
    const result = createDesignSchema.safeParse({
      ...validDesign,
      is_free: false,
      price_cents: 50,
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid price for paid designs', () => {
    const result = createDesignSchema.safeParse({
      ...validDesign,
      is_free: false,
      price_cents: 999,
    });
    expect(result.success).toBe(true);
  });

  it('rejects more than 20 tags', () => {
    const result = createDesignSchema.safeParse({
      ...validDesign,
      tags: Array.from({ length: 21 }, (_, i) => `tag-${i}`),
    });
    expect(result.success).toBe(false);
  });
});
