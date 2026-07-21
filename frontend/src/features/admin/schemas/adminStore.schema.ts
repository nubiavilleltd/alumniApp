import { z } from 'zod';

export const STORE_CATEGORIES = [
  'Apparel',
  'Accessories',
  'Drinkware',
  'Office & Stationery',
  'Lifestyle Essentials',
  'Collectibles & Memorabilia',
] as const;

export type StoreCategory = (typeof STORE_CATEGORIES)[number];

// ─── Basic info schema (step 1) ───────────────────────────────────────────────

export const basicInfoSchema = z.object({
  productName: z.string().trim().min(2, 'Product name must be at least 2 characters'),
  category: z.string().min(1, 'Please select a category'),
  price: z
    .string()
    .trim()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Price must be a positive number'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
});

export type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;

// ─── Variant toggle schema ────────────────────────────────────────────────────

export const variantToggleSchema = z.object({
  hasVariants: z.boolean(),
  hasColor: z.boolean(),
  hasSize: z.boolean(),
});

export type VariantToggleValues = z.infer<typeof variantToggleSchema>;

// ─── No-variant quantity schema ───────────────────────────────────────────────

export const noVariantSchema = z.object({
  quantity: z
    .number({ message: 'Quantity must be a number' })
    .int('Quantity must be a whole number')
    .min(0, 'Quantity cannot be negative'),
});

export type NoVariantFormValues = z.infer<typeof noVariantSchema>;

// ─── Single colour entry schema ───────────────────────────────────────────────

export const colourEntrySchema = z.object({
  colorName: z.string().trim().min(1, 'Colour name is required'),
  imageUrl: z.string().min(1, 'Please select an image for this colour'),
});

export type ColourEntryFormValues = z.infer<typeof colourEntrySchema>;

// ─── Single size entry schema ─────────────────────────────────────────────────

export const sizeEntrySchema = z.object({
  sizeName: z.string().trim().min(1, 'Size name is required'),
});

export type SizeEntryFormValues = z.infer<typeof sizeEntrySchema>;