import { useRouter } from 'expo-router';
import { createContext, ReactNode, useContext, useState } from 'react';
import { Alert } from 'react-native';

import { FoodFormValues } from '@/components/foods';
import { useFoods } from '@/hooks/useDatabase';

type FoodNewContextType = {
  barcodeError?: string;
  initialBarcode: string;
  handleSubmit: (values: FoodFormValues) => Promise<void>;
};

const FoodNewContext = createContext<FoodNewContextType | null>(null);

export function useFoodNewContextProvider() {
  const context = useContext(FoodNewContext);

  if (context === null) {
    throw new Error('useFoodNewContextProvider must be used within a FoodNewContext');
  }

  return context;
}

export function FoodNewContextProvider({
  children,
  initialBarcode = '',
}: {
  children: ReactNode;
  initialBarcode?: string;
}) {
  const router = useRouter();
  const { addFood, findFoodByBarcode } = useFoods();
  const [barcodeError, setBarcodeError] = useState<string>();

  const handleSubmit = async (values: FoodFormValues) => {
    const existing = await findFoodByBarcode(values.barcode);

    if (existing) {
      setBarcodeError('Ce code-barres est déjà associé à un aliment.');
      return;
    }

    try {
      const now = new Date();
      const food = await addFood({
        name: values.name,
        barcode: values.barcode,
        image_url: values.image_url || null,
        created_at: now,
        updated_at: now,
      });
      router.replace(`/foods/${food.id}`);
    } catch (error) {
      Alert.alert(
        'Erreur',
        error instanceof Error ? error.message : "Impossible d'enregistrer l'aliment."
      );
    }
  };

  return (
    <FoodNewContext.Provider value={{ barcodeError, initialBarcode, handleSubmit }}>
      {children}
    </FoodNewContext.Provider>
  );
}
