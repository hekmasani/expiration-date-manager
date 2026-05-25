import { TextInputProps } from 'react-native';

import { Input } from './Input';

type FieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export function Field({ label, error, ...props }: FieldProps) {
  return <Input label={label} error={error} {...props} />;
}
