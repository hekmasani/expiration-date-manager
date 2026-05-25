import React, { createContext, ReactNode, useContext, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

type GlobalContextValue = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const GlobalContext = createContext<GlobalContextValue | null>(null);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <GlobalContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading ? (
        <View className="flex-1 items-center justify-center bg-slate-50">
          <ActivityIndicator size="large" color="#059669" />
        </View>
      ) : (
        children
      )}
    </GlobalContext.Provider>
  );
}

export function useGlobalLoading() {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error('useGlobalLoading must be used within a GlobalProvider');
  }

  return context;
}
