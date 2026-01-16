import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Mail, Phone, MapPin, Briefcase, Building } from 'lucide-react-native';
import { useAuthStore } from '../../modules/auth/store';

export default function ProfileScreen() {
    const router = useRouter();
    const { user } = useAuthStore();

    const InfoRow = ({ icon: Icon, label, value }: any) => (
        <View className="flex-row items-start py-4 border-b border-gray-50">
            <View className="w-8 pt-0.5">
                <Icon size={18} color="#6B7280" />
            </View>
            <View className="flex-1">
                <Text className="text-xs text-gray-400 mb-0.5">{label}</Text>
                <Text className="text-sm font-medium text-gray-800">{value || "Chưa cập nhật"}</Text>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-white">
            <SafeAreaView className="flex-1">
                {/* Navbar */}
                <View className="px-4 py-2 flex-row items-center border-b border-gray-100">
                    <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                        <ChevronLeft size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text className="text-lg font-bold text-gray-900 ml-2">Hồ sơ nhân viên</Text>
                </View>

                <ScrollView className="flex-1">
                    {/* Header Background */}
                    <View className="h-32 bg-red-500/10 items-center justify-center">
                        <Building size={48} color="#FECACA" />
                    </View>

                    {/* Avatar Section */}
                    <View className="px-5 -mt-12 mb-6">
                        <Image
                            source={{ uri: user?.avatar || "https://ui-avatars.com/api/?name=User" }}
                            className="w-24 h-24 rounded-full border-4 border-white shadow-sm"
                        />
                        <View className="mt-3">
                            <Text className="text-2xl font-bold text-gray-900">{user?.name}</Text>
                            <Text className="text-blue-600 font-medium">{user?.position || "Nhân viên chính thức"}</Text>
                        </View>
                    </View>

                    {/* Details Section */}
                    <View className="px-5">
                        <Text className="text-lg font-bold text-gray-900 mb-2">Thông tin chi tiết</Text>

                        <InfoRow icon={Briefcase} label="Mã nhân viên" value={`QVC-${user?.id || '001'}`} />
                        <InfoRow icon={Building} label="Phòng ban" value="Phòng Kỹ thuật" />
                        <InfoRow icon={Mail} label="Email" value={user?.email} />
                        <InfoRow icon={Phone} label="Số điện thoại" value="+84 999 999 999" />
                        <InfoRow icon={MapPin} label="Địa chỉ" value="Vinh, Nghệ An" />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}