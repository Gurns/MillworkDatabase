/**
 * Generate a URL-safe slug from a string.
 * e.g. "Victorian Crown Molding" → "victorian-crown-molding"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars (except spaces and hyphens)
    .replace(/[\s_]+/g, '-')  // Replace spaces and underscores with hyphens
    .replace(/--+/g, '-')     // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug by appending a random suffix.
 * Uses 8 chars from crypto-quality random for low collision probability.
 * e.g. "victorian-crown-molding-a3f2b9c1"
 */
export function uniqueSlug(text: string): string {
  const base = slugify(text);
  // Generate 8 character random hex suffix (~32 bits of entropy)
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${base}-${suffix}`;
}
