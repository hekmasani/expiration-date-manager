import { BarcodeType, CameraView } from 'expo-camera';
import { StyleSheet, View } from 'react-native';

import { useScannerContextProvider } from '../provider';

const BARCODE_TYPES: BarcodeType[] = [
  'ean13',
  'ean8',
  'upc_a',
  'upc_e',
  'code128',
  'code39',
  'code93',
  'itf14',
  'codabar',
  'datamatrix',
  'qr',
];

export function Scanner() {
  const { handleBarcodeScanned } = useScannerContextProvider();

  return (
    <View className="flex-1 bg-slate-950">
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: BARCODE_TYPES }}
        onBarcodeScanned={handleBarcodeScanned}
        onMountError={(event) => console.error(event.message)}
      />
    </View>
  );
}
