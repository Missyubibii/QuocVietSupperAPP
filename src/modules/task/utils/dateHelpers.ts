import { format, formatDistanceToNow, isPast } from "date-fns";
import { vi } from "date-fns/locale";

/**
 * Date formatting utilities
 * Uses date-fns for consistent Vietnamese locale formatting
 */

/**
 * Format ISO date string to dd/MM/yyyy (Vietnamese format)
 */
export const formatDate = (isoString: string): string => {
  try {
    return format(new Date(isoString), "dd/MM/yyyy", { locale: vi });
  } catch {
    return "Invalid date";
  }
};

/**
 * Format ISO date string to short format with time
 */
export const formatDateTime = (isoString: string): string => {
  try {
    return format(new Date(isoString), "dd/MM/yyyy HH:mm", { locale: vi });
  } catch {
    return "Invalid date";
  }
};

/**
 * Format ISO date string to relative time
 * Example: "2 ngày trước", "trong 3 ngày"
 */
export const formatRelativeDate = (isoString: string): string => {
  try {
    return formatDistanceToNow(new Date(isoString), {
      addSuffix: true,
      locale: vi,
    });
  } catch {
    return "Invalid date";
  }
};

/**
 * Check if task is overdue
 */
export const isOverdue = (dueDateIso: string, status: string): boolean => {
  if (status === "DONE") return false;
  try {
    return isPast(new Date(dueDateIso));
  } catch {
    return false;
  }
};

/**
 * Get color class for due date display
 */
export const getDueDateColor = (dueDateIso: string, status: string): string => {
  if (status === "DONE") return "text-slate-500";
  return isOverdue(dueDateIso, status) ? "text-red-600" : "text-slate-600";
};

/**
 * Get short day name (e.g., "T2", "T3")
 */
export const getShortDay = (isoString: string): string => {
  try {
    return format(new Date(isoString), "EEEEEE", { locale: vi });
  } catch {
    return "";
  }
};
