import { describe, it, expect } from 'vitest';
import { getLevelForPoints, LEVELS, POINTS } from '@/lib/utils/constants';

describe('getLevelForPoints', () => {
  it('returns Apprentice for 0 points', () => {
    expect(getLevelForPoints(0)).toEqual(LEVELS[0]);
    expect(getLevelForPoints(0).name).toBe('Apprentice');
  });

  it('returns Journeyman for 100 points', () => {
    expect(getLevelForPoints(100).name).toBe('Journeyman');
  });

  it('returns Journeyman for 499 points', () => {
    expect(getLevelForPoints(499).name).toBe('Journeyman');
  });

  it('returns Craftsman for 500 points', () => {
    expect(getLevelForPoints(500).name).toBe('Craftsman');
  });

  it('returns Artisan for 1500 points', () => {
    expect(getLevelForPoints(1500).name).toBe('Artisan');
  });

  it('returns Master for 5000 points', () => {
    expect(getLevelForPoints(5000).name).toBe('Master');
  });

  it('returns Grand Master for 15000+ points', () => {
    expect(getLevelForPoints(15000).name).toBe('Grand Master');
    expect(getLevelForPoints(99999).name).toBe('Grand Master');
  });
});

describe('POINTS constants', () => {
  it('has correct point values', () => {
    expect(POINTS.DESIGN_UPLOADED).toBe(50);
    expect(POINTS.DESIGN_DOWNLOADED).toBe(10);
    expect(POINTS.DESIGN_FAVORITED).toBe(5);
    expect(POINTS.COMMENT_RECEIVED).toBe(2);
    expect(POINTS.COLLECTION_CREATED).toBe(20);
    expect(POINTS.PROFILE_COMPLETED).toBe(25);
  });
});

describe('LEVELS', () => {
  it('has 6 levels', () => {
    expect(LEVELS).toHaveLength(6);
  });

  it('levels are in ascending order of min_points', () => {
    for (let i = 1; i < LEVELS.length; i++) {
      expect(LEVELS[i].min_points).toBeGreaterThan(LEVELS[i - 1].min_points);
    }
  });

  it('level numbers are sequential from 1', () => {
    LEVELS.forEach((level, index) => {
      expect(level.level).toBe(index + 1);
    });
  });
});
