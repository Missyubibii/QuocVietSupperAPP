import React from 'react';
import {
  View,
  Modal,
  Pressable,
  type ModalProps,
} from 'react-native';
import { GlassCard } from './GlassCard';

/**
 * BottomSheet Component
 * Animated modal that slides up from bottom
 * Uses glassmorphism design with backdrop blur
 */

interface BottomSheetProps extends Partial<ModalProps> {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: string[]; // e.g., ['25%', '50%', '90%']
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  children,
  animationType = 'slide',
  transparent = true,
  ...props
}) => {
  return (
    <Modal
      visible={visible}
      animationType={animationType}
      transparent={transparent}
      onRequestClose={onClose}
      {...props}
    >
      {/* Backdrop */}
      <Pressable
        className="flex-1 bg-black/50"
        onPress={onClose}
      >
        {/* Sheet Container */}
        <View className="flex-1 justify-end">
          <Pressable onPress={(e) => e.stopPropagation()}>
            <GlassCard className="rounded-t-3xl rounded-b-none p-6 min-h-[200px] max-h-[90%]">
              {/* Handle bar */}
              <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-4" />
              
              {/* Content */}
              {children}
            </GlassCard>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};
