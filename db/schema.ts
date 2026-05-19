import { int, text, sqliteTable } from 'drizzle-orm/sqlite-core';

export const foodTable = sqliteTable('food_table', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  barecode: int().notNull().unique(),
  image_url: text(),
  created_at: int().notNull(),
  updated_at: int().notNull(),
});
