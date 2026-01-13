import React from 'react';
import { View, Pressable, Platform, type ViewStyle, type ViewProps, type PressableProps } from 'react-native';

/**
 * GlassCard Component - Glassmorphism design (Production Ready)
 * Features:
 * - iOS: Backdrop blur (real glassmorphism)
 * - Android: Higher opacity + elevation shadow
 * - Pressable support with active animation
 * - Cross-platform shadow handling
 */

interface GlassCardProps extends Omit<ViewProps, 'style'> {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  style,
  onPress,
  disabled = false,
  ...props
}) => {
  // Cross-platform glass effect
  const glassClassName = Platform.select({
    ios: `bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl ${className}`,
    android: `bg-white/95 border border-white/50 rounded-2xl ${className}`,
    default: `bg-white/80 border border-white/60 rounded-2xl ${className}`,
  });

  // Android shadow style (elevation doesn't work with className)
  const androidShadow: ViewStyle =
    Platform.OS === 'android'
      ? {
          elevation: 3,
          shadowColor: '#000',
        }
      : {};

  const combinedStyle: ViewStyle = {
    ...androidShadow,
    ...style,
  };

  // Return Pressable if onPress provided
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        className={`${glassClassName} ${disabled ? 'opacity-50' : 'active:opacity-90 active:scale-[0.98]'}`}
        style={combinedStyle}
        {...(props as PressableProps)}
      >
        {children}
      </Pressable>
    );
  }

  // Return View otherwise
  return (
    <View className={glassClassName} style={combinedStyle} {...props}>
      {children}
    </View>
  );
};
