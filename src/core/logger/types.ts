/**
 * Logger Type Definitions
 * Chapter 8: In-App Debugger System
 */

// Log type categories
export type LogType =
  | "API_REQ" // API Request
  | "API_RES" // API Response (Success)
  | "API_ERR" // API Error (4xx, 5xx, Network)
  | "ZOD_ERR" // Zod Validation Error
  | "UI_CRASH" // React Rendering Crash
  | "SYSTEM"; // System/Hardware checks

// Individual log entry structure
export interface LogEntry {
  id: string;
  timestamp: number; // Unix timestamp (milliseconds)
  type: LogType;
  title: string; // Short description
  details: Record<string, any> | string; // Full data (can be object or string)
  is_error: boolean; // Quick flag for error filtering
}

/**
 * Safe JSON stringify helper
 * Handles circular references and converts to readable string
 */
export function safeStringify(obj: any, indent: number = 2): string {
  try {
    // Handle primitive types
    if (typeof obj !== "object" || obj === null) {
      return String(obj);
    }

    // Handle circular references with replacer function
    const seen = new WeakSet();
    return JSON.stringify(
      obj,
      (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return "[Circular Reference]";
          }
          seen.add(value);
        }
        return value;
      },
      indent
    );
  } catch (error) {
    return `[Stringify Error]: ${(error as Error).message}`;
  }
}
