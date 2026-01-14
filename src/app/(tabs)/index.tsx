import React, { useState } from 'react';
import { View, ScrollView, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LayoutEngine } from '../../core/sdui/LayoutEngine';
import { GradientBlob } from '../../components/ui/GradientBlob';
import { homeScreenMock } from '../../modules/home/home.mock';
import { WidgetBlock } from '../../core/sdui/types';

/**
 * Home Screen - Main Dashboard
 * Features:
 * - Server-Driven UI
 * - Hidden Debug Trigger (Tap avatar 5 times)
 */

export default function HomeScreen() {
  const router = useRouter();
  const [tapCount, setTapCount] = useState(0);

  // Xử lý logic bấm 5 lần vào vùng Avatar để mở Debug
  const handleDebugTrigger = () => {
    const newCount = tapCount + 1;
    if (newCount >= 5) {
      Alert.alert("System Developer", "Đang mở chế độ Debug System...", [
        { text: "OK", onPress: () => router.push('/debug') }
      ]);
      setTapCount(0);
    } else {
      setTapCount(newCount);
    }
  };

  return (
    <View className="flex-1 bg-slate-100">
      <StatusBar barStyle="dark-content" />

      {/* Background Gradient Blobs */}
      <GradientBlob color="blue" position="top-left" size={400} />
      <GradientBlob color="purple" position="bottom-right" size={400} />

      {/* --- INVISIBLE OVERLAY (Vùng bấm tàng hình đè lên Avatar) --- 
          Vị trí: top-12 (tương ứng thanh status bar + padding), left-4 
          Kích thước: w-16 h-16 (bằng kích thước avatar)
      */}
      <View className="absolute top-12 left-4 z-50 w-20 h-20">
        <TouchableOpacity
          className="w-full h-full"
          onPress={handleDebugTrigger}
          activeOpacity={1} // Không nháy khi bấm
        />
      </View>

      {/* Main Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: 120, // Prevent tab bar from hiding content
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* FIX LỖI TYPE: Ép kiểu dữ liệu Mock sang WidgetBlock[] */}
        <LayoutEngine layout={homeScreenMock as unknown as WidgetBlock[]} />
      </ScrollView>
    </View>
  );
}