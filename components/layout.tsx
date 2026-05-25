import React from 'react';
import { ScrollView, ScrollViewProps, View, ViewProps } from 'react-native';

export function ScreenView({ children, className = '', ...props }: ViewProps) {
  return (
    <View className={`flex-1 bg-slate-50 px-4 py-4 ${className}`} {...props}>
      {children}
    </View>
  );
}

export function ScreenScrollView({
  children,
  className = '',
  contentContainerStyle,
  ...props
}: ScrollViewProps) {
  return (
    <ScrollView
      className={`flex-1 bg-slate-50 px-4 py-4 ${className}`}
      contentContainerStyle={[{ paddingBottom: 32 }, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      {...props}
    >
      {children}
    </ScrollView>
  );
}
