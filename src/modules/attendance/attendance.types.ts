import { z } from "zod";

/**
 * Attendance Module Types
 * Chapter 3: Check-In/Check-Out with Geofencing
 */

// Check-In Payload Schema
export const CheckInPayloadSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  photo_base64: z.string().optional(),
  is_mock: z.boolean().default(false),
  timestamp: z.string(),
});

export type CheckInPayload = z.infer<typeof CheckInPayloadSchema>;

// Check-In Response Schema
export const CheckInResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  distance_from_office: z.number(),
  check_in_time: z.string(),
  is_within_geofence: z.boolean(),
});

export type CheckInResponse = z.infer<typeof CheckInResponseSchema>;

// Attendance Record
export interface AttendanceRecord {
  id: number;
  user_id: number;
  check_in_time: string;
  check_out_time?: string;
  latitude: number;
  longitude: number;
  distance: number;
  photo_url?: string;
  is_mock: boolean;
  status: "checked_in" | "checked_out";
}

// Office Location Configuration
export interface OfficeLocation {
  latitude: number;
  longitude: number;
  geofence_radius: number; // meters
  name: string;
}
