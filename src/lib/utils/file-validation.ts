export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
] as const;

export const ALLOWED_MODEL_EXTENSIONS = [
  '.stl',
  '.step',
  '.stp',
  '.obj',
  '.ply',
  '.f3d',
  '.f3z',
] as const;

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_MODEL_SIZE = 50 * 1024 * 1024; // 50 MB

export function getFileExtension(filename: string): string {
  return filename.slice(filename.lastIndexOf('.')).toLowerCase();
}

export function isAllowedImageType(mimeType: string): boolean {
  return (ALLOWED_IMAGE_TYPES as readonly string[]).includes(mimeType);
}

export function isAllowedModelFile(filename: string): boolean {
  const ext = getFileExtension(filename);
  return (ALLOWED_MODEL_EXTENSIONS as readonly string[]).includes(ext);
}

export function getFileTypeFromExtension(
  filename: string
): 'stl' | 'step' | 'obj' | 'ply' | 'f3d' | 'fusion360' | 'other' {
  const ext = getFileExtension(filename);
  switch (ext) {
    case '.stl':
      return 'stl';
    case '.step':
    case '.stp':
      return 'step';
    case '.obj':
      return 'obj';
    case '.ply':
      return 'ply';
    case '.f3d':
    case '.f3z':
      return 'f3d';
    default:
      return 'other';
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}
