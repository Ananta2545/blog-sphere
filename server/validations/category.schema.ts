import { z } from "zod";

// Schema for creating a new category
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

// Schema for updating a category
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

// Schema for getting a category by slug
export const getCategoryBySlugSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});

// Schema for getting a category by ID
export const getCategoryByIdSchema = z.object({
  categoryId: z.number().int().positive("Category ID must be a positive integer"),
});

// Schema for deleting a category
export const deleteCategorySchema = z.object({
  categoryId: z.number().int().positive("Category ID must be a positive integer"),
});

// Type exports for use in components
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type GetCategoryBySlugInput = z.infer<typeof getCategoryBySlugSchema>;
export type GetCategoryByIdInput = z.infer<typeof getCategoryByIdSchema>;
export type DeleteCategoryInput = z.infer<typeof deleteCategorySchema>;
