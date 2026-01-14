import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { CreateTaskSchema, CreateTaskPayload } from '../task.types';
import { useTaskStore } from '../store';

export default function CreateTaskScreen() {
    const router = useRouter();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { createTaskOptimistic, clearError } = useTaskStore();

    const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<CreateTaskPayload>({
        resolver: zodResolver(CreateTaskSchema),
        defaultValues: {
            title: '',
            description: '',
            priority: 'MEDIUM',
            assignee_id: 1001,
            due_date: new Date().toISOString(), // Default to today (ISO string)
        },
    });

    const onSubmit = async (data: CreateTaskPayload) => {
        setIsSubmitting(true);
        clearError();

        try {
            // Ensure date is ISO string
            const payload = {
                ...data,
                due_date: new Date(data.due_date).toISOString(),
            };

            await createTaskOptimistic(payload);

            Alert.alert('Thành công', 'Công việc đã được tạo!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            // Show error (task already rolled back in store)
            Alert.alert(
                'Không thể tạo công việc',
                error.message || 'Vui lòng thử lại sau',
                [
                    { text: 'Hủy', style: 'cancel' },
                    {
                        text: 'Thử lại',
                        onPress: () => handleSubmit(onSubmit)(), // Retry
                    },
                ]
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentDueDate = watch('due_date');

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 24 }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Title Input */}
                <Controller
                    control={control}
                    name="title"
                    render={({ field: { onChange, value } }) => (
                        <View className="mb-4">
                            <Text className="text-sm font-semibold text-slate-700 mb-2">
                                Tiêu đề <Text className="text-red-500">*</Text>
                            </Text>
                            <TextInput
                                className="border border-slate-300 rounded-lg px-4 py-3 text-base"
                                placeholder="Nhập tiêu đề công việc"
                                value={value}
                                onChangeText={onChange}
                                editable={!isSubmitting}
                            />
                            {errors.title && (
                                <Text className="text-red-500 text-sm mt-1">
                                    {errors.title.message}
                                </Text>
                            )}
                        </View>
                    )}
                />

                {/* Description Input */}
                <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, value } }) => (
                        <View className="mb-4">
                            <Text className="text-sm font-semibold text-slate-700 mb-2">
                                Mô tả
                            </Text>
                            <TextInput
                                className="border border-slate-300 rounded-lg px-4 py-3 text-base"
                                placeholder="Nhập mô tả (tùy chọn)"
                                value={value}
                                onChangeText={onChange}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                editable={!isSubmitting}
                            />
                        </View>
                    )}
                />

                {/* Priority Picker */}
                <Controller
                    control={control}
                    name="priority"
                    render={({ field: { onChange, value } }) => (
                        <View className="mb-4">
                            <Text className="text-sm font-semibold text-slate-700 mb-2">
                                Mức độ ưu tiên
                            </Text>
                            <View className="border border-slate-300 rounded-lg overflow-hidden">
                                <Picker
                                    selectedValue={value}
                                    onValueChange={onChange}
                                    enabled={!isSubmitting}
                                >
                                    <Picker.Item label="Cao" value="HIGH" />
                                    <Picker.Item label="Trung bình" value="MEDIUM" />
                                    <Picker.Item label="Thấp" value="LOW" />
                                </Picker>
                            </View>
                        </View>
                    )}
                />

                {/* Due Date Picker */}
                <Controller
                    control={control}
                    name="due_date"
                    render={({ field: { onChange, value } }) => (
                        <View className="mb-6">
                            <Text className="text-sm font-semibold text-slate-700 mb-2">
                                Hạn chót <Text className="text-red-500">*</Text>
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                className="border border-slate-300 rounded-lg px-4 py-3"
                                disabled={isSubmitting}
                            >
                                <Text className="text-base text-slate-800">
                                    {new Date(value).toLocaleDateString('vi-VN')}
                                </Text>
                            </TouchableOpacity>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={new Date(value)}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker(false);
                                        if (selectedDate) {
                                            onChange(selectedDate.toISOString()); // Convert to ISO string
                                        }
                                    }}
                                    minimumDate={new Date()} // Can't select past dates
                                />
                            )}

                            {errors.due_date && (
                                <Text className="text-red-500 text-sm mt-1">
                                    {errors.due_date.message}
                                </Text>
                            )}
                        </View>
                    )}
                />

                {/* Submit Button */}
                <TouchableOpacity
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className={`bg-blue-600 py-4 rounded-xl ${isSubmitting ? 'opacity-50' : ''}`}
                >
                    <View className="flex-row items-center justify-center">
                        {isSubmitting && (
                            <ActivityIndicator size="small" color="#FFF" className="mr-2" />
                        )}
                        <Text className="text-white font-bold text-lg">
                            {isSubmitting ? 'Đang tạo...' : 'Tạo công việc'}
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Extra spacing for keyboard */}
                <View className="h-8" />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
