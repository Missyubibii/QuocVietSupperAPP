import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl, Alert, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTaskStore } from '../store';
import { useAuthStore } from '../../auth/store';
import { useNotificationStore } from '../../notification/store';
import { Task } from '../task.types';
import { TaskItem } from '../components/TaskItem';
import { TaskFilterTabs } from '../components/TaskFilterTabs';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { DynamicIcon } from '../../../components/ui/DynamicIcon';

export default function TaskListScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const {
        tasks,
        currentFilter,
        isLoading,
        error,
        setFilter,
        fetchTasks,
        clearError,
        deleteTasks
    } = useTaskStore();
    const { addNotification } = useNotificationStore();

    const [refreshing, setRefreshing] = useState(false);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const filteredTasks = useMemo(() => {
        switch (currentFilter) {
            case 'MINE':
                return tasks.filter(t => t.assignee_id === Number(user?.id) || t.assignee_name === "Tôi");

            case 'IMPORTANT':
                return tasks.filter(t => t.priority === 'HIGH');

            case 'ALL':
            default:
                // Hiển thị tất cả
                return tasks;
        }
    }, [tasks, currentFilter, user]);

    useEffect(() => {
        fetchTasks();
    }, []);

    // Xử lý nút Back trên Android khi đang chọn
    useEffect(() => {
        const backAction = () => {
            if (isSelectionMode) {
                exitSelectionMode();
                return true;
            }
            return false;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, [isSelectionMode]);

    const exitSelectionMode = () => {
        setIsSelectionMode(false);
        setSelectedIds([]);
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchTasks();
        setRefreshing(false);
    }, [fetchTasks]);

    // Xử lý nhấn giữ (Long Press) -> Vào chế độ chọn
    const handleLongPress = useCallback((task: Task) => {
        setIsSelectionMode(true);
        setSelectedIds([task.id]);
    }, []);

    // Xử lý nhấn (Press)
    const handlePress = useCallback((task: Task) => {
        if (isSelectionMode) {
            // Nếu đang chọn -> Toggle chọn
            setSelectedIds(prev => {
                const isSelected = prev.includes(task.id);
                const newIds = isSelected ? prev.filter(id => id !== task.id) : [...prev, task.id];

                if (newIds.length === 0) setIsSelectionMode(false);
                return newIds;
            });
        } else {
            // Nếu bình thường -> Log hoặc Nav
            console.log('Task pressed:', task.id);
        }
    }, [isSelectionMode]);

    // Xử lý Xóa
    const handleDeleteSelected = () => {
        Alert.alert(
            "Xác nhận xóa",
            `Bạn có chắc chắn muốn xóa ${selectedIds.length} công việc đã chọn?`,
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: () => {
                        deleteTasks(selectedIds);
                        addNotification("Đã xóa", `Đã xóa ${selectedIds.length} công việc`, "WARNING");
                        exitSelectionMode();
                    }
                }
            ]
        );
    };

    const renderItem = useCallback(({ item }: { item: Task }) => (
        <TaskItem
            task={item}
            onPress={handlePress}
            onLongPress={handleLongPress}
            isSelected={selectedIds.includes(item.id)}
        />
    ), [handlePress, handleLongPress, selectedIds]);

    const keyExtractor = useCallback((item: Task) => item.id.toString(), []);

    // Error State
    if (error && tasks.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-[#F2F4F8]" edges={['top']}>
                <TaskFilterTabs current={currentFilter} onChange={setFilter} />
                <ErrorState message={error} onRetry={() => { clearError(); fetchTasks(); }} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#F2F4F8]" edges={['top']}>

            {/* HEADER ĐỘNG (Bình thường vs Chọn nhiều) */}
            <View className={`px-5 py-4 flex-row justify-between items-center border-b shadow-sm h-16 ${isSelectionMode ? 'bg-blue-50 border-blue-100' : 'bg-white border-gray-100'}`}>
                {isSelectionMode ? (
                    <>
                        <View className="flex-row items-center gap-3">
                            <TouchableOpacity onPress={exitSelectionMode}>
                                <DynamicIcon name="x" size={24} color="#1F2937" />
                            </TouchableOpacity>
                            <Text className="text-lg font-bold text-blue-900">Đã chọn {selectedIds.length}</Text>
                        </View>
                        <TouchableOpacity onPress={handleDeleteSelected}>
                            <DynamicIcon name="trash-2" size={24} color="#EF4444" />
                        </TouchableOpacity>
                    </>
                ) : (
                    <Text className="text-2xl font-bold text-gray-900">Công việc</Text>
                )}
            </View>

            {/* Filter Tabs (Chỉ hiện khi ko chọn) */}
            {!isSelectionMode && (
                <View className="pt-2">
                    <TaskFilterTabs current={currentFilter} onChange={setFilter} />
                </View>
            )}

            {/* Task List */}
            <FlatList
                data={filteredTasks}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                refreshControl={
                    <RefreshControl refreshing={refreshing || isLoading} onRefresh={onRefresh} colors={['#E11D48']} />
                }
                ListEmptyComponent={<EmptyState filter={currentFilter} />}
                contentContainerStyle={{ paddingVertical: 8, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />

            {/* FAB (Ẩn khi đang chọn) */}
            {!isSelectionMode && (
                <TouchableOpacity
                    onPress={() => router.push('/task/create')}
                    className="absolute bottom-6 right-6 w-14 h-14 bg-[#E11D48] rounded-full items-center justify-center shadow-lg active:opacity-80"
                    style={{ elevation: 8 }}
                >
                    <DynamicIcon name="plus" size={24} color="#FFF" />
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
}