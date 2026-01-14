/**
 * Server-Driven UI (SDUI) Type Definitions
 * These types define the contract between server JSON and client UI
 */

// Action types that widgets can trigger
export type Action =
  | {
      type: "NAVIGATE";
      target: string;
      payload?: Record<string, any>;
      url?: string;
    } // Hỗ trợ cả target (mock) và url (legacy)
  | {
      type: "API_CALL";
      endpoint: string;
      method?: "GET" | "POST";
      payload?: any;
    }
  | { type: "OPEN_MODAL"; target: string; payload?: any }
  | { type: "COMING_SOON"; payload?: any } // Action cho tính năng đang phát triển
  | { type: "LINK"; url: string }
  | { type: "NATIVE_SCREEN"; screen: string; params?: Record<string, any> };

// Widget/Block types supported by the SDUI engine
export type WidgetType =
  | "HOME_HEADER" // Khớp với mock
  | "STATS_GRID" // Khớp với mock
  | "LEAD_LIST" // Khớp với mock
  | "QUICK_ACTIONS" // Khớp với mock
  | "HEADER_BANNER"
  | "GRID_MENU"
  | "TASK_LIST"
  | "INFO_CARD";

// Individual widget block structure from server
export interface WidgetBlock {
  id: string;
  type: WidgetType;
  title?: string;
  data: Record<string, any>;
  action?: Action;
  style?: Record<string, any>;
}

// Complete app layout response from server
export interface AppLayoutResponse {
  version: string;
  timestamp: number;
  layout: WidgetBlock[];
  meta?: {
    refreshInterval?: number;
    cachePolicy?: "cache-first" | "network-first";
  };
}

export interface HeaderBannerData {
  userName?: string; // Thay vì title
  userAvatar?: string;
  notificationCount?: number;
  notificationAction?: any;
  title?: string; // Giữ lại nếu cần backward compatibility
  bg_color?: string;
}
