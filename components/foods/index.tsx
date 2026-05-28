import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Text } from '@/components/ui/Text';
import type { Food } from '@/hooks/useDatabase';

export type FoodFormValues = {
  name: string;
  barcode: string;
};

export function FoodImage({ size = 64 }: { size?: number; uri?: string | null }) {
  return (
    <View
      style={{ width: size, height: size }}
      className="items-center justify-center rounded-2xl bg-emerald-100"
    >
      <FontAwesome name="cutlery" size={Math.max(20, size / 2.5)} color="#059669" />
    </View>
  );
}

export function FoodCard({
  food,
  activeLotCount = 0,
  nearestExpiration,
  onPress,
}: {
  food: Food;
  activeLotCount?: number;
  nearestExpiration?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 flex-row items-center gap-3 rounded-3xl border border-slate-200 bg-white p-3"
    >
      <View className="items-center justify-center rounded-2xl bg-emerald-100 p-3">
        <FontAwesome name="cutlery" size={24} color="#059669" />
      </View>
      <View className="flex-1 gap-1">
        <Text variant="subtitle">{food.name}</Text>
        <Text variant="caption" tone="subtle">
          {activeLotCount} lot{activeLotCount > 1 ? 's' : ''} actif{activeLotCount > 1 ? 's' : ''}
        </Text>
        <Text variant="caption" tone="subtle">
          Prochaine péremption : {nearestExpiration ?? '—'}
        </Text>
      </View>
      <FontAwesome name="chevron-right" size={16} color="#94a3b8" />
    </Pressable>
  );
}

export function FoodForm({
  initialValues,
  submitLabel,
  barcodeError,
  hideImageField,
  onSubmit,
}: {
  initialValues?: Partial<FoodFormValues>;
  submitLabel: string;
  barcodeError?: string;
  hideImageField?: boolean;
  onSubmit: (values: FoodFormValues) => void;
}) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [barcode, setBarcode] = useState(initialValues?.barcode ?? '');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setName(initialValues?.name ?? '');
    setBarcode(initialValues?.barcode ?? '');
  }, [initialValues?.barcode, initialValues?.name]);

  const nameError = submitted && !name.trim() ? 'Le nom est requis.' : undefined;
  const barcodeRequiredError =
    submitted && !barcode.trim() ? 'Le code-barres est requis.' : undefined;

  return (
    <View className="gap-5">
      <Field
        label="Nom"
        value={name}
        onChangeText={setName}
        error={nameError}
        placeholder="Ex. Yaourt"
      />
      <Field
        label="Code-barres"
        value={barcode}
        onChangeText={setBarcode}
        error={barcodeRequiredError ?? barcodeError}
        placeholder="Ex. 3560071234567"
        keyboardType="number-pad"
      />
      <Button
        onPress={() => {
          setSubmitted(true);
          if (!name.trim() || !barcode.trim()) return;
          onSubmit({ name: name.trim(), barcode: barcode.trim() });
        }}
      >
        <Text variant="button" tone="inverse">
          {submitLabel}
        </Text>
      </Button>
    </View>
  );
}
