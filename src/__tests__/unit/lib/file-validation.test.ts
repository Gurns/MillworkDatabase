import { describe, it, expect } from 'vitest';
import {
  isAllowedImageType,
  isAllowedModelFile,
  getFileTypeFromExtension,
  formatFileSize,
  getFileExtension,
} from '@/lib/utils/file-validation';

describe('isAllowedImageType', () => {
  it('accepts JPEG', () => {
    expect(isAllowedImageType('image/jpeg')).toBe(true);
  });

  it('accepts PNG', () => {
    expect(isAllowedImageType('image/png')).toBe(true);
  });

  it('accepts WebP', () => {
    expect(isAllowedImageType('image/webp')).toBe(true);
  });

  it('rejects GIF', () => {
    expect(isAllowedImageType('image/gif')).toBe(false);
  });

  it('rejects application/pdf', () => {
    expect(isAllowedImageType('application/pdf')).toBe(false);
  });
});

describe('isAllowedModelFile', () => {
  it('accepts .stl files', () => {
    expect(isAllowedModelFile('model.stl')).toBe(true);
  });

  it('accepts .step files', () => {
    expect(isAllowedModelFile('model.step')).toBe(true);
  });

  it('accepts .stp files', () => {
    expect(isAllowedModelFile('model.stp')).toBe(true);
  });

  it('accepts .obj files', () => {
    expect(isAllowedModelFile('scan.obj')).toBe(true);
  });

  it('accepts .ply files', () => {
    expect(isAllowedModelFile('raw_scan.ply')).toBe(true);
  });

  it('accepts .f3d files', () => {
    expect(isAllowedModelFile('design.f3d')).toBe(true);
  });

  it('rejects .exe files', () => {
    expect(isAllowedModelFile('virus.exe')).toBe(false);
  });

  it('rejects .pdf files', () => {
    expect(isAllowedModelFile('document.pdf')).toBe(false);
  });

  it('handles uppercase extensions', () => {
    expect(isAllowedModelFile('MODEL.STL')).toBe(true);
  });
});

describe('getFileTypeFromExtension', () => {
  it('returns stl for .stl', () => {
    expect(getFileTypeFromExtension('file.stl')).toBe('stl');
  });

  it('returns step for .step', () => {
    expect(getFileTypeFromExtension('file.step')).toBe('step');
  });

  it('returns step for .stp', () => {
    expect(getFileTypeFromExtension('file.stp')).toBe('step');
  });

  it('returns obj for .obj', () => {
    expect(getFileTypeFromExtension('file.obj')).toBe('obj');
  });

  it('returns ply for .ply', () => {
    expect(getFileTypeFromExtension('file.ply')).toBe('ply');
  });

  it('returns f3d for .f3d', () => {
    expect(getFileTypeFromExtension('file.f3d')).toBe('f3d');
  });

  it('returns other for unknown extension', () => {
    expect(getFileTypeFromExtension('file.xyz')).toBe('other');
  });
});

describe('formatFileSize', () => {
  it('formats bytes', () => {
    expect(formatFileSize(500)).toBe('500.0 B');
  });

  it('formats kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB');
  });

  it('formats megabytes', () => {
    expect(formatFileSize(1048576)).toBe('1.0 MB');
  });

  it('formats gigabytes', () => {
    expect(formatFileSize(1073741824)).toBe('1.0 GB');
  });

  it('formats 0 bytes', () => {
    expect(formatFileSize(0)).toBe('0 B');
  });

  it('formats 50MB', () => {
    expect(formatFileSize(50 * 1024 * 1024)).toBe('50.0 MB');
  });
});

describe('getFileExtension', () => {
  it('extracts extension', () => {
    expect(getFileExtension('model.stl')).toBe('.stl');
  });

  it('handles multiple dots', () => {
    expect(getFileExtension('my.model.v2.step')).toBe('.step');
  });

  it('lowercases extension', () => {
    expect(getFileExtension('MODEL.STL')).toBe('.stl');
  });
});
