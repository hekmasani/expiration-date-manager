import React from 'react';
import { View, ViewProps } from 'react-native';

type CardProps = ViewProps & {
  className?: string;
};

export function Card({ className = '', ...props }: CardProps) {
  return (
    <View className={`rounded-3xl border border-slate-200 bg-white p-4 ${className}`} {...props} />
  );
}
