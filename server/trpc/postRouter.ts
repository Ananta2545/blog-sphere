import { router, publicProcedure } from "./init";
import {
  createPostSchema,
  updatePostSchema,
  getPostsFilterSchema,
  getPostBySlugSchema,
  getPostByIdSchema,
  deletePostSchema,
} from "../validations/post.schema";
import { posts, postCategories, categories } from "@/db/schema";
import { eq, desc, and, or, like, sql, count } from "drizzle-orm";
import { slugify } from "../utils/slugify";
import { getStats } from "../utils/readingTime";
import { TRPCError } from "@trpc/server";
export const postRouter = router({
  getAll: publicProcedure
    .input(getPostsFilterSchema.optional().transform((val) => val ?? { page: 1, limit: 10, status: 'PUBLISHED' as const }))
    .query(async ({ ctx, input }) => {
      const { categorySlug, searchQuery, page, limit, status } = input;
      const offset = (page - 1) * limit;
      const conditions = [];
      if (status !== "ALL") {
        conditions.push(eq(posts.status, status));
      }
      if (searchQuery) {
        conditions.push(
          or(
            like(posts.title, `%${searchQuery}%`),
            like(posts.content, `%${searchQuery}%`)
          )
        );
      }
      let postsData;
      if (categorySlug) {
        postsData = await ctx.db
          .select({
            id: posts.id,
            title: posts.title,
            content: posts.content,
            slug: posts.slug,
            status: posts.status,
            wordCount: posts.wordCount,
            readingTimeMins: posts.readingTimeMins,
            createdAt: posts.createdAt,
            updatedAt: posts.updatedAt,
          })
          .from(posts)
          .innerJoin(postCategories, eq(posts.id, postCategories.postId))
          .innerJoin(categories, eq(postCategories.categoryId, categories.id))
          .where(and(...conditions, eq(categories.slug, categorySlug)))
          .orderBy(desc(posts.createdAt))
          .limit(limit)
          .offset(offset);
      } else {
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
        postsData = await ctx.db
          .select({
            id: posts.id,
            title: posts.title,
            content: posts.content,
            slug: posts.slug,
            status: posts.status,
            wordCount: posts.wordCount,
            readingTimeMins: posts.readingTimeMins,
            createdAt: posts.createdAt,
            updatedAt: posts.updatedAt,
          })
          .from(posts)
          .where(whereClause)
          .orderBy(desc(posts.createdAt))
          .limit(limit)
          .offset(offset);
      }
      const [totalResult] = await ctx.db
        .select({ count: count() })
        .from(posts)
        .where(conditions.length > 0 ? and(...conditions) : undefined);
      const total = totalResult?.count || 0;
      const postsWithCategories = await Promise.all(
        postsData.map(async (post) => {
          const postCats = await ctx.db
            .select({
              id: categories.id,
              name: categories.name,
              slug: categories.slug,
            })
            .from(postCategories)
            .innerJoin(categories, eq(postCategories.categoryId, categories.id))
            .where(eq(postCategories.postId, post.id));
          return {
            ...post,
            categories: postCats,
          };
        })
      );
      return {
        posts: postsWithCategories,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),
  getAllForDashboard: publicProcedure.query(async ({ ctx }) => {
    const postsData = await ctx.db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt));
    const postsWithCategories = await Promise.all(
      postsData.map(async (post) => {
        const postCats = await ctx.db
          .select({
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
          })
          .from(postCategories)
          .innerJoin(categories, eq(postCategories.categoryId, categories.id))
          .where(eq(postCategories.postId, post.id));
        return {
          ...post,
          categories: postCats,
        };
      })
    );
    return postsWithCategories;
  }),
  getSingle: publicProcedure
    .input(getPostBySlugSchema)
    .query(async ({ ctx, input }) => {
      const [post] = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.slug, input.slug))
        .limit(1);
      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }
      const postCats = await ctx.db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
        })
        .from(postCategories)
        .innerJoin(categories, eq(postCategories.categoryId, categories.id))
        .where(eq(postCategories.postId, post.id));
      return {
        ...post,
        categories: postCats,
      };
    }),
  getById: publicProcedure
    .input(getPostByIdSchema)
    .query(async ({ ctx, input }) => {
      const [post] = await ctx.db
        .select()
        .from(posts)
        .where(and(eq(posts.id, input.postId), eq(posts.status, 'PUBLISHED')))
        .limit(1);
      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found or not published yet",
        });
      }
      const postCats = await ctx.db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        })
        .from(postCategories)
        .innerJoin(categories, eq(postCategories.categoryId, categories.id))
        .where(eq(postCategories.postId, post.id));
      return {
        ...post,
        categories: postCats,
      };
    }),
  getByIdIncludingDrafts: publicProcedure
    .input(getPostByIdSchema)
    .query(async ({ ctx, input }) => {
      const [post] = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.id, input.postId))
        .limit(1);
      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }
      const postCats = await ctx.db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        })
        .from(postCategories)
        .innerJoin(categories, eq(postCategories.categoryId, categories.id))
        .where(eq(postCategories.postId, post.id));
      return {
        ...post,
        categories: postCats,
      };
    }),
  create: publicProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      console.log('post.create received input:', JSON.stringify(input, null, 2));
      if (!input) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Input is undefined",
        });
      }
      const slug = slugify(input.title);
      const existingPost = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.slug, slug))
        .limit(1);
      if (existingPost.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A post with this title already exists",
        });
      }
      const { wordCount } = getStats(input.content);
      const readingTimeMins = input.readingTimeMins || 1;
      const [post] = await ctx.db
        .insert(posts)
        .values({
          title: input.title,
          content: input.content,
          slug,
          status: input.status,
          wordCount,
          readingTimeMins,
        })
        .returning();
      if (input.categoryIds && input.categoryIds.length > 0) {
        await ctx.db.insert(postCategories).values(
          input.categoryIds.map((categoryId) => ({
            postId: post.id,
            categoryId,
          }))
        );
      }
      return post;
    }),
  update: publicProcedure
    .input(updatePostSchema)
    .mutation(async ({ ctx, input }) => {
      const { postId, categoryIds, ...updateData } = input;
      const [existingPost] = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.id, postId))
        .limit(1);
      if (!existingPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }
      const updateFields: {
        title?: string;
        content?: string;
        slug?: string;
        status?: 'DRAFT' | 'PUBLISHED';
        wordCount?: number;
        readingTimeMins?: number;
        updatedAt?: Date;
      } = { ...updateData };
      if (updateData.content) {
        const { wordCount } = getStats(updateData.content);
        updateFields.wordCount = wordCount;
      }
      if (input.readingTimeMins !== undefined) {
        updateFields.readingTimeMins = input.readingTimeMins;
      }
      if (updateData.title) {
        const newSlug = slugify(updateData.title);
        const conflictingPost = await ctx.db
          .select()
          .from(posts)
          .where(and(eq(posts.slug, newSlug), sql`${posts.id} != ${postId}`))
          .limit(1);
        if (conflictingPost.length > 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A post with this title already exists",
          });
        }
        updateFields.slug = newSlug;
      }
      updateFields.updatedAt = new Date();
      const [updatedPost] = await ctx.db
        .update(posts)
        .set(updateFields)
        .where(eq(posts.id, postId))
        .returning();
      if (categoryIds !== undefined) {
        await ctx.db
          .delete(postCategories)
          .where(eq(postCategories.postId, postId));
        if (categoryIds.length > 0) {
          await ctx.db.insert(postCategories).values(
            categoryIds.map((categoryId) => ({
              postId,
              categoryId,
            }))
          );
        }
      }
      return updatedPost;
    }),
  delete: publicProcedure
    .input(deletePostSchema)
    .mutation(async ({ ctx, input }) => {
      const [existingPost] = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.id, input.postId))
        .limit(1);
      if (!existingPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }
      await ctx.db.delete(posts).where(eq(posts.id, input.postId));
      return { success: true, message: "Post deleted successfully" };
    }),
  getStats: publicProcedure.query(async ({ ctx }) => {
    const [totalPosts] = await ctx.db
      .select({ count: count() })
      .from(posts);
    const [publishedPosts] = await ctx.db
      .select({ count: count() })
      .from(posts)
      .where(eq(posts.status, "PUBLISHED"));
    const [draftPosts] = await ctx.db
      .select({ count: count() })
      .from(posts)
      .where(eq(posts.status, "DRAFT"));
    const [totalCategories] = await ctx.db
      .select({ count: count() })
      .from(categories);
    return {
      totalPosts: totalPosts?.count || 0,
      publishedPosts: publishedPosts?.count || 0,
      draftPosts: draftPosts?.count || 0,
      totalCategories: totalCategories?.count || 0,
    };
  }),
});
