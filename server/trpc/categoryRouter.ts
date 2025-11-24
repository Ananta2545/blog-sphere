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
  getAll: publicProcedure.query(async ({ ctx }) => {
    const allCategories = await ctx.db.select().from(categories);
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
      const [postCount] = await ctx.db
        .select({ count: count() })
        .from(postCategories)
        .where(eq(postCategories.categoryId, category.id));
      return {
        ...category,
        postCount: postCount?.count || 0,
      };
    }),

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

  create: publicProcedure
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const slug = slugify(input.name);
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

  update: publicProcedure
    .input(updateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const { categoryId, ...updateData } = input;
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
      const updateFields: {
        name?: string;
        description?: string;
        slug?: string;
      } = { ...updateData };
      if (updateData.name) {
        const newSlug = slugify(updateData.name);
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
      const [updatedCategory] = await ctx.db
        .update(categories)
        .set(updateFields)
        .where(eq(categories.id, categoryId))
        .returning();
      return updatedCategory;
    }),
    
  delete: publicProcedure
    .input(deleteCategorySchema)
    .mutation(async ({ ctx, input }) => {
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
      await ctx.db.delete(categories).where(eq(categories.id, input.categoryId));
      return { success: true, message: "Category deleted successfully" };
    }),
});
