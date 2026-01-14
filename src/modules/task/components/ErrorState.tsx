import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DynamicIcon } from '../../../components/ui/DynamicIcon';

interface ErrorStateProps {
    message: string;
    onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
    return (
        <View className="flex-1 items-center justify-center px-6">
            <View className="w-20 h-20 bg-red-100 rounded-full items-center justify-center mb-4">
                <DynamicIcon name="alert-circle" size={40} color="#DC2626" />
            </View>

            <Text className="text-lg font-bold text-slate-800 mb-2">
                Đã xảy ra lỗi
            </Text>

            <Text className="text-sm text-slate-600 text-center mb-6">
                {message}
            </Text>

            <TouchableOpacity
                onPress={onRetry}
                className="bg-blue-600 px-6 py-3 rounded-xl active:opacity-80"
            >
                <View className="flex-row items-center">
                    <DynamicIcon name="refresh-cw" size={18} color="#FFF" />
                    <Text className="text-white font-bold ml-2">Thử lại</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};
