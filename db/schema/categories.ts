import { pgTable, serial, varchar, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { postCategories } from "./postCategories";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).unique().notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  description: text("description"),
});

// Relations for categories
export const categoriesRelations = relations(categories, ({ many }) => ({
  postCategories: many(postCategories),
}));
