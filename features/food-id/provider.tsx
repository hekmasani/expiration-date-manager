import { useRouter } from 'expo-router';

import NotFoundScreen from '@/app/+not-found';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { FoodFormValues } from '@/components/foods';
import { useGlobalLoading } from '@/components/GlobalProvider';
import { Food, useFoods } from '@/hooks/useDatabase';

type FoodIdContextType = {
  food: Food;
  barcodeError: string;
  handleDelete: () => void;
  handleSubmit: (values: FoodFormValues) => Promise<void>;
};

const FoodIdContext = createContext<FoodIdContextType | null>(null);

export function useFoodIdContextProvider() {
  const context = useContext(FoodIdContext);

  if (context === null) {
    throw new Error('useFoodIdContextProvider must be used within a FoodIdContext');
  }

  return context;
}

export function FoodContextProvider({ children, foodId }: { children: ReactNode; foodId: number }) {
  const router = useRouter();
  const { setIsLoading } = useGlobalLoading();
  const { deleteFood, findFoodById, findFoodByBarcode, updateFood } = useFoods();
  const [food, setFood] = useState<Food | null>();
  const [barcodeError, setBarcodeError] = useState('');

  useEffect(() => {
    async function loadFood() {
      setIsLoading(true);
      try {
        const data = await findFoodById(foodId);
        setFood(data);
      } catch (error) {
        console.error(error);
        setFood(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadFood();
  }, [findFoodById, foodId, setIsLoading]);

  const handleDelete = () => {
    Alert.alert('Supprimer cet aliment ?', 'Cette action est définitive.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await deleteFood(foodId);
          router.back();
        },
      },
    ]);
  };

  const handleSubmit = async (values: FoodFormValues) => {
    const existingFood = await findFoodByBarcode(values.barcode);

    if (existingFood && existingFood.id !== foodId) {
      setBarcodeError('Ce code-barres est déjà associé à un autre aliment.');
      return;
    }

    try {
      await updateFood(foodId, {
        name: values.name,
        barcode: values.barcode,
        image_url: values.image_url || null,
      });
      router.back();
    } catch (error) {
      Alert.alert(
        'Erreur',
        error instanceof Error ? error.message : "Impossible de modifier l'aliment."
      );
    }
  };

  if (food === undefined) return null;
  if (food === null) return <NotFoundScreen />;

  return (
    <FoodIdContext.Provider value={{ food, barcodeError, handleDelete, handleSubmit }}>
      {children}
    </FoodIdContext.Provider>
  );
}
