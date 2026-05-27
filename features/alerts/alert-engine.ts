import { asc } from 'drizzle-orm';
import { useCallback, useEffect, useState } from 'react';

import { useDatabase } from '@/db/DatabaseProvider';
import {
  foodAlertSettingTable,
  foodInstanceTable,
  foodTable,
  globalAlertSettingTable,
} from '@/db/schema';
import { Food, FoodAlertSetting, FoodInstance, GlobalAlertSetting } from '@/hooks/useDatabase';

export type AlertItem = {
  id: string;
  food: Food;
  instance: FoodInstance;
  daysUntilExpiration: number;
  threshold: number;
  isCustom: boolean;
};

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function getDaysUntilExpiration(expirationDate: string) {
  const expiration = new Date(`${expirationDate}T00:00:00`);
  expiration.setHours(0, 0, 0, 0);
  return Math.ceil((expiration.getTime() - startOfToday().getTime()) / 86_400_000);
}

function getBestThreshold(daysUntilExpiration: number, thresholds: number[]): number | undefined {
  const matches = thresholds
    .filter((daysBefore) => daysUntilExpiration <= daysBefore)
    .sort((a, b) => a - b);

  return matches.length > 0 ? matches[0] : undefined;
}

export function buildAlertItems({
  foods,
  instances,
  globalSettings,
  foodSettings,
}: {
  foods: Food[];
  instances: FoodInstance[];
  globalSettings: GlobalAlertSetting[];
  foodSettings: FoodAlertSetting[];
}) {
  const foodsById = new Map(foods.map((food) => [food.id, food]));
  const globalThresholds = globalSettings
    .filter((setting) => setting.is_active)
    .map((setting) => setting.days_before);

  return instances
    .filter((instance) => instance.status === 'active')
    .flatMap((instance) => {
      const food = foodsById.get(instance.food_id);
      if (!food) return [];

      const customSettings = foodSettings.filter((setting) => setting.food_id === food.id);
      const customThresholds = customSettings
        .filter((setting) => setting.is_active)
        .map((setting) => setting.days_before);
      const thresholds = customSettings.length > 0 ? customThresholds : globalThresholds;
      const daysUntilExpiration = getDaysUntilExpiration(instance.expiration_date);
      const threshold = getBestThreshold(daysUntilExpiration, thresholds);

      if (threshold === undefined) return [];

      return [
        {
          id: `${instance.id}-${threshold}`,
          food,
          instance,
          daysUntilExpiration,
          threshold,
          isCustom: customSettings.length > 0,
        },
      ];
    })
    .sort((a, b) => a.daysUntilExpiration - b.daysUntilExpiration);
}

export function useAlertItems() {
  const db = useDatabase();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const [foods, instances, globalSettings, foodSettings] = await Promise.all([
        db.select().from(foodTable).orderBy(asc(foodTable.name)),
        db.select().from(foodInstanceTable).orderBy(asc(foodInstanceTable.expiration_date)),
        db.select().from(globalAlertSettingTable).orderBy(asc(globalAlertSettingTable.days_before)),
        db.select().from(foodAlertSettingTable).orderBy(asc(foodAlertSettingTable.days_before)),
      ]);

      setAlerts(buildAlertItems({ foods, instances, globalSettings, foodSettings }));
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { alerts, loading, refetch };
}

export function formatAlertCountdown(daysUntilExpiration: number) {
  if (daysUntilExpiration < 0) return `Expiré depuis ${Math.abs(daysUntilExpiration)} j`;
  if (daysUntilExpiration === 0) return "Expire aujourd'hui";
  if (daysUntilExpiration === 1) return 'Expire demain';
  return `Expire dans ${daysUntilExpiration} j`;
}
