import { useEffect } from "react";
import * as Device from "expo-device";
import { useLogStore } from "../logger/store";

/**
 * System Check Hook
 * Runs once on app startup to detect hardware capabilities
 * Logs warnings for simulator or missing native modules
 */

export function useSystemCheck() {
  useEffect(() => {
    (async () => {
      const { addLog } = useLogStore.getState();

      // Check if running on real device or simulator
      const isRealDevice = Device.isDevice;

      if (!isRealDevice) {
        addLog("SYSTEM", "Running on Simulator/Emulator", {
          deviceType: Device.deviceType,
          deviceName: Device.deviceName || "Unknown",
          osName: Device.osName,
          osVersion: Device.osVersion,
          warning: "Some features (biometric, camera) may not work",
        });
      } else {
        addLog("SYSTEM", "Running on Real Device", {
          deviceType: Device.deviceType,
          deviceName: Device.deviceName || "Unknown",
          brand: Device.brand || "Unknown",
          modelName: Device.modelName || "Unknown",
          osName: Device.osName,
          osVersion: Device.osVersion,
        });
      }

      // Check native module availability
      try {
        const LocalAuth = await import("expo-local-authentication");
        const hasHardware = await LocalAuth.hasHardwareAsync();

        addLog("SYSTEM", "Biometric Hardware Check", {
          available: hasHardware,
          module: "expo-local-authentication",
          status: hasHardware ? "OK" : "Not Available",
        });
      } catch (error) {
        addLog("SYSTEM", "Biometric Module Missing", {
          module: "expo-local-authentication",
          error: (error as Error).message,
          impact: "Biometric login disabled",
        });
      }

      // Check secure storage availability
      try {
        await import("expo-secure-store");
        addLog("SYSTEM", "Secure Storage Module Check", {
          module: "expo-secure-store",
          status: "OK",
        });
      } catch (error) {
        addLog("SYSTEM", "Secure Storage Module Missing", {
          module: "expo-secure-store",
          error: (error as Error).message,
          impact: "CRITICAL - Auth tokens cannot be stored securely",
        });
      }
    })();
  }, []); // Run once on mount
}
