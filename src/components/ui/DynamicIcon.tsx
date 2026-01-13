import React from 'react';
import {
  Home, User, Settings, Bell, Calendar,
  CheckCircle, AlertCircle, Menu, Search,
  ChevronRight, X, Plus, Minus, Camera,
  MapPin, Clock, File, Download, Upload,
  Eye, EyeOff, LogOut, Lock, Unlock,
  type LucideIcon,
} from 'lucide-react-native';

/**
 * DynamicIcon Component - Safe icon mapping for SDUI
 * Uses explicit whitelist to prevent crashes from invalid Lucide exports
 */

// Safe icon registry - only verified components
const ICON_MAP: Record<string, LucideIcon> = {
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
