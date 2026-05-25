import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { Pressable, PressableProps } from 'react-native';

import { Text } from './Text';

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

type ButtonProps = Omit<PressableProps, 'children'> & {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ComponentProps<typeof FontAwesome>['name'];
  className?: string;
  textClassName?: string;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-emerald-600 border-emerald-600',
  secondary: 'bg-white border-slate-200',
  destructive: 'bg-red-50 border-red-200',
  ghost: 'bg-transparent border-transparent',
};

const textVariantClasses: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-slate-700',
  destructive: 'text-red-700',
  ghost: 'text-slate-700',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'rounded-xl px-3 py-2',
  md: 'rounded-2xl px-4 py-3',
  lg: 'rounded-2xl px-5 py-4',
  icon: 'h-16 w-16 rounded-full p-0',
};

const iconColors: Record<ButtonVariant, string> = {
  primary: '#ffffff',
  secondary: '#334155',
  destructive: '#b91c1c',
  ghost: '#334155',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  disabled,
  className = '',
  textClassName = '',
  ...props
}: ButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      className={`flex-row items-center justify-center gap-2 border ${variantClasses[variant]} ${sizeClasses[size]} ${
        disabled ? 'opacity-50' : ''
      } ${className}`}
      {...props}
    >
      {icon ? (
        <FontAwesome name={icon} size={size === 'icon' ? 24 : 16} color={iconColors[variant]} />
      ) : null}
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text variant="button" className={`${textVariantClasses[variant]} ${textClassName}`}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
