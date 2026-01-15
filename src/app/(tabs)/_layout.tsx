import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { DynamicIcon } from '../../components/ui/DynamicIcon';

/**
 * Tab Navigator Layout - Floating Island Style
 * Features:
 * - iOS: BlurView glassmorphism background
 * - Android: White background
 * - Floating bar with gap from bottom (matches App.js design)
 */

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'oklch(0.637 0.237 25.331)', // Enterprise red
        tabBarInactiveTintColor: '#94A3B8', // Gray
        tabBarStyle: {
          position: 'absolute',
          bottom: 25, // Float above bottom (App.js spec)
          left: 20,
          right: 20,
          height: 70,
          borderRadius: 30,
          borderTopWidth: 0, // Remove default border
          elevation: 0, // Custom shadow handling
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#FFFFFF',
          paddingBottom: 10,
          paddingTop: 10,
          // Shadow for iOS
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={80}
              tint="light"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 30,
                overflow: 'hidden',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
              }}
            />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <DynamicIcon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Công việc',
          tabBarIcon: ({ color, size }) => (
            <DynamicIcon name="check-square" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <DynamicIcon name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
