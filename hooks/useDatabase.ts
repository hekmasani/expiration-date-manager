import { asc, eq } from 'drizzle-orm';
import { useState, useEffect, useCallback } from 'react';

import { useGlobalLoading } from '@/components/GlobalProvider';
import { useDatabase } from '@/db/DatabaseProvider';
import {
  foodTable,
  foodInstanceTable,
  recipeTable,
  recipeIngredientTable,
  globalAlertSettingTable,
  foodAlertSettingTable,
} from '@/db/schema';

export type Food = typeof foodTable.$inferSelect;
export type InsertFood = typeof foodTable.$inferInsert;

export type FoodInstance = typeof foodInstanceTable.$inferSelect;
export type InsertFoodInstance = typeof foodInstanceTable.$inferInsert;

export type Recipe = typeof recipeTable.$inferSelect;
export type InsertRecipe = typeof recipeTable.$inferInsert;

export type RecipeIngredient = typeof recipeIngredientTable.$inferSelect;
export type InsertRecipeIngredient = typeof recipeIngredientTable.$inferInsert;

export type GlobalAlertSetting = typeof globalAlertSettingTable.$inferSelect;
export type InsertGlobalAlertSetting = typeof globalAlertSettingTable.$inferInsert;

export type FoodAlertSetting = typeof foodAlertSettingTable.$inferSelect;
export type InsertFoodAlertSetting = typeof foodAlertSettingTable.$inferInsert;

export function useFoodLookup() {
  const db = useDatabase();

  const findFoodByBarcode = useCallback(
    async (barcode: string): Promise<Food | null> => {
      try {
        const result = await db.select().from(foodTable).where(eq(foodTable.barcode, barcode));
        return result.length > 0 ? result[0] : null;
      } catch (e) {
        throw e;
      }
    },
    [db]
  );

  return { findFoodByBarcode };
}

export function useFoods() {
  const db = useDatabase();
  const { setIsLoading } = useGlobalLoading();
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFoods = useCallback(async () => {
    setLoading(true);
    setIsLoading(true);
    try {
      const data = await db.select().from(foodTable).orderBy(asc(foodTable.name));
      setFoods(data);
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  }, [db, setIsLoading]);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  const addFood = async (food: InsertFood) => {
    try {
      const result = await db.insert(foodTable).values(food).returning();
      await fetchFoods();
      return result[0];
    } catch (e) {
      throw e;
    }
  };

  const updateFood = async (id: number, food: Partial<InsertFood>) => {
    try {
      const result = await db
        .update(foodTable)
        .set({ ...food, updated_at: new Date() })
        .where(eq(foodTable.id, id))
        .returning();
      await fetchFoods();
      return result[0];
    } catch (e) {
      throw e;
    }
  };

  const deleteFood = async (id: number) => {
    try {
      await db.delete(foodTable).where(eq(foodTable.id, id));
      await fetchFoods();
    } catch (e) {
      throw e;
    }
  };

  const findFoodById = useCallback(
    async (id: number): Promise<Food | null> => {
      try {
        const result = await db.select().from(foodTable).where(eq(foodTable.id, id));
        return result.length > 0 ? result[0] : null;
      } catch (e) {
        throw e;
      }
    },
    [db]
  );

  const findFoodByBarcode = useCallback(
    async (barcode: string): Promise<Food | null> => {
      try {
        const result = await db.select().from(foodTable).where(eq(foodTable.barcode, barcode));
        return result.length > 0 ? result[0] : null;
      } catch (e) {
        throw e;
      }
    },
    [db]
  );

  return {
    foods,
    loading,
    error,
    refetch: fetchFoods,
    addFood,
    updateFood,
    deleteFood,
    findFoodById,
    findFoodByBarcode,
  };
}

export function useFoodInstances() {
  const db = useDatabase();
  const { setIsLoading } = useGlobalLoading();
  const [instances, setInstances] = useState<FoodInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInstances = useCallback(async () => {
    setLoading(true);
    setIsLoading(true);
    try {
      const data = await db.select().from(foodInstanceTable);
      setInstances(data);
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  }, [db, setIsLoading]);

  useEffect(() => {
    fetchInstances();
  }, [fetchInstances]);

  const addInstance = async (instance: InsertFoodInstance) => {
    try {
      const result = await db.insert(foodInstanceTable).values(instance).returning();
      await fetchInstances();
      return result[0];
    } catch (e) {
      throw e;
    }
  };

  const updateInstance = async (id: number, instance: Partial<InsertFoodInstance>) => {
    try {
      const result = await db
        .update(foodInstanceTable)
        .set({ ...instance, updated_at: new Date() })
        .where(eq(foodInstanceTable.id, id))
        .returning();
      await fetchInstances();
      return result[0];
    } catch (e) {
      throw e;
    }
  };

  const deleteInstance = async (id: number) => {
    try {
      await db.delete(foodInstanceTable).where(eq(foodInstanceTable.id, id));
      await fetchInstances();
    } catch (e) {
      throw e;
    }
  };

  const getInstancesByFoodId = useCallback(
    async (foodId: number) => {
      try {
        return await db
          .select()
          .from(foodInstanceTable)
          .where(eq(foodInstanceTable.food_id, foodId));
      } catch (e) {
        throw e;
      }
    },
    [db]
  );

  return {
    instances,
    loading,
    error,
    refetch: fetchInstances,
    addInstance,
    updateInstance,
    deleteInstance,
    getInstancesByFoodId,
  };
}

export function useRecipes() {
  const db = useDatabase();
  const { setIsLoading } = useGlobalLoading();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setIsLoading(true);
    try {
      const data = await db.select().from(recipeTable);
      setRecipes(data);
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  }, [db, setIsLoading]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const addRecipe = async (
    recipe: InsertRecipe,
    ingredients: Omit<InsertRecipeIngredient, 'recipe_id'>[]
  ) => {
    try {
      const result = await db.transaction(async (tx) => {
        const newRecipe = await tx.insert(recipeTable).values(recipe).returning();
        const recipeId = newRecipe[0].id;

        if (ingredients.length > 0) {
          const ingredientValues = ingredients.map((ing) => ({
            ...ing,
            recipe_id: recipeId,
          }));
          await tx.insert(recipeIngredientTable).values(ingredientValues);
        }

        return newRecipe[0];
      });
      await fetchRecipes();
      return result;
    } catch (e) {
      throw e;
    }
  };

  const updateRecipe = async (
    id: number,
    recipe: Partial<InsertRecipe>,
    ingredients?: Omit<InsertRecipeIngredient, 'recipe_id'>[]
  ) => {
    try {
      const result = await db.transaction(async (tx) => {
        const updated = await tx
          .update(recipeTable)
          .set({ ...recipe, updated_at: new Date() })
          .where(eq(recipeTable.id, id))
          .returning();

        if (ingredients !== undefined) {
          await tx.delete(recipeIngredientTable).where(eq(recipeIngredientTable.recipe_id, id));
          if (ingredients.length > 0) {
            const ingredientValues = ingredients.map((ing) => ({
              ...ing,
              recipe_id: id,
            }));
            await tx.insert(recipeIngredientTable).values(ingredientValues);
          }
        }

        return updated[0];
      });
      await fetchRecipes();
      return result;
    } catch (e) {
      throw e;
    }
  };

  const deleteRecipe = async (id: number) => {
    try {
      await db.transaction(async (tx) => {
        await tx.delete(recipeIngredientTable).where(eq(recipeIngredientTable.recipe_id, id));
        await tx.delete(recipeTable).where(eq(recipeTable.id, id));
      });
      await fetchRecipes();
    } catch (e) {
      throw e;
    }
  };

  const getRecipeWithIngredients = async (id: number) => {
    try {
      const recipe = await db.query.recipeTable.findFirst({
        where: eq(recipeTable.id, id),
        with: {
          ingredients: {
            with: {
              food: true,
            },
          },
        },
      });
      return recipe;
    } catch (e) {
      throw e;
    }
  };

  return {
    recipes,
    loading,
    error,
    refetch: fetchRecipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeWithIngredients,
  };
}

export function useAlertSettings() {
  const db = useDatabase();
  const { setIsLoading } = useGlobalLoading();
  const [globalSettings, setGlobalSettings] = useState<GlobalAlertSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchGlobalSettings = useCallback(async () => {
    setLoading(true);
    setIsLoading(true);
    try {
      const data = await db.select().from(globalAlertSettingTable);
      setGlobalSettings(data);
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  }, [db, setIsLoading]);

  useEffect(() => {
    fetchGlobalSettings();
  }, [fetchGlobalSettings]);

  const addGlobalSetting = async (setting: InsertGlobalAlertSetting) => {
    try {
      const result = await db.insert(globalAlertSettingTable).values(setting).returning();
      await fetchGlobalSettings();
      return result[0];
    } catch (e) {
      throw e;
    }
  };

  const updateGlobalSetting = async (id: number, setting: Partial<InsertGlobalAlertSetting>) => {
    try {
      const result = await db
        .update(globalAlertSettingTable)
        .set({ ...setting, updated_at: new Date() })
        .where(eq(globalAlertSettingTable.id, id))
        .returning();
      await fetchGlobalSettings();
      return result[0];
    } catch (e) {
      throw e;
    }
  };

  const deleteGlobalSetting = async (id: number) => {
    try {
      await db.delete(globalAlertSettingTable).where(eq(globalAlertSettingTable.id, id));
      await fetchGlobalSettings();
    } catch (e) {
      throw e;
    }
  };

  const getFoodAlertSettings = async (foodId: number) => {
    try {
      return await db
        .select()
        .from(foodAlertSettingTable)
        .where(eq(foodAlertSettingTable.food_id, foodId));
    } catch (e) {
      throw e;
    }
  };

  const addFoodAlertSetting = async (setting: InsertFoodAlertSetting) => {
    try {
      const result = await db.insert(foodAlertSettingTable).values(setting).returning();
      return result[0];
    } catch (e) {
      throw e;
    }
  };

  const updateFoodAlertSetting = async (id: number, setting: Partial<InsertFoodAlertSetting>) => {
    try {
      const result = await db
        .update(foodAlertSettingTable)
        .set({ ...setting, updated_at: new Date() })
        .where(eq(foodAlertSettingTable.id, id))
        .returning();
      return result[0];
    } catch (e) {
      throw e;
    }
  };

  const deleteFoodAlertSetting = async (id: number) => {
    try {
      await db.delete(foodAlertSettingTable).where(eq(foodAlertSettingTable.id, id));
    } catch (e) {
      throw e;
    }
  };

  return {
    globalSettings,
    loading,
    error,
    refetchGlobalSettings: fetchGlobalSettings,
    addGlobalSetting,
    updateGlobalSetting,
    deleteGlobalSetting,
    getFoodAlertSettings,
    addFoodAlertSetting,
    updateFoodAlertSetting,
    deleteFoodAlertSetting,
  };
}
