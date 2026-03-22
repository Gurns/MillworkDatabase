import { z } from 'zod';

export const dimensionsSchema = z.object({
  length: z.number().positive().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  depth: z.number().positive().optional(),
  unit: z.enum(['in', 'mm', 'cm']),
});

export const CC_LICENSE_CODES = [
  'CC0',
  'CC-BY-4.0',
  'CC-BY-SA-4.0',
  'CC-BY-NC-4.0',
  'CC-BY-NC-SA-4.0',
  'CC-BY-ND-4.0',
  'CC-BY-NC-ND-4.0',
] as const;

export const createDesignSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000).optional(),
  long_description: z.string().max(10000).optional(),
  is_free: z.boolean().default(true),
  price_cents: z
    .number()
    .int()
    .min(100, 'Minimum price is $1.00')
    .max(100000, 'Maximum price is $1,000.00')
    .optional()
    .nullable(),
  material: z.string().max(100).optional(),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  estimated_build_hours: z.number().int().min(1).max(1000).optional(),
  dimensions_json: dimensionsSchema.optional(),
  license_type: z.enum(CC_LICENSE_CODES).default('CC-BY-4.0'),
  category_ids: z.array(z.string().uuid()).min(1, 'Select at least one category'),
  style_ids: z.array(z.string().uuid()).default([]),
  tags: z.array(z.string().max(50)).max(20).default([]),
});

export const updateDesignSchema = createDesignSchema.partial();

export type CreateDesignInput = z.infer<typeof createDesignSchema>;
export type UpdateDesignInput = z.infer<typeof updateDesignSchema>;
