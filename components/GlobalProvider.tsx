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
      <View className="flex-1">
        {children}
        {isLoading ? (
          <View className="absolute inset-0 items-center justify-center bg-slate-50/60">
            <ActivityIndicator size="large" color="#059669" />
          </View>
        ) : null}
      </View>
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error('useGlobalLoading must be used within a GlobalProvider');
  }

  return context;
}
