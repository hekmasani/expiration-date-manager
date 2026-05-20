import { relations } from 'drizzle-orm';
import { int, integer, real, text, sqliteTable } from 'drizzle-orm/sqlite-core';

export const foodTable = sqliteTable('food_table', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  barcode: text().notNull().unique(),
  image_url: text(),
  created_at: integer({ mode: 'timestamp' }).notNull(),
  updated_at: integer({ mode: 'timestamp' }).notNull(),
});

export const foodRelations = relations(foodTable, ({ many }) => ({
  instances: many(foodInstanceTable),
  alertSettings: many(foodAlertSettingTable),
  recipeIngredients: many(recipeIngredientTable),
}));

export const foodInstanceTable = sqliteTable('food_instance_table', {
  id: int().primaryKey({ autoIncrement: true }),
  food_id: int()
    .notNull()
    .references(() => foodTable.id),
  expiration_date: text().notNull(),
  quantity: int().notNull().default(1),
  status: text({ enum: ['active', 'consumed', 'discarded'] })
    .notNull()
    .default('active'),
  consumed_at: integer({ mode: 'timestamp' }),
  discarded_at: integer({ mode: 'timestamp' }),
  created_at: integer({ mode: 'timestamp' }).notNull(),
  updated_at: integer({ mode: 'timestamp' }).notNull(),
});

export const foodInstanceRelations = relations(
  foodInstanceTable,
  ({ one }) => ({
    food: one(foodTable, {
      fields: [foodInstanceTable.food_id],
      references: [foodTable.id],
    }),
  }),
);

export const globalAlertSettingTable = sqliteTable('global_alert_setting_table', {
  id: int().primaryKey({ autoIncrement: true }),
  days_before: int().notNull(),
  is_active: int({ mode: 'boolean' }).notNull().default(true),
  created_at: integer({ mode: 'timestamp' }).notNull(),
  updated_at: integer({ mode: 'timestamp' }).notNull(),
});

export const foodAlertSettingTable = sqliteTable('food_alert_setting_table', {
  id: int().primaryKey({ autoIncrement: true }),
  food_id: int()
    .notNull()
    .references(() => foodTable.id),
  days_before: int().notNull(),
  is_active: int({ mode: 'boolean' }).notNull().default(true),
  created_at: integer({ mode: 'timestamp' }).notNull(),
  updated_at: integer({ mode: 'timestamp' }).notNull(),
});

export const foodAlertSettingRelations = relations(
  foodAlertSettingTable,
  ({ one }) => ({
    food: one(foodTable, {
      fields: [foodAlertSettingTable.food_id],
      references: [foodTable.id],
    }),
  }),
);

export const recipeTable = sqliteTable('recipe_table', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  instructions: text(),
  prep_time_minutes: int(),
  image_url: text(),
  created_at: integer({ mode: 'timestamp' }).notNull(),
  updated_at: integer({ mode: 'timestamp' }).notNull(),
});

export const recipeRelations = relations(recipeTable, ({ many }) => ({
  ingredients: many(recipeIngredientTable),
}));

export const recipeIngredientTable = sqliteTable('recipe_ingredient_table', {
  id: int().primaryKey({ autoIncrement: true }),
  recipe_id: int()
    .notNull()
    .references(() => recipeTable.id),
  food_id: int()
    .notNull()
    .references(() => foodTable.id),
  quantity: real(),
  unit: text(),
});

export const recipeIngredientRelations = relations(
  recipeIngredientTable,
  ({ one }) => ({
    recipe: one(recipeTable, {
      fields: [recipeIngredientTable.recipe_id],
      references: [recipeTable.id],
    }),
    food: one(foodTable, {
      fields: [recipeIngredientTable.food_id],
      references: [foodTable.id],
    }),
  }),
);
