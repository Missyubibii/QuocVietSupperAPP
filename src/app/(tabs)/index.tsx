import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../modules/auth/store";
import {
  Bell, Search, CalendarDays, CheckSquare, ChevronRight, TrendingUp, Clock
} from "lucide-react-native";

import { useState } from "react";
import { NotificationModal } from "../../modules/notification/components/NotificationModal";
import { useNotificationStore } from "../../modules/notification/store";

// ✅ Đã sửa màu thành HEX
const PRIMARY_COLOR = "#E11D48";

export default function IndexScreen() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [showNotifications, setShowNotifications] = useState(false);
  const { unreadCount } = useNotificationStore(); // Lấy số lượng chưa đọc

  // Widget Thống kê (Giữ nguyên logic cũ của bạn)
  const QuickStats = () => (
    <View className="flex-row gap-3 mb-6">
      <View className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <View className="flex-row items-center justify-between mb-2">
          <View className="bg-blue-50 p-2 rounded-lg"><Clock size={18} color="#2563EB" /></View>
          <Text className="text-xs font-bold text-green-600">+2 công</Text>
        </View>
        <Text className="text-2xl font-bold text-gray-900">24.5</Text>
        <Text className="text-xs text-gray-500 font-medium">Công tháng này</Text>
      </View>
      <View className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <View className="flex-row items-center justify-between mb-2">
          <View className="bg-orange-50 p-2 rounded-lg"><CheckSquare size={18} color="#EA580C" /></View>
          <Text className="text-xs font-bold text-red-500">-1 task</Text>
        </View>
        <Text className="text-2xl font-bold text-gray-900">12</Text>
        <Text className="text-xs text-gray-500 font-medium">Việc cần làm</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#F2F4F8]">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="bg-white px-5 py-3 flex-row justify-between items-center border-b border-gray-100 shadow-sm">
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/profile')} className="flex-row items-center gap-3">
            <Image source={{ uri: user?.avatar || "https://ui-avatars.com/api/?name=User" }} className="w-10 h-10 rounded-full border border-gray-100" />
            <View>
              <Text className="text-xs font-medium text-gray-500">Xin chào,</Text>
              <Text className="text-base font-bold text-gray-900">{user?.name || "Nhân viên"}</Text>
            </View>
          </TouchableOpacity>
          <View className="flex-row gap-3">
            <TouchableOpacity className="w-9 h-9 bg-gray-50 rounded-full items-center justify-center">
              <Search size={20} color="#64748B" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowNotifications(true)}
              className="w-9 h-9 bg-gray-50 rounded-full items-center justify-center relative">
              <Bell size={20} color="#64748B" />
              {/* Hiển thị chấm đỏ nếu có thông báo mới */}
              {unreadCount > 0 && (
                <View className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border border-white items-center justify-center">
                  <Text className="text-[8px] text-white font-bold">{unreadCount > 9 ? '9+' : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
          <Text className="text-lg font-bold text-gray-800 mb-4">Tổng quan hôm nay</Text>
          <QuickStats />

          <Text className="text-lg font-bold text-gray-800 mb-4">Ứng dụng</Text>

          {/* Nút Chấm Công */}
          <TouchableOpacity onPress={() => router.push('/attendance')} activeOpacity={0.9} className="mb-4 bg-white rounded-2xl p-4 flex-row items-center shadow-sm border border-gray-100">
            <View className="w-14 h-14 rounded-xl bg-blue-600 items-center justify-center mr-4 shadow-lg shadow-blue-200">
              <CalendarDays size={28} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900">Chấm công</Text>
              <Text className="text-sm text-gray-500">Check-in/out, Lịch sử công</Text>
            </View>
            <View className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center"><ChevronRight size={18} color="#9CA3AF" /></View>
          </TouchableOpacity>

          {/* Nút Công Việc (Link sang Tab Tasks) */}
          <TouchableOpacity onPress={() => router.push('/(tabs)/tasks')} activeOpacity={0.9} className="mb-4 bg-white rounded-2xl p-4 flex-row items-center shadow-sm border border-gray-100">
            <View className="w-14 h-14 rounded-xl bg-orange-500 items-center justify-center mr-4 shadow-lg shadow-orange-200">
              <CheckSquare size={28} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900">Công việc</Text>
              <Text className="text-sm text-gray-500">Danh sách, KPI, Tiến độ</Text>
            </View>
            <View className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center"><ChevronRight size={18} color="#9CA3AF" /></View>
          </TouchableOpacity>

          <View className="h-24" />
        </ScrollView>
        <NotificationModal visible={showNotifications} onClose={() => setShowNotifications(false)} />
      </SafeAreaView>
    </View>
  );
}