import { router, publicProcedure } from "./init";
import {
  createCategorySchema,
  updateCategorySchema,
  getCategoryBySlugSchema,
  getCategoryByIdSchema,
  deleteCategorySchema,
} from "../validations/category.schema";
import { categories, postCategories } from "@/db/schema";
import { eq, sql, count } from "drizzle-orm";
import { slugify } from "../utils/slugify";
import { TRPCError } from "@trpc/server";

export const categoryRouter = router({
  /**
   * Get all categories
   * Returns all categories with post count for each
   */
  getAll: publicProcedure.query(async ({ ctx }) => {
    const allCategories = await ctx.db.select().from(categories);

    // Get post count for each category
    const categoriesWithCount = await Promise.all(
      allCategories.map(async (category) => {
        const [postCount] = await ctx.db
          .select({ count: count() })
          .from(postCategories)
          .where(eq(postCategories.categoryId, category.id));

        return {
          ...category,
          postCount: postCount?.count || 0,
        };
      })
    );

    return categoriesWithCount;
  }),

  /**
   * Get a single category by slug
   */
  getBySlug: publicProcedure
    .input(getCategoryBySlugSchema)
    .query(async ({ ctx, input }) => {
      const [category] = await ctx.db
        .select()
        .from(categories)
        .where(eq(categories.slug, input.slug))
        .limit(1);

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      // Get post count for this category
      const [postCount] = await ctx.db
        .select({ count: count() })
        .from(postCategories)
        .where(eq(postCategories.categoryId, category.id));

      return {
        ...category,
        postCount: postCount?.count || 0,
      };
    }),

  /**
   * Get a single category by ID
   */
  getById: publicProcedure
    .input(getCategoryByIdSchema)
    .query(async ({ ctx, input }) => {
      const [category] = await ctx.db
        .select()
        .from(categories)
        .where(eq(categories.id, input.categoryId))
        .limit(1);

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      return category;
    }),

  /**
   * Create a new category
   * Automatically generates slug from name
   */
  create: publicProcedure
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
      // Generate slug from name
      const slug = slugify(input.name);

      // Check if slug already exists
      const existingCategory = await ctx.db
        .select()
        .from(categories)
        .where(eq(categories.slug, slug))
        .limit(1);

      if (existingCategory.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A category with this name already exists",
        });
      }

      // Create the category
      const [category] = await ctx.db
        .insert(categories)
        .values({
          name: input.name,
          slug,
          description: input.description,
        })
        .returning();

      return category;
    }),

  /**
   * Update an existing category
   * Regenerates slug if name changes
   */
  update: publicProcedure
    .input(updateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const { categoryId, ...updateData } = input;

      // Check if category exists
      const [existingCategory] = await ctx.db
        .select()
        .from(categories)
        .where(eq(categories.id, categoryId))
        .limit(1);

      if (!existingCategory) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      // Prepare update object with proper typing
      const updateFields: {
        name?: string;
        description?: string;
        slug?: string;
      } = { ...updateData };

      // If name is updated, regenerate slug
      if (updateData.name) {
        const newSlug = slugify(updateData.name);

        // Check if new slug conflicts with another category
        const conflictingCategory = await ctx.db
          .select()
          .from(categories)
          .where(
            sql`${categories.slug} = ${newSlug} AND ${categories.id} != ${categoryId}`
          )
          .limit(1);

        if (conflictingCategory.length > 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A category with this name already exists",
          });
        }

        updateFields.slug = newSlug;
      }

      // Update the category
      const [updatedCategory] = await ctx.db
        .update(categories)
        .set(updateFields)
        .where(eq(categories.id, categoryId))
        .returning();

      return updatedCategory;
    }),

  /**
   * Delete a category
   * Cascading delete will remove associated post-category relationships
   */
  delete: publicProcedure
    .input(deleteCategorySchema)
    .mutation(async ({ ctx, input }) => {
      // Check if category exists
      const [existingCategory] = await ctx.db
        .select()
        .from(categories)
        .where(eq(categories.id, input.categoryId))
        .limit(1);

      if (!existingCategory) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      // Check if category has posts
      const [postCount] = await ctx.db
        .select({ count: count() })
        .from(postCategories)
        .where(eq(postCategories.categoryId, input.categoryId));

      if ((postCount?.count || 0) > 0) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Cannot delete category. It is associated with ${postCount?.count} post(s).`,
        });
      }

      // Delete the category
      await ctx.db.delete(categories).where(eq(categories.id, input.categoryId));

      return { success: true, message: "Category deleted successfully" };
    }),
});
