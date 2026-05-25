import React from 'react';
import { Text as NativeText, TextProps as NativeTextProps } from 'react-native';

type TextVariant = 'display' | 'title' | 'subtitle' | 'body' | 'caption' | 'label' | 'button';
type TextTone = 'default' | 'muted' | 'subtle' | 'success' | 'danger' | 'inverse';

type TextProps = NativeTextProps & {
  children: React.ReactNode;
  variant?: TextVariant;
  tone?: TextTone;
  className?: string;
};

const variantClasses: Record<TextVariant, string> = {
  display: 'text-3xl font-bold',
  title: 'text-xl font-bold',
  subtitle: 'text-lg font-semibold',
  body: 'text-base',
  caption: 'text-sm',
  label: 'text-sm font-medium',
  button: 'font-semibold',
};

const toneClasses: Record<TextTone, string> = {
  default: 'text-slate-900',
  muted: 'text-slate-600',
  subtle: 'text-slate-500',
  success: 'text-emerald-700',
  danger: 'text-red-700',
  inverse: 'text-white',
};

export function Text({
  children,
  variant = 'body',
  tone = 'default',
  className = '',
  ...props
}: TextProps) {
  return (
    <NativeText className={`${variantClasses[variant]} ${toneClasses[tone]} ${className}`} {...props}>
      {children}
    </NativeText>
  );
}
