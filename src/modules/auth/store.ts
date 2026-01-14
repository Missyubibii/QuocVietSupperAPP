import { create } from "zustand";
import type { User } from "./auth.types";
import {
  getSecure,
  saveSecure,
  getGeneral,
  saveGeneral,
} from "../../core/storage";
import { authMockRepo } from "./auth.mock";

/**
 * Authentication Store (Zustand)
 * Manages auth state with hydration from secure storage
 */

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isBiometricEnabled: boolean;
  isHydrated: boolean;

  // Actions
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  enableBiometric: (enabled: boolean) => Promise<void>;
  loadBiometricPreference: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isBiometricEnabled: false,
  isHydrated: false,

  /**
   * Login action
   * Saves tokens to SecureStore, user data to AsyncStorage
   */
  login: async (username, password) => {
    try {
      const response = await authMockRepo.login(username, password);

      // Save tokens to secure storage (from Chapter 1 Hybrid Storage)
      await saveSecure("access_token", response.access_token);
      await saveSecure("refresh_token", response.refresh_token);

      // Save user info to general storage
      await saveGeneral("user_info", JSON.stringify(response.user_info));

      set({
        user: response.user_info,
        isAuthenticated: true,
      });
    } catch (error) {
      // Re-throw for UI to handle
      throw error;
    }
  },

  /**
   * Logout action
   * Clears all stored data
   */
  logout: async () => {
    await saveSecure("access_token", "");
    await saveSecure("refresh_token", "");
    await saveGeneral("user_info", "");

    set({
      user: null,
      isAuthenticated: false,
    });
  },

  /**
   * Hydrate action
   * Called on app startup to restore auth state from storage
   * CRITICAL: Prevents routing flicker by setting isHydrated flag
   */
  hydrate: async () => {
    try {
      const token = await getSecure("access_token");
      const userStr = await getGeneral("user_info");

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr) as User;
          set({
            user,
            isAuthenticated: true,
            isHydrated: true,
          });
        } catch (parseError) {
          // Invalid JSON, clear state
          console.error("[Auth] Failed to parse user_info:", parseError);
          set({ isHydrated: true });
        }
      } else {
        set({ isHydrated: true });
      }
    } catch (error) {
      console.error("[Auth] Hydration error:", error);
      set({ isHydrated: true });
    }
  },

  /**
   * Enable/disable biometric and persist to storage
   */
  enableBiometric: async (enabled) => {
    set({ isBiometricEnabled: enabled });
    await saveGeneral("biometric_enabled", enabled ? "true" : "false");
  },

  /**
   * Load biometric preference from storage
   * Called during hydration
   */
  loadBiometricPreference: async () => {
    try {
      const pref = await getGeneral("biometric_enabled");
      if (pref === "true") {
        set({ isBiometricEnabled: true });
      }
    } catch (error) {
      console.error("[Auth] Failed to load biometric preference:", error);
    }
  },
}));
