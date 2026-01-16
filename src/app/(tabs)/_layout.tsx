import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import { Home, CheckSquare, Settings } from 'lucide-react-native';
// 1. Import hook lấy thông số an toàn của màn hình
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  // 2. Lấy thông số Insets (đo khoảng cách tai thỏ, vạch home...)
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          // 3. CHIỀU CAO ĐỘNG: 60px chuẩn + khoảng cách vạch Home (insets.bottom)
          height: 60 + (insets.bottom > 0 ? insets.bottom : 10),
          // 4. PADDING ĐỘNG: Đẩy nội dung lên trên vạch Home
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 10,
          elevation: 0,
        },
        tabBarActiveTintColor: '#E11D48',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Công việc',
          tabBarIcon: ({ color }) => <CheckSquare size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Cài đặt',
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}