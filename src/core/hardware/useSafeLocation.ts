import { useState, useEffect } from "react";
import * as Location from "expo-location";
import * as Device from "expo-device";

/**
 * Safe Location Hook - Hardware Fallback for Antigravity/Simulator
 *
 * Features:
 * - Real GPS on physical devices
 * - Mock coordinates on simulator/Antigravity
 * - 5-second timeout to prevent infinite loading
 * - Permission handling
 *
 * Zero-Config Bug Compliance: Never crashes, always returns data
 */

interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface LocationResult {
  coords: LocationCoords | null;
  is_mock: boolean;
  error?: string;
  loading: boolean;
}

// Office location (Mock coordinates for Văn phòng Quốc Việt)
const MOCK_OFFICE_COORDS: LocationCoords = {
  latitude: 18.6796,
  longitude: 105.6813,
  accuracy: 10,
};

export function useSafeLocation(): LocationResult {
  const [location, setLocation] = useState<LocationResult>({
    coords: null,
    is_mock: false,
    loading: true,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let cancelled = false;

    const getLocation = async () => {
      try {
        // Check if running on real device
        if (!Device.isDevice) {
          // SIMULATOR MODE: Return mock coordinates immediately
          if (!cancelled) {
            setLocation({
              coords: MOCK_OFFICE_COORDS,
              is_mock: true,
              loading: false,
            });
          }
          return;
        }

        // Request permissions
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          // Permission denied: Fallback to mock
          if (!cancelled) {
            setLocation({
              coords: MOCK_OFFICE_COORDS,
              is_mock: true,
              error: "PERMISSION_DENIED",
              loading: false,
            });
          }
          return;
        }

        // Set timeout to prevent infinite loading (5 seconds)
        timeoutId = setTimeout(() => {
          if (!cancelled) {
            setLocation({
              coords: {
                ...MOCK_OFFICE_COORDS,
                accuracy: 999, // High accuracy = unreliable/timeout
              },
              is_mock: true,
              error: "TIMEOUT",
              loading: false,
            });
          }
        }, 5000);

        // Get real location
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        // Clear timeout if location retrieved successfully
        if (timeoutId) clearTimeout(timeoutId);

        if (!cancelled) {
          setLocation({
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy || 0,
            },
            is_mock: false,
            loading: false,
          });
        }
      } catch (error) {
        // Clear timeout on error
        if (timeoutId) clearTimeout(timeoutId);

        // Fallback to mock on any error
        if (!cancelled) {
          setLocation({
            coords: {
              ...MOCK_OFFICE_COORDS,
              accuracy: 999,
            },
            is_mock: true,
            error: "LOCATION_ERROR",
            loading: false,
          });
        }

        if (__DEV__) {
          console.warn("[useSafeLocation] Error:", error);
        }
      }
    };

    getLocation();

    // Cleanup
    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return location;
}
