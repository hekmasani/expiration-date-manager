import React from 'react';
import { TextInput, TextInputProps, View } from 'react-native';

import { Text } from './Text';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export function Input({
  label,
  error,
  className = '',
  ...props
}: InputProps & { className?: string }) {
  return (
    <View className="gap-2">
      {label ? (
        <Text variant="label" tone="muted">
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor="#94a3b8"
        className={`rounded-2xl border bg-white px-4 py-3 text-slate-900 ${
          error ? 'border-red-300' : 'border-slate-200'
        } ${className}`}
        {...props}
      />
      {error ? (
        <Text variant="caption" tone="danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
