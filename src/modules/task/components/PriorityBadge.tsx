import React from 'react';
import { View, Text } from 'react-native';
import { TaskPriorityType } from '../task.types';

const PRIORITY_CONFIG = {
    HIGH: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-200',
        label: 'Cao'
    },
    MEDIUM: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        label: 'Trung bình'
    },
    LOW: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-200',
        label: 'Thấp'
    },
};

interface PriorityBadgeProps {
    priority: TaskPriorityType;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
    const config = PRIORITY_CONFIG[priority];

    return (
        <View className={`px-2 py-1 rounded border ${config.bg} ${config.border}`}>
            <Text className={`text-xs font-semibold ${config.text}`}>
                {config.label}
            </Text>
        </View>
    );
};
