export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function sanitizeSearchInput(input: string): string {
  return input.replace(/[()|&!*]/g, '');
}

export function sanitizeForOrClause(input: string): string {
  return input.replace(/[()]/g, '').replace(/;/g, '');
}

export function createGenericError(message = 'An error occurred'): { message: string } {
  return { message };
}
