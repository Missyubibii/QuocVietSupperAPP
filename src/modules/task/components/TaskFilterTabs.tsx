import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { FilterType } from '../store'; // Import type từ store

interface Props {
    current: FilterType;
    onChange: (status: FilterType) => void;
}

export const TaskFilterTabs = ({ current, onChange }: Props) => {
    // Cấu hình đúng 3 nút theo yêu cầu
    const tabs: { id: FilterType; label: string }[] = [
        { id: 'ALL', label: 'Xem tất cả' },
        { id: 'MINE', label: 'Của tôi' },
        { id: 'IMPORTANT', label: 'Quan trọng' },
    ];

    return (
        <View className="h-12 mb-2">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 4 }}
            >
                {tabs.map((tab) => {
                    const isActive = current === tab.id;
                    return (
                        <TouchableOpacity
                            key={tab.id}
                            onPress={() => onChange(tab.id)}
                            className={`mr-3 px-5 py-2 rounded-full border ${isActive
                                ? 'bg-slate-800 border-slate-800'
                                : 'bg-white border-slate-200'
                                }`}
                        >
                            <Text className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-600'
                                }`}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};