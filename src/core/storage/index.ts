import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Hybrid Storage Facade
 * Automatically routes sensitive data to SecureStore and general data to AsyncStorage
 * This replaces react-native-mmkv which crashes on Expo Go/Antigravity
 */

// ===== SECURE STORAGE (for tokens, passwords, biometric keys) =====

export async function saveSecure(key: string, value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error(`[Storage] Failed to save secure item "${key}":`, error);
    throw new Error(`Failed to save secure data: ${key}`);
  }
}

export async function getSecure(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`[Storage] Failed to get secure item "${key}":`, error);
    return null;
  }
}

export async function deleteSecure(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(`[Storage] Failed to delete secure item "${key}":`, error);
  }
}

// ===== GENERAL STORAGE (for preferences, cache, non-sensitive data) =====

export async function saveGeneral(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(`[Storage] Failed to save general item "${key}":`, error);
    throw new Error(`Failed to save general data: ${key}`);
  }
}

export async function getGeneral(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error(`[Storage] Failed to get general item "${key}":`, error);
    return null;
  }
}

export async function deleteGeneral(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`[Storage] Failed to delete general item "${key}":`, error);
  }
}

// ===== OBJECT STORAGE HELPERS =====

export async function saveSecureObject<T>(
  key: string,
  value: T
): Promise<void> {
  await saveSecure(key, JSON.stringify(value));
}

export async function getSecureObject<T>(key: string): Promise<T | null> {
  const data = await getSecure(key);
  if (!data) return null;

  try {
    return JSON.parse(data) as T;
  } catch {
    console.error(`[Storage] Failed to parse secure object "${key}"`);
    return null;
  }
}

export async function saveGeneralObject<T>(
  key: string,
  value: T
): Promise<void> {
  await saveGeneral(key, JSON.stringify(value));
}

export async function getGeneralObject<T>(key: string): Promise<T | null> {
  const data = await getGeneral(key);
  if (!data) return null;

  try {
    return JSON.parse(data) as T;
  } catch {
    console.error(`[Storage] Failed to parse general object "${key}"`);
    return null;
  }
}

// ===== UTILITY =====

export async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.clear();
    console.log("[Storage] Cleared all general storage");
  } catch (error) {
    console.error("[Storage] Failed to clear storage:", error);
  }
}
