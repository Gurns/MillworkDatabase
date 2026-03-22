import { describe, it, expect } from 'vitest';
import { slugify, uniqueSlug } from '@/lib/utils/slug';

describe('slugify', () => {
  it('converts simple text to slug', () => {
    expect(slugify('Victorian Crown Molding')).toBe('victorian-crown-molding');
  });

  it('handles special characters', () => {
    expect(slugify('Art Deco (1920s) Style!')).toBe('art-deco-1920s-style');
  });

  it('collapses multiple spaces and hyphens', () => {
    expect(slugify('double  space--hyphen')).toBe('double-space-hyphen');
  });

  it('trims leading and trailing whitespace', () => {
    expect(slugify('  padded text  ')).toBe('padded-text');
  });

  it('removes leading and trailing hyphens', () => {
    expect(slugify('-hyphen-start-')).toBe('hyphen-start');
  });

  it('handles empty string', () => {
    expect(slugify('')).toBe('');
  });

  it('handles underscores', () => {
    expect(slugify('door_casing_design')).toBe('door-casing-design');
  });

  it('handles numbers', () => {
    expect(slugify('Profile 3/4 inch')).toBe('profile-34-inch');
  });
});

describe('uniqueSlug', () => {
  it('returns a slug with 4-character suffix', () => {
    const slug = uniqueSlug('Crown Molding');
    expect(slug).toMatch(/^crown-molding-[a-z0-9]{4}$/);
  });

  it('generates different slugs on each call', () => {
    const slug1 = uniqueSlug('Same Title');
    const slug2 = uniqueSlug('Same Title');
    // Extremely unlikely to collide with 36^4 possibilities
    expect(slug1).not.toBe(slug2);
  });
});
