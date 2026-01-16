import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronRight, LogOut, Trash2, Shield, Star, Info, Settings as SettingsIcon } from 'lucide-react-native';
import { useAuthStore } from '../../modules/auth/store';

const APP_VERSION = "1.0.0";

export default function SettingsScreen() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      { text: "Đăng xuất", style: "destructive", onPress: async () => { await logout(); router.replace('/(auth)/login'); } }
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert("Xóa tài khoản", "Yêu cầu sẽ được xử lý trong 30 ngày. Dữ liệu không thể phục hồi.", [
      { text: "Hủy", style: "cancel" },
      { text: "Gửi yêu cầu", style: "destructive" }
    ]);
  };

  const MenuSection = ({ title, children }: any) => (
    <View className="mb-6">
      <Text className="text-xs font-bold text-gray-400 uppercase mb-2 ml-4">{title}</Text>
      <View className="bg-white border-y border-gray-100">{children}</View>
    </View>
  );

  const MenuItem = ({ icon: Icon, label, color = "#4B5563", onPress, isDestructive = false }: any) => (
    <TouchableOpacity onPress={onPress} className="flex-row items-center justify-between p-4 border-b border-gray-50 active:bg-gray-50">
      <View className="flex-row items-center gap-3">
        <View className={`w-8 h-8 rounded-lg items-center justify-center ${isDestructive ? 'bg-red-50' : 'bg-gray-50'}`}>
          <Icon size={18} color={isDestructive ? '#EF4444' : color} />
        </View>
        <Text className={`font-medium ${isDestructive ? 'text-red-500' : 'text-gray-700'}`}>{label}</Text>
      </View>
      <ChevronRight size={16} color="#D1D5DB" />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#F2F4F8]">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="bg-white p-4 border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-900">Cài đặt</Text>
        </View>

        <ScrollView className="flex-1 pt-4">
          {/* User Info Card */}
          <TouchableOpacity onPress={() => router.push('/profile')} className="bg-white mx-4 p-4 rounded-xl flex-row items-center gap-4 mb-6 shadow-sm border border-gray-100">
            <Image source={{ uri: user?.avatar || "https://ui-avatars.com/api/?name=User" }} className="w-14 h-14 rounded-full border border-gray-100" />
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900">{user?.name}</Text>
              <Text className="text-sm text-gray-500">Xem hồ sơ cá nhân</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <MenuSection title="Ứng dụng">
            <MenuItem icon={SettingsIcon} label="Thiết lập chung" />
            <MenuItem icon={Shield} label="Tài khoản & Bảo mật" />
            <MenuItem icon={Star} label="Đánh giá ứng dụng" onPress={() => Linking.openURL('https://apps.apple.com')} />
          </MenuSection>

          <MenuSection title="Thông tin">
            <MenuItem icon={Info} label={`Phiên bản ${APP_VERSION}`} />
          </MenuSection>

          <MenuSection title="Vùng nguy hiểm">
            <MenuItem icon={LogOut} label="Đăng xuất" onPress={handleLogout} />
            <MenuItem icon={Trash2} label="Yêu cầu xóa tài khoản" isDestructive onPress={handleDeleteAccount} />
          </MenuSection>

          <View className="h-10" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}