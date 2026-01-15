import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ChevronRight,
  LogOut,
  Trash2,
} from 'lucide-react-native';
import { useAuthStore } from '../../modules/auth/store';

// Component hiển thị từng dòng menu (Row Item)
const SettingItem = ({ icon: Icon, label, onPress, isDestructive = false, showArrow = true, value = null }: any) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-between p-4 bg-white border-b border-gray-100 active:bg-gray-50"
  >
    <View className="flex-row items-center gap-3">
      <View className={`p-2 rounded-full ${isDestructive ? 'bg-red-50' : 'bg-blue-50'}`}>
        <Icon size={20} color={isDestructive ? '#ef4444' : '#0065FF'} />
      </View>
      <Text className={`text-base font-medium ${isDestructive ? 'text-red-500' : 'text-slate-700'}`}>
        {label}
      </Text>
    </View>

    {value !== null ? (
      <View>{value}</View>
    ) : showArrow ? (
      <ChevronRight size={20} color="#94a3b8" />
    ) : null}
  </TouchableOpacity>
);

// Component nhóm (Section)
const SettingSection = ({ title, children }: any) => (
  <View className="mb-4">
    {title && <Text className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase">{title}</Text>}
    <View className="bg-white border-y border-gray-100">
      {children}
    </View>
  </View>
);

export default function SettingsScreen() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đồng ý",
          style: "destructive",
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  // Hàm giả lập tính năng chưa có
  // const handleComingSoon = () => {
  //   handleAction({ type: 'COMING_SOON', payload: {} });
  // };

  // Apple Guideline 5.1.1(v): Account Deletion
  const handleAccountDeletion = () => {
    Alert.alert(
      "Xóa tài khoản",
      "Yêu cầu xóa tài khoản sẽ được xử lý trong vòng 30 ngày. Mọi dữ liệu của bạn sẽ bị xóa vĩnh viễn. Liên hệ quản trị viên để hủy yêu cầu.\n\nBạn có chắc chắn muốn tiếp tục?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa tài khoản",
          style: "destructive",
          onPress: () => {
            // TODO: Call API to request account deletion
            // Show confirmation feedback (Apple HIG requirement)
            Alert.alert(
              "Thành công",
              "Yêu cầu xóa tài khoản của bạn đã được ghi nhận và sẽ xử lý trong 30 ngày. Vui lòng kiểm tra email để biết thêm chi tiết."
            );
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-slate-100">
      <SafeAreaView edges={['top']} className="bg-white">
        {/* HEADER GIỐNG MISA */}
        <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
          <Image
            source={{ uri: user?.avatar || 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff' }}
            className="w-16 h-16 rounded-full border-2 border-blue-100"
          />
          <View className="ml-4 flex-1">
            <Text className="text-lg font-bold text-slate-800">{user?.name || 'Nguyễn Quốc Việt'}</Text>
            <Text className="text-sm text-slate-500">{user?.position || 'Administrator'}</Text>

            {/* Commented out per Apple Guideline 2.1 - No incomplete features */}
            {/* <TouchableOpacity onPress={handleComingSoon}>
              <Text className="text-blue-600 text-sm mt-1 font-medium">Chỉnh sửa hồ sơ</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="h-4" />

        {/* SECTION 1: TÀI KHOẢN & AN NINH */}
        {/* Commented out incomplete features per Apple Guideline 2.1 */}
        {/* <SettingSection title="Tài khoản">
          <SettingItem icon={User} label="Thông tin cá nhân" onPress={handleComingSoon} />
          <SettingItem icon={ShieldCheck} label="Đổi mật khẩu & Bảo mật" onPress={handleComingSoon} />
          <SettingItem
            icon={Bell}
            label="Thông báo"
            value={<Switch value={true} trackColor={{ false: "#767577", true: "#0065FF" }} />}
            onPress={() => { }} // Switch toggle
            showArrow={false}
          />
        </SettingSection> */}

        {/* SECTION 2: ỨNG DỤNG */}
        {/* Commented out incomplete features per Apple Guideline 2.1 */}
        {/* <SettingSection title="Ứng dụng">
          <SettingItem icon={Moon} label="Giao diện (Dark Mode)" onPress={handleComingSoon} />
          <SettingItem icon={FileText} label="Điều khoản sử dụng" onPress={handleComingSoon} />
          <SettingItem icon={HelpCircle} label="Trợ giúp & Hỗ trợ" onPress={handleComingSoon} />
        </SettingSection> */}

        {/* SECTION 3: DANGER ZONE */}
        <SettingSection>
          <SettingItem
            icon={LogOut}
            label="Đăng xuất"
            onPress={handleLogout}
            isDestructive={true}
            showArrow={false}
          />
          {/* Apple Guideline 5.1.1(v): Account Deletion Required */}
          <SettingItem
            icon={Trash2}
            label="Yêu cầu xóa tài khoản"
            onPress={handleAccountDeletion}
            isDestructive={true}
            showArrow={false}
          />
        </SettingSection>

        <View className="items-center py-6">
          <Text className="text-xs text-gray-400">QuocViet Super App v1.0.0 (Build 20260113)</Text>
          <Text className="text-xs text-gray-400 mt-1">Powered by React Native & Expo</Text>
        </View>

        {/* Padding bottom cho safe area */}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}