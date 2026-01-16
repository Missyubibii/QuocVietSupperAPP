import React from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList } from 'react-native';
import { DynamicIcon } from '../../../components/ui/DynamicIcon';
import { useNotificationStore, Notification } from '../store';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Props {
    visible: boolean;
    onClose: () => void;
}

export const NotificationModal = ({ visible, onClose }: Props) => {
    const { notifications, markAsRead, markAllAsRead, clearAll } = useNotificationStore();

    const renderItem = ({ item }: { item: Notification }) => {
        let iconName = "info";
        let iconColor = "#3B82F6";
        let bgColor = "bg-blue-50";

        if (item.type === 'SUCCESS') { iconName = "check-circle"; iconColor = "#10B981"; bgColor = "bg-green-50"; }
        if (item.type === 'WARNING') { iconName = "alert-triangle"; iconColor = "#F59E0B"; bgColor = "bg-yellow-50"; }
        if (item.type === 'ERROR') { iconName = "x-circle"; iconColor = "#EF4444"; bgColor = "bg-red-50"; }

        return (
            <TouchableOpacity
                onPress={() => markAsRead(item.id)}
                className={`flex-row p-4 border-b border-gray-100 ${item.isRead ? 'bg-white' : 'bg-blue-50/30'}`}
            >
                <View className={`w-10 h-10 rounded-full ${bgColor} items-center justify-center mr-3`}>
                    <DynamicIcon name={iconName} size={20} color={iconColor} />
                </View>
                <View className="flex-1">
                    <View className="flex-row justify-between items-start">
                        <Text className={`text-sm font-bold mb-1 ${item.isRead ? 'text-gray-700' : 'text-gray-900'}`}>{item.title}</Text>
                        <Text className="text-[10px] text-gray-400">
                            {formatDistanceToNow(item.timestamp, { addSuffix: true, locale: vi })}
                        </Text>
                    </View>
                    <Text className="text-xs text-gray-500 leading-5">{item.message}</Text>
                </View>
                {!item.isRead && <View className="w-2 h-2 bg-red-500 rounded-full mt-2" />}
            </TouchableOpacity>
        );
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-white rounded-t-[30px] h-[80%] overflow-hidden">
                    {/* Header */}
                    <View className="flex-row justify-between items-center p-5 border-b border-gray-100">
                        <Text className="text-xl font-bold text-gray-900">Thông báo</Text>
                        <View className="flex-row gap-4">
                            <TouchableOpacity onPress={markAllAsRead}>
                                <Text className="text-xs font-bold text-blue-600">Đọc tất cả</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onClose} className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center">
                                <DynamicIcon name="x" size={18} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* List */}
                    {notifications.length === 0 ? (
                        <View className="flex-1 items-center justify-center">
                            <DynamicIcon name="bell-off" size={48} color="#E5E7EB" />
                            <Text className="text-gray-400 mt-4">Không có thông báo nào</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={notifications}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                            contentContainerStyle={{ paddingBottom: 40 }}
                        />
                    )}

                    {/* Footer Clear All */}
                    {notifications.length > 0 && (
                        <View className="p-4 border-t border-gray-100">
                            <TouchableOpacity onPress={clearAll} className="w-full py-3 items-center justify-center">
                                <Text className="text-gray-400 text-xs font-bold">Xóa tất cả thông báo</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};