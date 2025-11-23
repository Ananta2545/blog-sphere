import { z } from "zod";

// Schema for creating a new post
export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must not exceed 255 characters")
    .trim(),
  content: z
    .string()
    .min(1, "Content is required")
    .trim(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  readingTimeMins: z
    .number()
    .int()
    .min(1, "Reading time must be at least 1 minute")
    .max(999, "Reading time must not exceed 999 minutes")
    .optional(),
  categoryIds: z
    .array(z.number().int().positive())
    .optional()
    .default([]),
});

// Schema for updating an existing post
export const updatePostSchema = z.object({
  postId: z.number().int().positive("Post ID must be a positive integer"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must not exceed 255 characters")
    .trim()
    .optional(),
  content: z
    .string()
    .min(1, "Content is required")
    .trim()
    .optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  readingTimeMins: z
    .number()
    .int()
    .min(1, "Reading time must be at least 1 minute")
    .max(999, "Reading time must not exceed 999 minutes")
    .optional(),
  categoryIds: z
    .array(z.number().int().positive())
    .optional(),
});

// Schema for filtering and searching posts
export const getPostsFilterSchema = z.object({
  categorySlug: z.string().optional(),
  searchQuery: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  status: z.enum(["DRAFT", "PUBLISHED", "ALL"]).default("PUBLISHED"),
});

// Schema for getting a single post by slug
export const getPostBySlugSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});

// Schema for getting a post by ID
export const getPostByIdSchema = z.object({
  postId: z.number().int().positive("Post ID must be a positive integer"),
});

// Schema for deleting a post
export const deletePostSchema = z.object({
  postId: z.number().int().positive("Post ID must be a positive integer"),
});

// Type exports for use in components
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type GetPostsFilterInput = z.infer<typeof getPostsFilterSchema>;
export type GetPostBySlugInput = z.infer<typeof getPostBySlugSchema>;
export type GetPostByIdInput = z.infer<typeof getPostByIdSchema>;
export type DeletePostInput = z.infer<typeof deletePostSchema>;
