import React from 'react';
import { View, Text } from 'react-native';
import { DynamicIcon } from '../../../components/ui/DynamicIcon';
import { TaskFilter } from '../task.types';

interface EmptyStateProps {
    filter: TaskFilter;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ filter }) => {
    const getMessage = () => {
        switch (filter) {
            case 'MY_TASKS':
                return 'Bạn chưa có công việc nào';
            case 'IMPORTANT':
                return 'Không có công việc quan trọng';
            default:
                return 'Chưa có công việc nào';
        }
    };

    return (
        <View className="flex-1 items-center justify-center px-6 py-20">
            <View className="w-20 h-20 bg-slate-100 rounded-full items-center justify-center mb-4">
                <DynamicIcon name="inbox" size={40} color="#64748b" />
            </View>

            <Text className="text-lg font-bold text-slate-800 mb-2">
                {getMessage()}
            </Text>

            <Text className="text-sm text-slate-600 text-center">
                Nhấn nút + để tạo công việc mới
            </Text>
        </View>
    );
};
