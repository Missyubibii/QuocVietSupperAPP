import { create } from "zustand";
import type { LogEntry, LogType } from "./types";

/**
 * Logger Store (Zustand)
 * Chapter 8: Full implementation with FIFO logic
 *
 * CRITICAL: Limited to 50 logs max to prevent RAM overflow on:
 * - Antigravity (Cloud IDE environment)
 * - Low-end Android devices
 */

interface LogStore {
  logs: LogEntry[];
  addLog: (type: LogType, title: string, details?: any) => void;
  clearLogs: () => void;
  getLogsAsString: () => string;
}

const MAX_LOGS = 50; // FIFO limit

export const useLogStore = create<LogStore>((set, get) => ({
  logs: [],

  /**
   * Add new log entry
   * Inserts at the beginning (newest first)
   * Enforces FIFO: removes oldest when > MAX_LOGS
   */
  addLog: (type, title, details) => {
    const entry: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      type,
      title,
      details: details || {},
      is_error: type.includes("ERR") || type === "UI_CRASH",
    };

    set((state) => {
      // Add new log at beginning (newest first)
      const newLogs = [entry, ...state.logs];

      // FIFO: Keep only last MAX_LOGS items
      if (newLogs.length > MAX_LOGS) {
        return { logs: newLogs.slice(0, MAX_LOGS) };
      }

      return { logs: newLogs };
    });

    // Console log in dev mode for immediate feedback
    if (__DEV__) {
      const emoji = entry.is_error ? "❌" : "✅";
      console.log(`${emoji} [${type}] ${title}`, details);
    }
  },

  /**
   * Clear all logs
   */
  clearLogs: () => {
    set({ logs: [] });
    if (__DEV__) {
      console.log("🗑️ All logs cleared");
    }
  },

  /**
   * Export all logs as formatted string
   * Used for copy to clipboard
   */
  getLogsAsString: () => {
    const { logs } = get();

    if (logs.length === 0) {
      return "No logs available";
    }

    return logs
      .map((log) => {
        const date = new Date(log.timestamp);
        const time = date.toLocaleTimeString("vi-VN");
        const details =
          typeof log.details === "string"
            ? log.details
            : JSON.stringify(log.details, null, 2);

        return `[${time}] [${log.type}] ${log.title}\n${details}\n---`;
      })
      .join("\n\n");
  },
}));
