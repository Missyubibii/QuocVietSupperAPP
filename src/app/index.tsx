import React from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { GlassCard } from '../components/ui/GlassCard';
import { DynamicIcon } from '../components/ui/DynamicIcon';
import { LayoutEngine } from '../core/sdui/LayoutEngine';
import { useAuthStore } from '../modules/auth/store';
import type { WidgetBlock } from '../core/sdui/types';

// Mock SDUI layout for testing
const mockLayout: WidgetBlock[] = [
  {
    id: '1',
    type: 'HEADER_BANNER',
    title: 'QUỐC VIỆT SUPER APP',
    data: {
      subtitle: 'Server-Driven UI Engine - Chapter 2: Authentication',
    },
  },
  {
    id: '2',
    type: 'GRID_MENU',
    title: 'Quick Actions',
    data: {
      items: [
        { label: 'Attendance', icon: 'calendar' },
        { label: 'Tasks', icon: 'check-circle' },
        { label: 'Requests', icon: 'file' },
        { label: 'Profile', icon: 'user' },
      ],
    },
  },
  {
    id: '3',
    type: 'INFO_CARD',
    title: '✅ Chapter 2 Complete',
    data: {
      message: 'Authentication module with login, biometric support, token refresh, and protected routing is ready!',
    },
  },
];

export default function IndexScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [tapCount, setTapCount] = React.useState(0);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  // Secret trigger: 5 taps on avatar/name to open debug screen
  const handleSecretTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);

    if (newCount >= 5) {
      setTapCount(0);
      router.push('/debug');
    } else {
      // Reset counter after 2 seconds of no taps
      setTimeout(() => setTapCount(0), 2000);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-50 to-purple-50">
      <StatusBar barStyle="dark-content" />
      
      <ScrollView className="flex-1 px-4">
        {/* User Profile Section */}
        {user && (
          <GlassCard className="p-4 mt-4 mb-2">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={handleSecretTap}
                className="flex-row items-center flex-1"
                activeOpacity={0.7}
              >
                <View className="w-12 h-12 bg-purple-200 rounded-full items-center justify-center">
                  <DynamicIcon name="user" size={24} color="#8B5CF6" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-gray-800 font-semibold">{user.name}</Text>
                  <Text className="text-gray-600 text-sm">{user.position}</Text>
                  {/* Dev-only tap counter */}
                  {__DEV__ && tapCount > 0 && (
                    <Text className="text-orange-500 text-xs mt-1">
                      🔓 Tap {5 - tapCount} more times to access debug
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogout}
                className="bg-red-500 px-4 py-2 rounded-lg"
              >
                <View className="flex-row items-center">
                  <DynamicIcon name="log-out" size={16} color="#FFF" />
                  <Text className="text-white font-semibold ml-1">Logout</Text>
                </View>
              </TouchableOpacity>
            </View>
          </GlassCard>
        )}

        {/* App Title */}
        <View className="mb-4 mt-2">
          <View className="flex-row items-center justify-center mb-2">
            <DynamicIcon name="home" size={32} color="#8B5CF6" />
            <Text className="text-3xl font-bold ml-3 text-purple-600">
              QUỐC VIỆT
            </Text>
          </View>
          <Text className="text-center text-gray-600">
            Chapter 2: Authentication Complete
          </Text>
        </View>

        {/* SDUI Layout Engine Demo */}
        <LayoutEngine layout={mockLayout} />

        {/* Feature Showcase */}
        <View className="mt-6 mb-12">
          <GlassCard className="p-6">
            <View className="flex-row items-center mb-3">
              <DynamicIcon name="check-circle" size={24} color="#10B981" />
              <Text className="text-lg font-semibold ml-2">Implemented Features</Text>
            </View>

            <View className="space-y-2">
              {[
                '✅ Chapter 1: Foundation Complete',
                '✅ Chapter 2: Authentication Module',
                '✅ Mock Login (password: 123456)',
                '✅ Token Auto-Refresh (401 handling)',
                '✅ Biometric Login (Hardware Guard)',
                '✅ Protected Routing',
                '✅ State Hydration from Storage',
                '✅ Zustand Auth Store',
                '🚫 NO react-native-mmkv (Safe!)',
              ].map((feature, index) => (
                <Text key={index} className="text-gray-700 text-sm">
                  {feature}
                </Text>
              ))}
            </View>
          </GlassCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
