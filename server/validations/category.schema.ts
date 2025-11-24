import { z } from "zod";
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(3, "Category name must be at least 3 characters")
    .max(100, "Category name must not exceed 100 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .trim()
    .optional(),
});
export const updateCategorySchema = z.object({
  categoryId: z.number().int().positive("Category ID must be a positive integer"),
  name: z
    .string()
    .min(3, "Category name must be at least 3 characters")
    .max(100, "Category name must not exceed 100 characters")
    .trim()
    .optional(),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .trim()
    .optional(),
});
export const getCategoryBySlugSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});
export const getCategoryByIdSchema = z.object({
  categoryId: z.number().int().positive("Category ID must be a positive integer"),
});
export const deleteCategorySchema = z.object({
  categoryId: z.number().int().positive("Category ID must be a positive integer"),
});
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type GetCategoryBySlugInput = z.infer<typeof getCategoryBySlugSchema>;
export type GetCategoryByIdInput = z.infer<typeof getCategoryByIdSchema>;
export type DeleteCategoryInput = z.infer<typeof deleteCategorySchema>;
