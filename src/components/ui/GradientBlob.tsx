import React from 'react';
import { View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * GradientBlob - Android-safe background blob
 * Replaces CSS blur-[80px] which causes severe lag on Android
 * 
 * Options:
 * - iOS: Can use more complex gradients
 * - Android: Uses simple LinearGradient for 60fps
 */

interface GradientBlobProps {
  color?: 'blue' | 'purple' | 'pink' | 'orange';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number;
}

export const GradientBlob: React.FC<GradientBlobProps> = ({
  color = 'blue',
  position = 'top-left',
  size = 400,
}) => {
  // Color mapping to RGBA
  const colors: Record<string, string[]> = {
    blue: ['rgba(96, 165, 250, 0.15)', 'rgba(96, 165, 250, 0.05)', 'transparent'],
    purple: ['rgba(168, 85, 247, 0.15)', 'rgba(168, 85, 247, 0.05)', 'transparent'],
    pink: ['rgba(236, 72, 153, 0.15)', 'rgba(236, 72, 153, 0.05)', 'transparent'],
    orange: ['rgba(251, 146, 60, 0.15)', 'rgba(251, 146, 60, 0.05)', 'transparent'],
  };

  // Position mapping
  const positions: Record<string, { top?: string | number; bottom?: string | number; left?: string | number; right?: string | number }> = {
    'top-left': { top: '-10%', left: '-10%' },
    'top-right': { top: '-10%', right: '-10%' },
    'bottom-left': { bottom: '-10%', left: '-10%' },
    'bottom-right': { bottom: '-10%', right: '-10%' },
  };

  const positionStyle = positions[position];

  return (
    <View
      style={{
        position: 'absolute',
        ...positionStyle,
        width: size,
        height: size,
        pointerEvents: 'none',
      }}
    >
      <LinearGradient
        colors={colors[color]}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: size / 2,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </View>
  );
};
