import { BarcodeScanningResult } from 'expo-camera';
import { useRouter } from 'expo-router';
import { createContext, ReactNode, useContext, useEffect, useRef } from 'react';
import { Alert } from 'react-native';

import { useGlobalContext } from '@/components/GlobalProvider';
import { useFoodLookup } from '@/hooks/useDatabase';

type ScannerContextType = {
  handleBarcodeScanned: (result: BarcodeScanningResult) => void;
};

const ScannerContext = createContext<ScannerContextType | null>(null);

export function useScannerContextProvider() {
  const context = useContext(ScannerContext);

  if (context === null) {
    throw new Error('useScannerContextProvider must be used within a ScannerContext');
  }

  return context;
}

function normalizeBarcode(code: string) {
  return code.trim();
}

export function ScannerContextProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { setIsLoading } = useGlobalContext();
  const { findFoodByBarcode } = useFoodLookup();
  const isHandlingScanRef = useRef(false);
  const lastScanRef = useRef<{ code: string; at: number } | null>(null);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cooldownMs = 1500;

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  async function handleBarcode(rawCode: string) {
    const code = normalizeBarcode(rawCode);
    const now = Date.now();

    if (!code || isHandlingScanRef.current) return;

    if (lastScanRef.current) {
      const isSameCode = lastScanRef.current.code === code;
      const isWithinCooldown = now - lastScanRef.current.at < cooldownMs;

      if (isSameCode && isWithinCooldown) return;
    }

    isHandlingScanRef.current = true;
    lastScanRef.current = { code, at: now };
    setIsLoading(true);

    try {
      const food = await findFoodByBarcode(code);

      if (food) {
        router.push(`/foods/${food.id}`);
      } else {
        router.push(`/foods/new?barcode=${encodeURIComponent(code)}`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Impossible de vérifier ce code-barres pour l'instant.");
    } finally {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }

      resetTimeoutRef.current = setTimeout(() => {
        isHandlingScanRef.current = false;
      }, cooldownMs);

      setIsLoading(false);
    }
  }

  function handleBarcodeScanned(result: BarcodeScanningResult) {
    handleBarcode(result.data).catch(console.error);
  }

  return (
    <ScannerContext.Provider
      value={{
        handleBarcodeScanned,
      }}
    >
      {children}
    </ScannerContext.Provider>
  );
}
