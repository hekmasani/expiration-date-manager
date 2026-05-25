import { Scanner } from '@/features/scanner/containers/scanner';
import { ScannerContextProvider } from '@/features/scanner/provider';

export default function ScannerScreen() {
  return (
    <ScannerContextProvider>
      <Scanner />
    </ScannerContextProvider>
  );
}
