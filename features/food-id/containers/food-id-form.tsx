import { FoodForm } from '@/components/foods';

import { useFoodIdContextProvider } from '../provider';

export function FoodIdForm() {
  const { food, barcodeError, handleSubmit } = useFoodIdContextProvider();

  return (
    <FoodForm
      initialValues={{
        name: food.name,
        barcode: food.barcode,
      }}
      submitLabel="Enregistrer"
      barcodeError={barcodeError}
      onSubmit={handleSubmit}
    />
  );
}
