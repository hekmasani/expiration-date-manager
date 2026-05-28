import { and, asc, desc, eq, ne } from 'drizzle-orm';
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

import { useGlobalContext } from '@/components/GlobalProvider';
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
export type FoodInstanceWithFood = FoodInstance & { food: Food };

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

  const findFoodByBarcode = async (barcode: string): Promise<Food | null> => {
    try {
      const result = await db.select().from(foodTable).where(eq(foodTable.barcode, barcode));
      return result.length > 0 ? result[0] : null;
    } catch (e) {
      throw e;
    }
  };

  return { findFoodByBarcode };
}

export function useFoods() {
  const db = useDatabase();
  const { setIsLoading } = useGlobalContext();
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFoods = async () => {
    setLoading(true);
    setIsLoading(true);
    try {
      const data = await db.select().from(foodTable).orderBy(asc(foodTable.name));
      setFoods(data);
    } catch (e) {
      console.error(e);
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

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

  const findFoodById = async (id: number): Promise<Food | null> => {
    try {
      const result = await db.select().from(foodTable).where(eq(foodTable.id, id));
      return result.length > 0 ? result[0] : null;
    } catch (e) {
      throw e;
    }
  };

  const findFoodByBarcode = async (barcode: string): Promise<Food | null> => {
    try {
      const result = await db.select().from(foodTable).where(eq(foodTable.barcode, barcode));
      return result.length > 0 ? result[0] : null;
    } catch (e) {
      throw e;
    }
  };

  return {
    foods,
    loading,
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
  const { setIsLoading } = useGlobalContext();
  const [instances, setInstances] = useState<FoodInstance[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInstances = async () => {
    setLoading(true);
    setIsLoading(true);
    try {
      const data = await db
        .select()
        .from(foodInstanceTable)
        .orderBy(asc(foodInstanceTable.expiration_date));
      setInstances(data);
    } catch (e) {
      console.error(e);
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInstances();
  }, []);

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

  const getInstancesByFoodId = async (foodId: number) => {
    try {
      return await db
        .select()
        .from(foodInstanceTable)
        .where(eq(foodInstanceTable.food_id, foodId))
        .orderBy(asc(foodInstanceTable.expiration_date));
    } catch (e) {
      throw e;
    }
  };

  const getActiveInstancesByFoodId = async (foodId: number) => {
    try {
      return await db
        .select()
        .from(foodInstanceTable)
        .where(and(eq(foodInstanceTable.food_id, foodId), eq(foodInstanceTable.status, 'active')))
        .orderBy(asc(foodInstanceTable.expiration_date));
    } catch (e) {
      throw e;
    }
  };

  const archiveInstance = async (id: number, status: 'consumed' | 'discarded') => {
    const now = new Date();

    try {
      const result = await db
        .update(foodInstanceTable)
        .set({
          status,
          consumed_at: status === 'consumed' ? now : null,
          discarded_at: status === 'discarded' ? now : null,
          updated_at: now,
        })
        .where(eq(foodInstanceTable.id, id))
        .returning();
      await fetchInstances();
      return result[0];
    } catch (e) {
      throw e;
    }
  };

  const getArchivedInstances = async (): Promise<FoodInstanceWithFood[]> => {
    try {
      return await db.query.foodInstanceTable.findMany({
        where: ne(foodInstanceTable.status, 'active'),
        with: { food: true },
        orderBy: desc(foodInstanceTable.updated_at),
      });
    } catch (e) {
      throw e;
    }
  };

  const getArchivedInstanceById = async (id: number): Promise<FoodInstanceWithFood | null> => {
    try {
      const instance = await db.query.foodInstanceTable.findFirst({
        where: and(eq(foodInstanceTable.id, id), ne(foodInstanceTable.status, 'active')),
        with: { food: true },
      });

      if (instance) return instance;
      return null;
    } catch (e) {
      throw e;
    }
  };

  return {
    instances,
    loading,
    refetch: fetchInstances,
    addInstance,
    updateInstance,
    deleteInstance,
    archiveInstance,
    getInstancesByFoodId,
    getActiveInstancesByFoodId,
    getArchivedInstances,
    getArchivedInstanceById,
  };
}

export function useRecipes() {
  const db = useDatabase();
  const { setIsLoading } = useGlobalContext();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    setLoading(true);
    setIsLoading(true);
    try {
      const data = await db.select().from(recipeTable);
      setRecipes(data);
    } catch (e) {
      console.error(e);
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

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
    refetch: fetchRecipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeWithIngredients,
  };
}

export function useAlertSettings() {
  const db = useDatabase();
  const { setIsLoading } = useGlobalContext();
  const [globalSettings, setGlobalSettings] = useState<GlobalAlertSetting[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGlobalSettings = async () => {
    setLoading(true);
    setIsLoading(true);
    try {
      const data = await db.select().from(globalAlertSettingTable);
      setGlobalSettings(data);
    } catch (e) {
      console.error(e);
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalSettings();
  }, []);

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
    addGlobalSetting,
    updateGlobalSetting,
    deleteGlobalSetting,
    getFoodAlertSettings,
    addFoodAlertSetting,
    updateFoodAlertSetting,
    deleteFoodAlertSetting,
  };
}
