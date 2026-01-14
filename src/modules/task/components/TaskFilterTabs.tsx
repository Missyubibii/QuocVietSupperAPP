import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TaskFilter } from '../task.types';
import { DynamicIcon } from '../../../components/ui/DynamicIcon';

const TABS = [
    { key: 'ALL' as TaskFilter, label: 'Tất cả', icon: 'list' },
    { key: 'MY_TASKS' as TaskFilter, label: 'Của tôi', icon: 'user' },
    { key: 'IMPORTANT' as TaskFilter, label: 'Quan trọng', icon: 'alert-circle' },
];

interface TaskFilterTabsProps {
    current: TaskFilter;
    onChange: (filter: TaskFilter) => void;
}

export const TaskFilterTabs: React.FC<TaskFilterTabsProps> = ({ current, onChange }) => {
    return (
        <View className="bg-white border-b border-slate-200 px-2 py-2">
            <View className="flex-row">
                {TABS.map((tab) => {
                    const isActive = current === tab.key;

                    return (
                        <TouchableOpacity
                            key={tab.key}
                            onPress={() => onChange(tab.key)}
                            className={`flex-1 flex-row items-center justify-center py-2 px-3 rounded-lg mx-1 ${isActive ? 'bg-blue-600' : 'bg-transparent'
                                }`}
                        >
                            <DynamicIcon
                                name={tab.icon}
                                size={16}
                                color={isActive ? '#FFF' : '#64748b'}
                            />
                            <Text className={`text-sm font-medium ml-2 ${isActive ? 'text-white' : 'text-slate-600'
                                }`}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};
