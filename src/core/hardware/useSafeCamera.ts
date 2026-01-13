import { useState, useEffect } from "react";
import { Camera } from "expo-camera";
import * as Device from "expo-device";
import { Linking } from "react-native";

/**
 * Safe Camera Hook - Hardware Fallback for Antigravity/Simulator
 *
 * Features:
 * - Real camera on physical devices
 * - Mock mode on simulator
 * - Permission handling with settings redirect
 * - Device detection
 *
 * Zero-Config Bug Compliance: Never crashes, always provides fallback
 */

interface CameraResult {
  hasPermission: boolean;
  permissionDenied: boolean;
  isSimulator: boolean;
  requestPermission: () => Promise<void>;
  openSettings: () => void;
}

export function useSafeCamera(): CameraResult {
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const isSimulator = !Device.isDevice;

  const requestPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      setPermissionDenied(status === "denied");

      if (__DEV__) {
        console.log("[useSafeCamera] Permission status:", status);
      }
    } catch (error) {
      if (__DEV__) {
        console.warn("[useSafeCamera] Permission error:", error);
      }
      setHasPermission(false);
      setPermissionDenied(false);
    }
  };

  const openSettings = () => {
    try {
      Linking.openSettings();
    } catch (error) {
      if (__DEV__) {
        console.warn("[useSafeCamera] Failed to open settings:", error);
      }
    }
  };

  useEffect(() => {
    // Auto-request permission on mount
    requestPermission();
  }, []);

  return {
    hasPermission,
    permissionDenied,
    isSimulator,
    requestPermission,
    openSettings,
  };
}
