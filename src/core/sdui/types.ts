/**
 * Server-Driven UI (SDUI) Type Definitions
 * These types define the contract between server JSON and client UI
 */

// Action types that widgets can trigger
export type AppAction =
  | { type: 'NATIVE_SCREEN'; screen: string; params?: Record<string, any> }
  | { type: 'LINK'; url: string }
  | { type: 'API_CALL'; endpoint: string; method?: 'GET' | 'POST' };

// Widget/Block types supported by the SDUI engine
export type WidgetType =
  | 'HEADER_BANNER'
  | 'GRID_MENU'
  | 'TASK_LIST'
  | 'QUICK_ACTIONS'
  | 'INFO_CARD';

// Individual widget block structure from server
export interface WidgetBlock {
  id: string;
  type: WidgetType;
  title?: string;
  data: Record<string, any>; // Widget-specific data
  action?: AppAction;
  style?: Record<string, any>; // Optional styling overrides
}

// Complete app layout response from server
export interface AppLayoutResponse {
  version: string;
  timestamp: number;
  layout: WidgetBlock[];
  meta?: {
    refreshInterval?: number;
    cachePolicy?: 'cache-first' | 'network-first';
  };
}
