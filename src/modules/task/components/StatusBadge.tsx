import React from 'react';
import { View, Text } from 'react-native';
import { TaskStatusType } from '../task.types';

const STATUS_CONFIG = {
    TODO: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Chưa làm' },
    IN_PROGRESS: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Đang làm' },
    DONE: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Hoàn thành' },
};

interface StatusBadgeProps {
    status: TaskStatusType;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const config = STATUS_CONFIG[status];

    return (
        <View className={`px-3 py-1 rounded-full ${config.bg}`}>
            <Text className={`text-xs font-medium ${config.text}`}>
                {config.label}
            </Text>
        </View>
    );
};
