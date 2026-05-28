import { useRouter } from 'expo-router';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import NotFoundScreen from '@/app/+not-found';
import { useGlobalContext } from '@/components/GlobalProvider';
import { FoodFormValues } from '@/components/foods';
import { Food, FoodInstance, useFoodInstances, useFoods } from '@/hooks/useDatabase';

export type FoodInstanceFormValues = {
  expirationDate: string;
  quantity: number;
};

type FoodIdContextType = {
  food: Food;
  activeInstances: FoodInstance[];
  barcodeError: string;
  handleAddInstance: (values: FoodInstanceFormValues) => Promise<void>;
  handleDelete: () => void;
  handleArchiveInstance: (instanceId: number, status: 'consumed' | 'discarded') => void;
  handleDeleteInstance: (instanceId: number) => void;
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
  const { setIsLoading } = useGlobalContext();
  const { deleteFood, findFoodById, findFoodByBarcode, updateFood } = useFoods();
  const { addInstance, archiveInstance, deleteInstance, getActiveInstancesByFoodId } =
    useFoodInstances();
  const [food, setFood] = useState<Food | null>();
  const [activeInstances, setActiveInstances] = useState<FoodInstance[]>([]);
  const [barcodeError, setBarcodeError] = useState('');

  useEffect(() => {
    async function loadFood() {
      setIsLoading(true);
      try {
        const data = await findFoodById(foodId);
        setFood(data);

        if (data) {
          const instances = await getActiveInstancesByFoodId(foodId);
          setActiveInstances(instances);
        }
      } catch (error) {
        console.error(error);
        setFood(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadFood();
  }, [findFoodById, foodId, getActiveInstancesByFoodId, setIsLoading]);

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

  const handleAddInstance = async (values: FoodInstanceFormValues) => {
    try {
      const now = new Date();
      await addInstance({
        food_id: foodId,
        expiration_date: values.expirationDate,
        quantity: values.quantity,
        status: 'active',
        created_at: now,
        updated_at: now,
      });
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Erreur',
        error instanceof Error ? error.message : "Impossible d'ajouter le lot."
      );
    }
  };

  const handleArchiveInstance = (instanceId: number, status: 'consumed' | 'discarded') => {
    const label = status === 'consumed' ? 'consommé' : 'jeté';

    Alert.alert(
      `Marquer ce lot comme ${label} ?`,
      "Le lot sortira des lots actifs et apparaîtra dans l'historique.",
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: status === 'consumed' ? 'Consommé' : 'Jeté',
          style: status === 'discarded' ? 'destructive' : 'default',
          onPress: async () => {
            await archiveInstance(instanceId, status);
            const instances = await getActiveInstancesByFoodId(foodId);
            setActiveInstances(instances);
          },
        },
      ]
    );
  };

  const handleDeleteInstance = (instanceId: number) => {
    Alert.alert('Supprimer ce lot ?', 'Cette action est définitive.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await deleteInstance(instanceId);
          const instances = await getActiveInstancesByFoodId(foodId);
          setActiveInstances(instances);
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
      console.error(error);
      Alert.alert(
        'Erreur',
        error instanceof Error ? error.message : "Impossible de modifier l'aliment."
      );
    }
  };

  if (!food) return <NotFoundScreen />;

  return (
    <FoodIdContext.Provider
      value={{
        food,
        activeInstances,
        barcodeError,
        handleAddInstance,
        handleDelete,
        handleArchiveInstance,
        handleDeleteInstance,
        handleSubmit,
      }}
    >
      {children}
    </FoodIdContext.Provider>
  );
}
