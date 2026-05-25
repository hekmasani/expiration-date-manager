import { FoodForm } from '@/components/foods';

import { useFoodNewContextProvider } from '../provider';

export function FoodNewForm() {
  const { barcodeError, initialBarcode, handleSubmit } = useFoodNewContextProvider();

  return (
    <FoodForm
      initialValues={{ barcode: initialBarcode }}
      submitLabel="Créer l'aliment"
      barcodeError={barcodeError}
      onSubmit={handleSubmit}
    />
  );
}
