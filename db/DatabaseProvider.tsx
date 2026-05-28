import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import * as SQLite from 'expo-sqlite';
import React, { createContext, useContext, ReactNode } from 'react';
import { Alert } from 'react-native';

import { useGlobalContext } from '@/components/GlobalProvider';

import migrations from '../drizzle/migrations';

import * as schema from './schema';

const expoDb = SQLite.openDatabaseSync('db.db');
const db = drizzle(expoDb, { schema });

type DatabaseContextType = ExpoSQLiteDatabase<typeof schema>;

const DatabaseContext = createContext<DatabaseContextType | null>(null);

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}

interface DatabaseProviderProps {
  children: ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const { setIsLoading } = useGlobalContext();
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    Alert.alert('Une erreur est survenue');
    return null;
  }

  if (!success) {
    setIsLoading(true);
  }

  setIsLoading(false);

  return <DatabaseContext.Provider value={db}>{children}</DatabaseContext.Provider>;
}
