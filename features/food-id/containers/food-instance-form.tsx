import DateTimePicker, { DateTimePickerChangeEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

import { useFoodIdContextProvider } from '../provider';

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function FoodInstanceForm() {
  const { food, handleAddInstance } = useFoodIdContextProvider();
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [quantity, setQuantity] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (_event: DateTimePickerChangeEvent, date: Date) => {
    setExpirationDate(date);
    setShowDatePicker(false);
  };

  return (
    <View className="gap-5">
      <View className="rounded-3xl border border-slate-200 bg-white p-4">
        <Text variant="subtitle">{food.name}</Text>
        <Text tone="subtle" className="mt-1">
          Statut initial : actif
        </Text>
      </View>

      <View className="gap-2">
        <Text variant="label" tone="muted">
          Date de péremption
        </Text>
        <View className="rounded-3xl border border-slate-200 bg-white p-4">
          <Text className="mb-3">{formatDate(expirationDate)}</Text>
          <Button variant="secondary" onPress={() => setShowDatePicker(true)}>
            <Text variant="button">Choisir une date</Text>
          </Button>
        </View>
        {showDatePicker ? (
          <DateTimePicker
            value={expirationDate}
            mode="date"
            onValueChange={handleDateChange}
            onDismiss={() => setShowDatePicker(false)}
          />
        ) : null}
      </View>

      <View className="gap-2">
        <Text variant="label" tone="muted">
          Quantité
        </Text>
        <View className="flex-row items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Text variant="button">−</Text>
          </Button>
          <View className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <Text className="text-center">{quantity}</Text>
          </View>
          <Button variant="secondary" size="sm" onPress={() => setQuantity(quantity + 1)}>
            <Text variant="button">+</Text>
          </Button>
        </View>
      </View>

      <Button
        onPress={() => handleAddInstance({ expirationDate: formatDate(expirationDate), quantity })}
      >
        <Text variant="button" tone="inverse">
          Ajouter le lot
        </Text>
      </Button>
    </View>
  );
}
