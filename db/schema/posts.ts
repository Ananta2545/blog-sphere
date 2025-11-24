import { pgTable, serial, varchar, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { postCategories } from "./postCategories";

export const postStatusEnum = pgEnum("status", ["DRAFT", "PUBLISHED"]);

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  status: postStatusEnum("status").default("DRAFT").notNull(),
  wordCount: integer("word_count").default(0),
  readingTimeMins: integer("reading_time_mins").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const postsRelations = relations(posts, ({ many }) => ({
  postCategories: many(postCategories),
}));
