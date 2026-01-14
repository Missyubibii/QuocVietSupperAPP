import { getDistance } from "geolib";
import type {
  CheckInPayload,
  CheckInResponse,
  OfficeLocation,
} from "./attendance.types";

/**
 * Attendance Mock Repository
 *
 * Features:
 * - Geofencing validation (200m radius)
 * - Distance calculation using geolib
 * - Image size validation
 * - Network delay simulation
 *
 * Chapter 3.4: Mock-First Implementation
 */

// Office Location (Văn phòng Quốc Việt Super App)
const OFFICE_LOCATION: OfficeLocation = {
  latitude: 18.6796,
  longitude: 105.6813,
  geofence_radius: 200, // meters
  name: "Văn phòng Quốc Việt",
};

const MAX_IMAGE_SIZE_BYTES = 500_000; // 500KB (after compression)

export class AttendanceMockRepository {
  /**
   * Calculate distance between user location and office
   * Using geolib's getDistance function (returns meters)
   */
  private calculateDistance(userLat: number, userLng: number): number {
    const distanceInMeters = getDistance(
      { latitude: userLat, longitude: userLng },
      {
        latitude: OFFICE_LOCATION.latitude,
        longitude: OFFICE_LOCATION.longitude,
      }
    );

    return distanceInMeters;
  }

  /**
   * Mock Check-In
   *
   * Validates:
   * 1. Time drift (anti-fraud)
   * 2. Geofencing (distance <= 200m)
   * 3. Image size (if provided)
   */
  async checkIn(payload: CheckInPayload): Promise<CheckInResponse> {
    // Simulate network delay (1 second)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 1. TIME FRAUD CHECK (Anti-Cheat)
    // In mock: use Date.now() as "server time"
    // In production: server returns server_time, compare with payload.timestamp
    const serverTime = Date.now();
    const clientTime = new Date(payload.timestamp).getTime();
    const timeDriftMs = Math.abs(serverTime - clientTime);
    const MAX_DRIFT_MS = 5 * 60 * 1000; // 5 minutes

    if (timeDriftMs > MAX_DRIFT_MS) {
      throw new Error(
        `TIME_DRIFT:Lệch giờ ${Math.round(timeDriftMs / 1000 / 60)} phút. ` +
          `Vui lòng chỉnh lại ngày giờ hệ thống.`
      );
    }

    // 2. Calculate distance from office
    const distance = this.calculateDistance(
      payload.latitude,
      payload.longitude
    );

    // 3. Image size validation (if photo provided)
    if (payload.photo_base64) {
      // Rough base64 size estimation: length * 0.75
      const estimatedSize = payload.photo_base64.length * 0.75;

      if (estimatedSize > MAX_IMAGE_SIZE_BYTES) {
        throw new Error(
          `IMAGE_TOO_LARGE:Ảnh quá lớn (${Math.round(
            estimatedSize / 1024
          )}KB). Vui lòng giảm chất lượng.`
        );
      }
    }

    // 4. Geofencing validation
    const isWithinGeofence = distance <= OFFICE_LOCATION.geofence_radius;

    if (!isWithinGeofence) {
      throw new Error(
        `OUT_OF_RANGE:Bạn đang cách văn phòng ${Math.round(distance)} mét. ` +
          `Vui lòng đến gần hơn (tối đa ${OFFICE_LOCATION.geofence_radius}m).`
      );
    }

    // Success
    return {
      success: true,
      message: `Chấm công thành công! Bạn đang cách văn phòng ${Math.round(
        distance
      )}m.`,
      distance_from_office: distance,
      check_in_time: new Date().toISOString(),
      is_within_geofence: true,
    };
  }

  /**
   * Mock Check-Out
   * No geofencing required for checkout
   */
  async checkOut(): Promise<CheckInResponse> {
    // Simulate network delay (800ms)
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      success: true,
      message: "Hoàn thành ca làm việc! Hẹn gặp lại bạn vào ngày mai.",
      distance_from_office: 0,
      check_in_time: new Date().toISOString(),
      is_within_geofence: true,
    };
  }

  /**
   * Get office location (for map display)
   */
  getOfficeLocation(): OfficeLocation {
    return OFFICE_LOCATION;
  }

  /**
   * Debug: Simulate different locations (DEV only)
   */
  debugSimulateLocation(preset: "near" | "far" | "office"): {
    lat: number;
    lng: number;
  } {
    switch (preset) {
      case "office":
        return {
          lat: OFFICE_LOCATION.latitude,
          lng: OFFICE_LOCATION.longitude,
        };
      case "near":
        // 185 meters away (within geofence)
        return { lat: 18.6812, lng: 105.6825 };
      case "far":
        // 500 meters away (outside geofence)
        return { lat: 18.6845, lng: 105.685 };
      default:
        return {
          lat: OFFICE_LOCATION.latitude,
          lng: OFFICE_LOCATION.longitude,
        };
    }
  }
}

// Singleton instance
export const attendanceMockRepo = new AttendanceMockRepository();
