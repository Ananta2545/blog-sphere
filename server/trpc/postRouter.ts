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
  /**
   * Get all posts with filtering, search, and pagination
   * Supports filtering by category, search query, and status
   */
  getAll: publicProcedure
    .input(getPostsFilterSchema.optional().transform((val) => val ?? { page: 1, limit: 10, status: 'PUBLISHED' as const }))
    .query(async ({ ctx, input }) => {
      const { categorySlug, searchQuery, page, limit, status } = input;
      const offset = (page - 1) * limit;

      // Build the where conditions
      const conditions = [];

      // Filter by status
      if (status !== "ALL") {
        conditions.push(eq(posts.status, status));
      }

      // Search in title and content
      if (searchQuery) {
        conditions.push(
          or(
            like(posts.title, `%${searchQuery}%`),
            like(posts.content, `%${searchQuery}%`)
          )
        );
      }

      // Get posts with pagination
      let postsData;
      
      if (categorySlug) {
        // Query with category filter
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
        // Query without category filter
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

      // Get total count for pagination
      const [totalResult] = await ctx.db
        .select({ count: count() })
        .from(posts)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      const total = totalResult?.count || 0;

      // Get categories for each post
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

  /**
   * Get all posts for dashboard (includes drafts)
   * Returns all posts without filtering
   */
  getAllForDashboard: publicProcedure.query(async ({ ctx }) => {
    const postsData = await ctx.db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt));

    // Get categories for each post
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

  /**
   * Get a single post by slug
   */
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

      // Get categories for this post
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

  /**
   * Get a single post by ID (Published posts only for public viewing)
   */
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

      // Get categories for this post
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

  /**
   * Get a single post by ID including drafts (for dashboard/preview)
   */
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

      // Get categories for this post
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

  /**
   * Create a new post
   * Automatically generates slug, word count, and reading time
   */
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
      
      // Generate slug from title
      const slug = slugify(input.title);

      // Check if slug already exists
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

      // Calculate word count from content
      const { wordCount } = getStats(input.content);
      
      // Use user-provided reading time or default to 1 minute
      const readingTimeMins = input.readingTimeMins || 1;

      // Create the post
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

      // Assign categories if provided
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

  /**
   * Update an existing post
   * Recalculates word count and reading time if content changes
   */
  update: publicProcedure
    .input(updatePostSchema)
    .mutation(async ({ ctx, input }) => {
      const { postId, categoryIds, ...updateData } = input;

      // Check if post exists
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

      // Prepare update object with proper typing
      const updateFields: {
        title?: string;
        content?: string;
        slug?: string;
        status?: 'DRAFT' | 'PUBLISHED';
        wordCount?: number;
        readingTimeMins?: number;
        updatedAt?: Date;
      } = { ...updateData };

      // If content is updated, recalculate word count only
      if (updateData.content) {
        const { wordCount } = getStats(updateData.content);
        updateFields.wordCount = wordCount;
      }
      
      // If readingTimeMins is provided, use it
      if (input.readingTimeMins !== undefined) {
        updateFields.readingTimeMins = input.readingTimeMins;
      }

      // If title is updated, regenerate slug
      if (updateData.title) {
        const newSlug = slugify(updateData.title);
        
        // Check if new slug conflicts with another post
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

      // Update timestamp
      updateFields.updatedAt = new Date();

      // Update the post
      const [updatedPost] = await ctx.db
        .update(posts)
        .set(updateFields)
        .where(eq(posts.id, postId))
        .returning();

      // Update categories if provided
      if (categoryIds !== undefined) {
        // Delete existing category associations
        await ctx.db
          .delete(postCategories)
          .where(eq(postCategories.postId, postId));

        // Insert new category associations
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

  /**
   * Delete a post
   * Cascading delete will remove associated category relationships
   */
  delete: publicProcedure
    .input(deletePostSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if post exists
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

      // Delete the post (cascade will handle postCategories)
      await ctx.db.delete(posts).where(eq(posts.id, input.postId));

      return { success: true, message: "Post deleted successfully" };
    }),

  /**
   * Get statistics for dashboard
   * Returns counts for total posts, published, drafts, and categories
   */
  getStats: publicProcedure.query(async ({ ctx }) => {
    // Get total posts count
    const [totalPosts] = await ctx.db
      .select({ count: count() })
      .from(posts);

    // Get published posts count
    const [publishedPosts] = await ctx.db
      .select({ count: count() })
      .from(posts)
      .where(eq(posts.status, "PUBLISHED"));

    // Get draft posts count
    const [draftPosts] = await ctx.db
      .select({ count: count() })
      .from(posts)
      .where(eq(posts.status, "DRAFT"));

    // Get total categories count
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
