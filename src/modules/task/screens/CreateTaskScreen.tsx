import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DynamicIcon } from '../../../components/ui/DynamicIcon';
import { CreateTaskSchema, CreateTaskPayload, TaskPriorityType } from '../task.types';
import { useTaskStore } from '../store';
import { useNotificationStore } from '../../notification/store'; // Gọi thông báo
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateTaskScreen() {
    const router = useRouter();
    const { addTask } = useTaskStore();
    const { addNotification } = useNotificationStore();
    const [loading, setLoading] = useState(false);

    // Date Picker State
    const [showDatePicker, setShowDatePicker] = useState(false);

    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreateTaskPayload>({
        resolver: zodResolver(CreateTaskSchema),
        defaultValues: {
            title: '',
            description: '',
            priority: 'MEDIUM',
            assignee_id: 1, // Mặc định ID user hiện tại
            due_date: new Date().toISOString(),
        }
    });

    const selectedDate = watch('due_date');
    const selectedPriority = watch('priority');

    const onSubmit = async (data: CreateTaskPayload) => {
        setLoading(true);
        try {
            // 1. Tạo đối tượng Task hoàn chỉnh
            const newTask = {
                id: Math.random().toString(36).substr(2, 9), // Tạo ID String
                title: data.title,
                description: data.description || "",
                status: "TODO", // Mặc định là TODO
                priority: data.priority,
                assignee_id: data.assignee_id,
                assignee_name: "Tôi", // Hardcode tạm
                assignee_avatar: "https://ui-avatars.com/api/?name=Toi",
                due_date: data.due_date,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            // 2. Thêm vào Store
            // @ts-ignore (Bỏ qua lỗi check type ngặt nghèo tạm thời nếu có)
            addTask(newTask);

            // 3. Thông báo thành công
            addNotification("Thành công", `Đã tạo công việc: ${data.title}`, "SUCCESS");

            // 4. Đóng modal
            router.back();
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Không thể tạo công việc. Vui lòng kiểm tra lại.');
        } finally {
            setLoading(false);
        }
    };

    const PriorityButton = ({ value, label, color }: { value: TaskPriorityType, label: string, color: string }) => (
        <TouchableOpacity
            onPress={() => setValue('priority', value)}
            className={`flex-1 py-3 rounded-xl border items-center justify-center mr-2 ${selectedPriority === value ? `bg-${color}-50 border-${color}-500` : 'bg-white border-gray-200'}`}
        >
            <Text className={`font-bold ${selectedPriority === value ? `text-${color}-600` : 'text-gray-500'}`}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
            {/* Header Modal */}
            <View className="px-5 py-4 border-b border-gray-100 flex-row justify-between items-center">
                <TouchableOpacity onPress={() => router.back()}>
                    <Text className="text-gray-500 text-base">Hủy</Text>
                </TouchableOpacity>
                <Text className="text-lg font-bold text-gray-900">Công việc mới</Text>
                <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={loading}>
                    <Text className={`text-base font-bold ${loading ? 'text-gray-300' : 'text-blue-600'}`}>Lưu</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-5 pt-6">
                {/* Title */}
                <View className="mb-6">
                    <Text className="text-sm font-bold text-gray-700 mb-2">Tên công việc <Text className="text-red-500">*</Text></Text>
                    <Controller
                        control={control}
                        name="title"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 text-base"
                                placeholder="Ví dụ: Làm báo cáo tháng..."
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    {errors.title && <Text className="text-red-500 text-xs mt-1">{errors.title.message}</Text>}
                </View>

                {/* Description */}
                <View className="mb-6">
                    <Text className="text-sm font-bold text-gray-700 mb-2">Mô tả chi tiết</Text>
                    <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 text-base h-32"
                                placeholder="Nhập mô tả..."
                                value={value}
                                onChangeText={onChange}
                                multiline
                                textAlignVertical="top"
                            />
                        )}
                    />
                </View>

                {/* Priority */}
                <View className="mb-6">
                    <Text className="text-sm font-bold text-gray-700 mb-2">Mức độ ưu tiên</Text>
                    <View className="flex-row">
                        <PriorityButton value="HIGH" label="Cao" color="red" />
                        <PriorityButton value="MEDIUM" label="TB" color="orange" />
                        <PriorityButton value="LOW" label="Thấp" color="blue" />
                    </View>
                </View>

                {/* Due Date */}
                <View className="mb-6">
                    <Text className="text-sm font-bold text-gray-700 mb-2">Hạn hoàn thành</Text>
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl p-4"
                    >
                        <DynamicIcon name="calendar" size={20} color="#6B7280" />
                        <Text className="ml-3 text-gray-900 font-medium">
                            {new Date(selectedDate).toLocaleDateString('vi-VN')}
                        </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={new Date(selectedDate)}
                            mode="date"
                            display="default"
                            onChange={(event, date) => {
                                setShowDatePicker(false);
                                if (date) setValue('due_date', date.toISOString());
                            }}
                        />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}