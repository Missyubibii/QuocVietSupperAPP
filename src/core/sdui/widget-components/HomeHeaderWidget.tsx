import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DynamicIcon } from '../../../components/ui/DynamicIcon';
import { useActionHandler, type AppAction } from '../../hooks/useActionHandler';
import { useAuthStore } from '../../../modules/auth/store';

/**
 * HomeHeaderWidget - Top header with user info and notifications
 * Features:
 * - Safe Area padding (dynamic for notch/island)
 * - Uses authenticated user data if available
 * - Touch target compliance (44x44pt with hitSlop)
 */

interface HomeHeaderWidgetProps {
  data: {
    userName?: string;
    userAvatar?: string;
    notificationCount?: number;
    notificationAction?: AppAction;
  };
}

export function HomeHeaderWidget({ data }: HomeHeaderWidgetProps) {
  const insets = useSafeAreaInsets();
  const { handleAction } = useActionHandler();
  const { user } = useAuthStore(); // Get authenticated user

  // Use authenticated user data if available, otherwise fall back to props
  const displayName = user?.name || data.userName || 'User';
  const displayAvatar = user?.avatar || data.userAvatar || 'https://via.placeholder.com/100';

  return (
    <View
      style={{ paddingTop: insets.top + 12 }}
      className="px-5 pb-3 flex-row justify-between items-center bg-white/60 backdrop-blur-md border-b border-white/50"
    >
      {/* User Info Section */}
      <View className="flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-white shadow-sm">
          <Image
            source={{ uri: displayAvatar }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={200}
          />
        </View>
        <View>
          <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            Xin chào
          </Text>
          <Text className="text-lg font-extrabold text-slate-800 leading-none">
            {displayName}
          </Text>
        </View>
      </View>

      {/* Notification Button */}
      <TouchableOpacity
        onPress={() => handleAction(data.notificationAction)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Apple HIG compliance
        className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 items-center justify-center active:opacity-70"
      >
        <DynamicIcon name="bell" size={20} color="#475569" strokeWidth={2.5} />
        {data.notificationCount && data.notificationCount > 0 && (
          <View className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white animate-pulse" />
        )}
      </TouchableOpacity>
    </View>
  );
}
