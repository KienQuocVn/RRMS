import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateStorage } from 'zustand/middleware';

import { Platform } from 'react-native';

const memoryStorage = new Map<string, string>();

let hasWarnedStorageFallback = false;

function warnStorageFallback(error: unknown) {
  if (hasWarnedStorageFallback) {
    return;
  }

  hasWarnedStorageFallback = true;
  console.warn('[Storage] AsyncStorage unavailable, falling back to in-memory storage.', error);
}

const isServer = Platform.OS === 'web' && typeof window === 'undefined';

async function runWithFallback<T>(
  action: () => Promise<T>,
  fallback: () => T,
): Promise<T> {
  if (isServer) {
    return fallback();
  }
  try {
    return await action();
  } catch (error) {
    warnStorageFallback(error);
    return fallback();
  }
}

export const safeAsyncStorage = {
  setItem: async (key: string, value: string) =>
    runWithFallback(
      () => AsyncStorage.setItem(key, value),
      () => {
        memoryStorage.set(key, value);
      },
    ),

  getItem: async (key: string) =>
    runWithFallback(
      () => AsyncStorage.getItem(key),
      () => memoryStorage.get(key) ?? null,
    ),

  removeItem: async (key: string) =>
    runWithFallback(
      () => AsyncStorage.removeItem(key),
      () => {
        memoryStorage.delete(key);
      },
    ),
};

export const zustandSafeStorage: StateStorage = {
  getItem: async (name) => safeAsyncStorage.getItem(name),
  setItem: async (name, value) => {
    await safeAsyncStorage.setItem(name, value);
  },
  removeItem: async (name) => {
    await safeAsyncStorage.removeItem(name);
  },
};
