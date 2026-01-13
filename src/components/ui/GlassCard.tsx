import React from 'react';
import { View, Pressable, type ViewProps, type PressableProps } from 'react-native';

/**
 * GlassCard Component - Glassmorphism design
 * Features: Semi-transparent background, backdrop blur, subtle border
 */

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  pressable?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  onPress,
  pressable = false,
  ...props
}) => {
  const glassStyles = `bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl shadow-lg ${className}`;

  if (pressable || onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={`${glassStyles} active:opacity-80`}
        {...(props as PressableProps)}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View className={glassStyles} {...props}>
      {children}
    </View>
  );
};
