import React from 'react';
import {
  Home, User, Settings, Bell, Calendar,
  CheckCircle, AlertCircle, Menu, Search,
  ChevronRight, X, Plus, Minus, Camera,
  MapPin, Clock, File, Download, Upload,
  Eye, EyeOff, LogOut, Lock, Unlock,
  // Chapter 9 - Additional icons from App.js
  Hexagon, Zap, BarChart3, PieChart, Box,
  ScanLine, UserPlus, FileBarChart, CalendarDays,
  CheckCircle2, Save, Phone, MessageSquare,
  Activity, FileText, TrendingUp,
  type LucideIcon,
} from 'lucide-react-native';

/**
 * DynamicIcon Component - Safe icon mapping for SDUI
 * Uses explicit whitelist to prevent crashes from invalid Lucide exports
 * Updated for Chapter 9 with App.js icons
 */

// Safe icon registry - only verified components
const ICON_MAP: Record<string, LucideIcon> = {
  // Chapter 1 - Basic icons
  home: Home,
  user: User,
  settings: Settings,
  bell: Bell,
  calendar: Calendar,
  'check-circle': CheckCircle,
  'alert-circle': AlertCircle,
  menu: Menu,
  search: Search,
  'chevron-right': ChevronRight,
  x: X,
  plus: Plus,
  minus: Minus,
  camera: Camera,
  'map-pin': MapPin,
  clock: Clock,
  file: File,
  download: Download,
  upload: Upload,
  eye: Eye,
  'eye-off': EyeOff,
  'log-out': LogOut,
  lock: Lock,
  unlock: Unlock,
  
  // Chapter 9 - Home screen icons
  hexagon: Hexagon,
  zap: Zap,
  'bar-chart-3': BarChart3,
  'pie-chart': PieChart,
  box: Box,
  'scan-line': ScanLine,
  'user-plus': UserPlus,
  'file-bar-chart': FileBarChart,
  'calendar-days': CalendarDays,
  'check-circle-2': CheckCircle2,
  save: Save,
  phone: Phone,
  'message-square': MessageSquare,
  activity: Activity,
  'file-text': FileText,
  'trending-up': TrendingUp,
};

interface DynamicIconProps {
  name: keyof typeof ICON_MAP; // Only whitelisted icons
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  size = 24,
  color = '#000',
  strokeWidth = 2,
}) => {
  const IconComponent = ICON_MAP[name] || AlertCircle; // Fallback to alert icon
  
  return <IconComponent size={size} color={color} strokeWidth={strokeWidth} />;
};

// Export icon names for autocomplete
export type IconName = keyof typeof ICON_MAP;
