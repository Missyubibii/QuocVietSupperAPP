import { View, ScrollView, StatusBar } from 'react-native';
import { LayoutEngine } from '../../core/sdui/LayoutEngine';
import { GradientBlob } from '../../components/ui/GradientBlob';
import { homeScreenMock } from '../../modules/home/home.mock';
import { HeaderBannerData } from '../../core/sdui/types';

/**
 * Home Screen - Main Dashboard (Chapter 9)
 * Features:
 * - Server-Driven UI with LayoutEngine
 * - GradientBlob backgrounds (Android-safe)
 * - Padding bottom to prevent tab bar occlusion
 */

export default function HomeScreen() {
  const headerBannerData: HeaderBannerData = {
    userName: 'John Doe',
    userAvatar: 'https://example.com/avatar.jpg',
    notificationCount: 5,
    notificationAction: () => console.log('Notification action'),
    title: 'Home',
    bg_color: '#000000',
  };
  return (
    <View className="flex-1 bg-slate-100">
      <StatusBar barStyle="dark-content" />

      {/* Background Gradient Blobs */}
      <GradientBlob color="blue" position="top-left" size={400} />
      <GradientBlob color="purple" position="bottom-right" size={400} />

      {/* Main Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: 120, // Prevent tab bar from hiding content
        }}
        showsVerticalScrollIndicator={false}
      >
        <LayoutEngine layout={homeScreenMock} />
      </ScrollView>
    </View>
  );
}


